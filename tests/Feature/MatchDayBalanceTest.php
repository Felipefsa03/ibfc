<?php

use App\Models\MatchDay;
use App\Models\Player;
use App\Models\Team;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('auto-creates the missing teams when balancing', function () {
    $matchDay = MatchDay::factory()->create([
        'number_of_teams' => 3,
        'players_per_team' => 5,
    ]);
    Player::factory()->count(6)->create();

    $this->post(route('matchDays.balance', $matchDay))->assertRedirect();

    expect($matchDay->teams()->count())->toBe(3);
    $this->assertDatabaseCount('team_players', 6);
});

it('clears previous convocations before rebalancing', function () {
    $matchDay = MatchDay::factory()->create([
        'number_of_teams' => 2,
        'players_per_team' => 5,
    ]);
    $teams = Team::factory()->count(2)->create(['match_day_id' => $matchDay->id]);
    $alreadyCalled = Player::factory()->create();
    $teams->first()->teamPlayers()->create(['player_id' => $alreadyCalled->id]);
    Player::factory()->count(4)->create();

    $this->post(route('matchDays.balance', $matchDay))->assertRedirect();

    $this->assertDatabaseCount('team_players', 5);
    expect($matchDay->teams()->count())->toBe(2);
});

it('balances the team totals by overall', function () {
    $matchDay = MatchDay::factory()->create([
        'number_of_teams' => 2,
        'players_per_team' => 5,
    ]);
    Player::factory()->create(['current_overall' => 90]);
    Player::factory()->create(['current_overall' => 80]);
    Player::factory()->create(['current_overall' => 70]);
    Player::factory()->create(['current_overall' => 60]);

    $this->post(route('matchDays.balance', $matchDay))->assertRedirect();

    $totals = $matchDay->teams()
        ->with('teamPlayers.player')
        ->get()
        ->map(fn (Team $team) => $team->teamPlayers->sum(
            fn ($teamPlayer) => $teamPlayer->player->current_overall,
        ))
        ->all();

    expect($totals)->toBe([150, 150]);
});

it('does not convoke more players than the available slots', function () {
    $matchDay = MatchDay::factory()->create([
        'number_of_teams' => 2,
        'players_per_team' => 2,
    ]);
    Player::factory()->count(6)->create();

    $this->post(route('matchDays.balance', $matchDay))->assertRedirect();

    $this->assertDatabaseCount('team_players', 4);
});

it('ignores inactive players when balancing', function () {
    $matchDay = MatchDay::factory()->create([
        'number_of_teams' => 2,
        'players_per_team' => 5,
    ]);
    Player::factory()->inactive()->count(3)->create();
    Player::factory()->count(2)->create();

    $this->post(route('matchDays.balance', $matchDay))->assertRedirect();

    $this->assertDatabaseCount('team_players', 2);
});
