<?php

use App\Models\MatchDay;
use App\Models\Player;
use App\Models\Team;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('lists match days', function () {
    MatchDay::factory()->count(3)->create();

    $this->get(route('matchDays.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('MatchDays/Index')
            ->has('matchDays', 3));
});

it('creates a match day', function () {
    $this->post(route('matchDays.store'), [
        'date' => '2026-08-10',
        'number_of_matches' => 3,
        'number_of_teams' => 4,
        'players_per_team' => 5,
    ])->assertRedirect(route('matchDays.index'));

    $matchDay = MatchDay::query()->firstOrFail();

    expect($matchDay->date->format('Y-m-d'))->toBe('2026-08-10');
    expect($matchDay->number_of_teams)->toBe(4);
    expect($matchDay->players_per_team)->toBe(5);
});

it('rejects an invalid match day configuration', function () {
    $this->post(route('matchDays.store'), [
        'date' => 'not-a-date',
        'number_of_matches' => 0,
        'number_of_teams' => 1,
        'players_per_team' => 0,
    ])->assertSessionHasErrors(['date', 'number_of_matches', 'number_of_teams', 'players_per_team']);
});

it('shows a match day with its teams and convocations', function () {
    $matchDay = MatchDay::factory()->create([
        'number_of_teams' => 2,
        'players_per_team' => 5,
    ]);
    $team = Team::factory()->create(['match_day_id' => $matchDay->id]);
    $player = Player::factory()->create();
    $team->teamPlayers()->create(['player_id' => $player->id]);

    $this->get(route('matchDays.show', $matchDay))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('MatchDays/Show')
            ->has('matchDay.teams', 1)
            ->where('matchDay.teams.0.players.0.id', $player->id));
});

it('excludes assigned players from the pool', function () {
    $matchDay = MatchDay::factory()->create(['number_of_teams' => 2]);
    $team = Team::factory()->create(['match_day_id' => $matchDay->id]);
    $assigned = Player::factory()->create();
    $available = Player::factory()->create();
    $inactive = Player::factory()->inactive()->create();
    $team->teamPlayers()->create(['player_id' => $assigned->id]);

    $this->get(route('matchDays.show', $matchDay))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('pool', 1)
            ->where('pool.0.id', $available->id));

    expect($inactive->exists())->toBeTrue();
});

it('destroys a match day and its teams', function () {
    $matchDay = MatchDay::factory()->create();
    Team::factory()->create(['match_day_id' => $matchDay->id]);

    $this->delete(route('matchDays.destroy', $matchDay))
        ->assertRedirect(route('matchDays.index'));

    $this->assertDatabaseMissing('match_days', ['id' => $matchDay->id]);
    $this->assertDatabaseCount('teams', 0);
});
