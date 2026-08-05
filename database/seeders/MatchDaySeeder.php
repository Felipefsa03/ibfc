<?php

namespace Database\Seeders;

use App\Models\MatchDay;
use App\Models\Player;
use App\Models\Team;
use App\Models\TeamPlayer;
use App\Services\TeamBalancingService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Creates a demo match day with the squad balanced automatically.
 *
 * Meant to run on a fresh database; no-op when a match day already exists.
 */
class MatchDaySeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        if (MatchDay::query()->exists()) {
            return;
        }

        $matchDay = MatchDay::create([
            'date' => now()->subDays(2)->toDateString(),
            'number_of_matches' => 3,
            'number_of_teams' => 2,
            'players_per_team' => 5,
        ]);

        $teams = collect(range(1, $matchDay->number_of_teams))->map(
            fn (int $index) => Team::create([
                'match_day_id' => $matchDay->id,
                'name' => "Time {$index}",
            ]),
        );

        $players = Player::query()->where('active', true)->get();

        $assignments = app(TeamBalancingService::class)->balance(
            $players,
            $matchDay->number_of_teams,
            $matchDay->players_per_team,
        );

        foreach ($assignments as $assignment) {
            TeamPlayer::create([
                'team_id' => $teams->get($assignment['team_index'])->id,
                'player_id' => $assignment['player_id'],
            ]);
        }

        $teams->first()->update(['score' => 4, 'won' => true]);
        $teams->last()->update(['score' => 3]);
    }
}
