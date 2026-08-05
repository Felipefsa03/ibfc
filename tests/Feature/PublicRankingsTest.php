<?php

use App\Models\MatchDay;
use App\Models\Player;
use App\Models\PlayerDayStat;
use App\Models\Team;

/**
 * @return array{0: MatchDay, 1: Team}
 */
function rankingsMatchDay(string $date): array
{
    $matchDay = MatchDay::factory()->create(['date' => $date]);
    $team = Team::factory()->create(['match_day_id' => $matchDay->id]);

    return [$matchDay, $team];
}

it('is reachable without authentication', function () {
    $this->get(route('rankings.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Public/Rankings/Index'));
});

it('ranks the top 3 all-time scorers under goat, excluding everyone else', function () {
    [$matchDay, $team] = rankingsMatchDay(now()->subDays(5)->toDateString());
    $players = Player::factory()->count(4)->create();
    $goals = [10, 8, 6, 1];

    foreach ($players as $index => $player) {
        $team->teamPlayers()->create(['player_id' => $player->id]);
        PlayerDayStat::create([
            'match_day_id' => $matchDay->id, 'player_id' => $player->id,
            'goals' => $goals[$index], 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0,
        ]);
    }

    $this->get(route('rankings.index'))
        ->assertInertia(fn ($page) => $page
            ->has('goat.goals', 3)
            ->where('goat.goals.0.value', 10)
            ->where('goat.goals.1.value', 8)
            ->where('goat.goals.2.value', 6));
});

it('scopes the month category to the last 30 days only', function () {
    $recentPlayer = Player::factory()->create(['name' => 'Recente', 'nickname' => null]);
    [$recentDay, $recentTeam] = rankingsMatchDay(now()->subDays(5)->toDateString());
    $recentTeam->teamPlayers()->create(['player_id' => $recentPlayer->id]);
    PlayerDayStat::create(['match_day_id' => $recentDay->id, 'player_id' => $recentPlayer->id, 'goals' => 3, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0]);

    $oldPlayer = Player::factory()->create(['name' => 'Antigo', 'nickname' => null]);
    [$oldDay, $oldTeam] = rankingsMatchDay(now()->subDays(90)->toDateString());
    $oldTeam->teamPlayers()->create(['player_id' => $oldPlayer->id]);
    PlayerDayStat::create(['match_day_id' => $oldDay->id, 'player_id' => $oldPlayer->id, 'goals' => 50, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0]);

    $this->get(route('rankings.index'))
        ->assertInertia(fn ($page) => $page
            ->has('goat.goals', 2) // both appear all-time
            ->has('month.goals', 1) // only the recent one within 30 days
            ->where('month.goals.0.name', 'Recente'));
});

it('ranks by assists independently from goals', function () {
    [$matchDay, $team] = rankingsMatchDay(now()->toDateString());
    $scorer = Player::factory()->create(['name' => 'Artilheiro', 'nickname' => null]);
    $assister = Player::factory()->create(['name' => 'Garçom', 'nickname' => null]);
    $team->teamPlayers()->create(['player_id' => $scorer->id]);
    $team->teamPlayers()->create(['player_id' => $assister->id]);
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $scorer->id, 'goals' => 10, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0]);
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $assister->id, 'goals' => 0, 'assists' => 7, 'decisive_passes' => 0, 'stars' => 0]);

    $this->get(route('rankings.index'))
        ->assertInertia(fn ($page) => $page
            ->where('goat.assists.0.name', 'Garçom')
            ->where('goat.goals.0.name', 'Artilheiro'));
});

it('ranks by combined goals and assists for the G/A leaderboard', function () {
    [$matchDay, $team] = rankingsMatchDay(now()->toDateString());
    $balanced = Player::factory()->create(['name' => 'Completo', 'nickname' => null]); // 4 + 4 = 8
    $pureScorer = Player::factory()->create(['name' => 'So Gol', 'nickname' => null]); // 6 + 0 = 6
    $team->teamPlayers()->create(['player_id' => $balanced->id]);
    $team->teamPlayers()->create(['player_id' => $pureScorer->id]);
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $balanced->id, 'goals' => 4, 'assists' => 4, 'decisive_passes' => 0, 'stars' => 0]);
    PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $pureScorer->id, 'goals' => 6, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0]);

    $this->get(route('rankings.index'))
        ->assertInertia(fn ($page) => $page
            ->where('goat.goalsAssists.0.name', 'Completo')
            ->where('goat.goalsAssists.0.value', 8)
            ->where('goat.goalsAssists.1.value', 6));
});

it('never returns more than 3 players per leaderboard', function () {
    [$matchDay, $team] = rankingsMatchDay(now()->toDateString());
    $players = Player::factory()->count(5)->create();

    foreach ($players as $index => $player) {
        $team->teamPlayers()->create(['player_id' => $player->id]);
        PlayerDayStat::create(['match_day_id' => $matchDay->id, 'player_id' => $player->id, 'goals' => $index + 1, 'assists' => 0, 'decisive_passes' => 0, 'stars' => 0]);
    }

    $this->get(route('rankings.index'))
        ->assertInertia(fn ($page) => $page->has('goat.goals', 3));
});
