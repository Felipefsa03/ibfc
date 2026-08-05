<?php

use App\Models\MatchDay;
use App\Models\Player;
use App\Models\Team;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('creates a team inside a match day', function () {
    $matchDay = MatchDay::factory()->create();

    $this->post(route('teams.store', $matchDay), ['name' => 'Vermelho'])
        ->assertRedirect(route('matchDays.show', $matchDay));

    $this->assertDatabaseHas('teams', [
        'match_day_id' => $matchDay->id,
        'name' => 'Vermelho',
    ]);
});

it('requires a team name', function () {
    $matchDay = MatchDay::factory()->create();

    $this->post(route('teams.store', $matchDay), ['name' => ''])
        ->assertSessionHasErrors('name');
});

it('updates team name, score and winner flag', function () {
    $matchDay = MatchDay::factory()->create();
    $team = Team::factory()->create(['match_day_id' => $matchDay->id]);

    $this->put(route('teams.update', ['matchDay' => $matchDay, 'team' => $team]), [
        'name' => 'Azul',
        'score' => 4,
        'won' => true,
    ])->assertRedirect(route('matchDays.show', $matchDay));

    $team->refresh();

    expect($team->name)->toBe('Azul');
    expect($team->score)->toBe(4);
    expect($team->won)->toBeTrue();
});

it('destroys a team', function () {
    $matchDay = MatchDay::factory()->create();
    $team = Team::factory()->create(['match_day_id' => $matchDay->id]);

    $this->delete(route('teams.destroy', ['matchDay' => $matchDay, 'team' => $team]))
        ->assertRedirect(route('matchDays.show', $matchDay));

    $this->assertDatabaseMissing('teams', ['id' => $team->id]);
});

it('attaches an active player to a team', function () {
    $matchDay = MatchDay::factory()->create(['players_per_team' => 5]);
    $team = Team::factory()->create(['match_day_id' => $matchDay->id]);
    $player = Player::factory()->create();

    $this->post(route('teams.attach', [
        'matchDay' => $matchDay,
        'team' => $team,
        'player' => $player,
    ]))->assertRedirect();

    $this->assertDatabaseHas('team_players', [
        'team_id' => $team->id,
        'player_id' => $player->id,
    ]);
});

it('rejects attaching an inactive player', function () {
    $matchDay = MatchDay::factory()->create(['players_per_team' => 5]);
    $team = Team::factory()->create(['match_day_id' => $matchDay->id]);
    $player = Player::factory()->inactive()->create();

    $this->post(route('teams.attach', [
        'matchDay' => $matchDay,
        'team' => $team,
        'player' => $player,
    ]))->assertRedirect();

    $this->assertDatabaseCount('team_players', 0);
});

it('rejects attaching the same player to two teams of the same match day', function () {
    $matchDay = MatchDay::factory()->create(['players_per_team' => 5]);
    $teamA = Team::factory()->create(['match_day_id' => $matchDay->id]);
    $teamB = Team::factory()->create(['match_day_id' => $matchDay->id]);
    $player = Player::factory()->create();
    $teamA->teamPlayers()->create(['player_id' => $player->id]);

    $this->post(route('teams.attach', [
        'matchDay' => $matchDay,
        'team' => $teamB,
        'player' => $player,
    ]))->assertRedirect();

    $this->assertDatabaseCount('team_players', 1);
});

it('rejects attaching when the team is full', function () {
    $matchDay = MatchDay::factory()->create(['players_per_team' => 1]);
    $team = Team::factory()->create(['match_day_id' => $matchDay->id]);
    $first = Player::factory()->create();
    $second = Player::factory()->create();
    $team->teamPlayers()->create(['player_id' => $first->id]);

    $this->post(route('teams.attach', [
        'matchDay' => $matchDay,
        'team' => $team,
        'player' => $second,
    ]))->assertRedirect();

    $this->assertDatabaseCount('team_players', 1);
});

it('detaches a player from a team', function () {
    $matchDay = MatchDay::factory()->create(['players_per_team' => 5]);
    $team = Team::factory()->create(['match_day_id' => $matchDay->id]);
    $player = Player::factory()->create();
    $team->teamPlayers()->create(['player_id' => $player->id]);

    $this->delete(route('teams.detach', [
        'matchDay' => $matchDay,
        'team' => $team,
        'player' => $player,
    ]))->assertRedirect();

    $this->assertDatabaseMissing('team_players', [
        'team_id' => $team->id,
        'player_id' => $player->id,
    ]);
});
