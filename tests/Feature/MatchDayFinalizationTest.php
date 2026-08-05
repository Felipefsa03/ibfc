<?php

use App\Models\MatchDay;
use App\Models\Player;
use App\Models\Team;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

/**
 * Build a match day with one team holding the given players.
 *
 * @param  list<Player>  $players
 */
function matchDayWith(array $players): MatchDay
{
    $matchDay = MatchDay::factory()->create([
        'number_of_teams' => 2,
        'players_per_team' => 5,
    ]);

    $team = Team::factory()->create(['match_day_id' => $matchDay->id]);

    foreach ($players as $player) {
        $team->teamPlayers()->create(['player_id' => $player->id]);
    }

    return $matchDay;
}

it('records the performance of each called-up player', function () {
    $player = Player::factory()->create();
    $matchDay = matchDayWith([$player]);

    $this->post(route('matchDays.finalize.store', $matchDay), [
        'stats' => [
            [
                'player_id' => $player->id,
                'goals' => 2,
                'assists' => 1,
                'decisive_passes' => 4,
                'stars' => 5,
            ],
        ],
    ])->assertRedirect(route('matchDays.show', $matchDay));

    $this->assertDatabaseHas('player_day_stats', [
        'match_day_id' => $matchDay->id,
        'player_id' => $player->id,
        'goals' => 2,
        'assists' => 1,
        'decisive_passes' => 4,
        'stars' => 5,
    ]);
});

it('charges the participation penalty and pays out performance on pas and sho', function () {
    // 2 goals (+2), 1 assist (+0.5), 4 decisive passes (+2) = +4.5 performance.
    // 5 stars = +2.5 on every attribute. Net on pas/sho: 4.5 + 2.5 - 7 = 0.
    $player = Player::factory()->create([
        'pas' => 50, 'sho' => 50, 'gol' => 50, 'dri' => 50, 'def' => 50, 'phy' => 50,
    ]);
    $matchDay = matchDayWith([$player]);

    $this->post(route('matchDays.finalize.store', $matchDay), [
        'stats' => [[
            'player_id' => $player->id,
            'goals' => 2, 'assists' => 1, 'decisive_passes' => 4, 'stars' => 5,
        ]],
    ])->assertRedirect();

    $player->refresh();

    expect($player->pas)->toBe(50)
        ->and($player->sho)->toBe(50)
        // Stars alone lift the remaining attributes by 2.5, rounded to 53.
        ->and($player->gol)->toBe(53)
        ->and($player->dri)->toBe(53)
        ->and($player->def)->toBe(53)
        ->and($player->phy)->toBe(53);
});

it('decays a player who produced nothing', function () {
    $player = Player::factory()->create(['pas' => 60, 'sho' => 60]);
    $matchDay = matchDayWith([$player]);

    $this->post(route('matchDays.finalize.store', $matchDay), [
        'stats' => [[
            'player_id' => $player->id,
            'goals' => 0, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0,
        ]],
    ])->assertRedirect();

    $player->refresh();

    expect($player->pas)->toBe(53)
        ->and($player->sho)->toBe(53);
});

it('recalculates the overall from the new attributes', function () {
    $player = Player::factory()->create([
        'gol' => 60, 'sho' => 60, 'pas' => 60, 'dri' => 60, 'def' => 60, 'phy' => 60,
    ]);
    $matchDay = matchDayWith([$player]);

    $this->post(route('matchDays.finalize.store', $matchDay), [
        'stats' => [[
            'player_id' => $player->id,
            'goals' => 0, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0,
        ]],
    ])->assertRedirect();

    $player->refresh();

    // pas and sho drop to 53, the other four stay at 60: average is 57.67 -> 58.
    expect($player->current_overall)->toBe(58)
        ->and($player->overall_base)->toBe(58);
});

it('never pushes an attribute outside 0 and 99', function () {
    $player = Player::factory()->create([
        'gol' => 98, 'sho' => 98, 'pas' => 2, 'dri' => 98, 'def' => 98, 'phy' => 98,
    ]);
    $matchDay = matchDayWith([$player]);

    $this->post(route('matchDays.finalize.store', $matchDay), [
        'stats' => [[
            'player_id' => $player->id,
            'goals' => 30, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 5,
        ]],
    ])->assertRedirect();

    $player->refresh();

    expect($player->sho)->toBe(99)
        ->and($player->gol)->toBe(99)
        ->and($player->pas)->toBeGreaterThanOrEqual(0)
        ->and($player->pas)->toBeLessThanOrEqual(99);
});

it('marks the match day as finalized', function () {
    $player = Player::factory()->create();
    $matchDay = matchDayWith([$player]);

    $this->post(route('matchDays.finalize.store', $matchDay), [
        'stats' => [[
            'player_id' => $player->id,
            'goals' => 1, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 3,
        ]],
    ])->assertRedirect();

    expect($matchDay->fresh()->isFinalized())->toBeTrue();
});

it('refuses to finalize the same match day twice', function () {
    $player = Player::factory()->create(['pas' => 60, 'sho' => 60]);
    $matchDay = matchDayWith([$player]);
    $matchDay->forceFill(['finalized_at' => now()])->save();

    $this->post(route('matchDays.finalize.store', $matchDay), [
        'stats' => [[
            'player_id' => $player->id,
            'goals' => 0, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0,
        ]],
    ])->assertRedirect()->assertSessionHas('error');

    // The penalty must not be charged a second time.
    expect($player->fresh()->pas)->toBe(60);
});

it('rejects a player who was not called up for the match day', function () {
    $called = Player::factory()->create();
    $outsider = Player::factory()->create();
    $matchDay = matchDayWith([$called]);

    $this->post(route('matchDays.finalize.store', $matchDay), [
        'stats' => [[
            'player_id' => $outsider->id,
            'goals' => 1, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0,
        ]],
    ])->assertSessionHasErrors('stats.0.player_id');

    $this->assertDatabaseCount('player_day_stats', 0);
});

it('rejects out-of-range values', function () {
    $player = Player::factory()->create();
    $matchDay = matchDayWith([$player]);

    $this->post(route('matchDays.finalize.store', $matchDay), [
        'stats' => [[
            'player_id' => $player->id,
            'goals' => -1, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 9,
        ]],
    ])->assertSessionHasErrors(['stats.0.goals', 'stats.0.stars']);

    expect($matchDay->fresh()->isFinalized())->toBeFalse();
});

it('blocks balancing after the match day is finalized', function () {
    $player = Player::factory()->create();
    $matchDay = matchDayWith([$player]);
    $matchDay->forceFill(['finalized_at' => now()])->save();

    $this->post(route('matchDays.balance', $matchDay))
        ->assertRedirect()
        ->assertSessionHas('error');
});

it('sends the operator back when there is nobody to score', function () {
    $matchDay = MatchDay::factory()->create();

    $this->get(route('matchDays.finalize', $matchDay))
        ->assertRedirect(route('matchDays.show', $matchDay))
        ->assertSessionHas('error');
});
