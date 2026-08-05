<?php

use App\Models\MatchDay;
use App\Models\Player;
use App\Models\PlayerDayStat;
use App\Models\Team;
use App\Services\PlayerStatisticsService;

/**
 * Two teams, one marked as the winner, on a given date. Returns the teams so
 * the caller can attach whichever players they need to each side.
 *
 * @return array{0: MatchDay, 1: Team, 2: Team}
 */
function twoTeamMatchDay(string $date): array
{
    $matchDay = MatchDay::factory()->create(['date' => $date]);
    $winner = Team::factory()->winner()->create(['match_day_id' => $matchDay->id]);
    $loser = Team::factory()->create(['match_day_id' => $matchDay->id]);

    return [$matchDay, $winner, $loser];
}

function service(): PlayerStatisticsService
{
    return app(PlayerStatisticsService::class);
}

it('gives a player with no recorded performance all-zero totals', function () {
    $player = Player::factory()->create();

    expect(service()->totalsFor($player))->toBe([
        'games' => 0, 'goals' => 0, 'assists' => 0, 'decisive_passes' => 0,
        'avg_stars' => 0.0, 'wins' => 0, 'draws' => 0, 'losses' => 0,
    ]);
});

it('sums goals, assists, decisive passes and averages stars across match days', function () {
    $player = Player::factory()->create();
    [$matchDay1, $team] = twoTeamMatchDay(now()->subDays(10)->toDateString());
    $team->teamPlayers()->create(['player_id' => $player->id]);
    PlayerDayStat::create(['match_day_id' => $matchDay1->id, 'player_id' => $player->id, 'goals' => 3, 'assists' => 1, 'decisive_passes' => 2, 'stars' => 4]);

    [$matchDay2, $team2] = twoTeamMatchDay(now()->subDays(5)->toDateString());
    $team2->teamPlayers()->create(['player_id' => $player->id]);
    PlayerDayStat::create(['match_day_id' => $matchDay2->id, 'player_id' => $player->id, 'goals' => 5, 'assists' => 2, 'decisive_passes' => 1, 'stars' => 2]);

    $totals = service()->totalsFor($player);

    expect($totals['games'])->toBe(2)
        ->and($totals['goals'])->toBe(8)
        ->and($totals['assists'])->toBe(3)
        ->and($totals['decisive_passes'])->toBe(3)
        ->and($totals['avg_stars'])->toBe(3.0);
});

it('credits a win to the players on the winning team', function () {
    $player = Player::factory()->create();
    [$matchDay, $winner] = twoTeamMatchDay(now()->toDateString());
    $winner->teamPlayers()->create(['player_id' => $player->id]);
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $player->id, 'goals' => 1, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 3]);

    $totals = service()->totalsFor($player);

    expect($totals['wins'])->toBe(1)
        ->and($totals['draws'])->toBe(0)
        ->and($totals['losses'])->toBe(0);
});

it('credits a loss to the players on the losing team', function () {
    $player = Player::factory()->create();
    [$matchDay, , $loser] = twoTeamMatchDay(now()->toDateString());
    $loser->teamPlayers()->create(['player_id' => $player->id]);
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $player->id, 'goals' => 0, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 1]);

    $totals = service()->totalsFor($player);

    expect($totals['wins'])->toBe(0)
        ->and($totals['draws'])->toBe(0)
        ->and($totals['losses'])->toBe(1);
});

it('credits a draw when no team in the match day is marked as the winner', function () {
    $player = Player::factory()->create();
    $matchDay = MatchDay::factory()->create();
    $team = Team::factory()->create(['match_day_id' => $matchDay->id, 'won' => false]);
    Team::factory()->create(['match_day_id' => $matchDay->id, 'won' => false]);
    $team->teamPlayers()->create(['player_id' => $player->id]);
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $player->id, 'goals' => 0, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 3]);

    $totals = service()->totalsFor($player);

    expect($totals['wins'])->toBe(0)
        ->and($totals['draws'])->toBe(1)
        ->and($totals['losses'])->toBe(0);
});

it('excludes match days older than the given since date', function () {
    $player = Player::factory()->create();
    [$old, $oldTeam] = twoTeamMatchDay(now()->subDays(60)->toDateString());
    $oldTeam->teamPlayers()->create(['player_id' => $player->id]);
    PlayerDayStat::create(['match_day_id' => $old->id, 'player_id' => $player->id, 'goals' => 10, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 5]);

    [$recent, $recentTeam] = twoTeamMatchDay(now()->subDays(3)->toDateString());
    $recentTeam->teamPlayers()->create(['player_id' => $player->id]);
    PlayerDayStat::create(['match_day_id' => $recent->id, 'player_id' => $player->id, 'goals' => 2, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 5]);

    $totals = service()->totalsFor($player, now()->subDays(30));

    expect($totals['games'])->toBe(1)
        ->and($totals['goals'])->toBe(2);
});

it('orders the top scorers by goals, limited and tie-broken by name', function () {
    $a = Player::factory()->create(['name' => 'Ana']);
    $b = Player::factory()->create(['name' => 'Bruno']);
    $c = Player::factory()->create(['name' => 'Carlos']);
    Player::factory()->create(['name' => 'Duda']); // never plays — must never appear

    [$matchDay, $team] = twoTeamMatchDay(now()->toDateString());
    foreach ([$a, $b, $c] as $player) {
        $team->teamPlayers()->create(['player_id' => $player->id]);
    }
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $a->id, 'goals' => 5, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0]);
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $b->id, 'goals' => 5, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0]);
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $c->id, 'goals' => 1, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0]);

    $top = service()->topScorers(null, 2);

    expect($top)->toHaveCount(2)
        ->and($top->pluck('name')->all())->toBe(['Ana', 'Bruno']); // tied at 5, name breaks the tie
});

it('orders the top assisters by assists', function () {
    $a = Player::factory()->create();
    $b = Player::factory()->create();
    [$matchDay, $team] = twoTeamMatchDay(now()->toDateString());
    $team->teamPlayers()->create(['player_id' => $a->id]);
    $team->teamPlayers()->create(['player_id' => $b->id]);
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $a->id, 'goals' => 0, 'assists' => 1, 'decisive_passes' => 0, 'stars' => 0]);
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $b->id, 'goals' => 0, 'assists' => 4, 'decisive_passes' => 0, 'stars' => 0]);

    $top = service()->topAssisters(null, 3);

    expect($top->first()->id)->toBe($b->id);
});

it('orders the top goals+assists by the combined total', function () {
    $a = Player::factory()->create(); // 2 + 5 = 7
    $b = Player::factory()->create(); // 6 + 0 = 6
    [$matchDay, $team] = twoTeamMatchDay(now()->toDateString());
    $team->teamPlayers()->create(['player_id' => $a->id]);
    $team->teamPlayers()->create(['player_id' => $b->id]);
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $a->id, 'goals' => 2, 'assists' => 5, 'decisive_passes' => 0, 'stars' => 0]);
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $b->id, 'goals' => 6, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0]);

    $top = service()->topGoalsAssists(null, 2);

    expect($top->first()->id)->toBe($a->id);
});

it('paginates a player history newest-first with opponent and result', function () {
    $player = Player::factory()->create();

    [$md1, $winner1] = twoTeamMatchDay(now()->subDays(10)->toDateString());
    $winner1->teamPlayers()->create(['player_id' => $player->id]);
    PlayerDayStat::create(['match_day_id' => $md1->id, 'player_id' => $player->id, 'goals' => 1, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 4]);

    [$md2, , $loser2] = twoTeamMatchDay(now()->subDays(2)->toDateString());
    $loser2->teamPlayers()->create(['player_id' => $player->id]);
    PlayerDayStat::create(['match_day_id' => $md2->id, 'player_id' => $player->id, 'goals' => 0, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 1]);

    $history = service()->history($player, 10);

    expect($history->total())->toBe(2)
        ->and($history->items()[0]['match_day_id'])->toBe($md2->id) // newest first
        ->and($history->items()[0]['result'])->toBe('loss')
        ->and($history->items()[0]['opponent'])->not->toBe('—')
        ->and($history->items()[1]['result'])->toBe('win');
});

it('bounds the history query to the requested page', function () {
    $player = Player::factory()->create();

    foreach (range(1, 15) as $i) {
        [$matchDay, $team] = twoTeamMatchDay(now()->subDays($i)->toDateString());
        $team->teamPlayers()->create(['player_id' => $player->id]);
        PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $player->id, 'goals' => 1, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 3]);
    }

    $history = service()->history($player, 10);

    expect($history->total())->toBe(15)
        ->and($history->count())->toBe(10)
        ->and($history->lastPage())->toBe(2);
});
