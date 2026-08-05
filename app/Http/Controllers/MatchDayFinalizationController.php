<?php

namespace App\Http\Controllers;

use App\Http\Requests\FinalizeMatchDayRequest;
use App\Models\MatchDay;
use App\Models\PlayerDayStat;
use App\Models\Team;
use App\Models\TeamPlayer;
use App\Services\MatchDayFinalizationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The post-game step of a match day: record each called-up player's
 * performance and pay out the resulting attribute progression.
 */
class MatchDayFinalizationController extends Controller
{
    public function __construct(protected MatchDayFinalizationService $finalizer) {}

    /**
     * Show the performance form for every player called up for the match day.
     */
    public function create(MatchDay $matchDay): Response|RedirectResponse
    {
        $matchDay->load(['teams' => fn ($query) => $query->orderBy('id'), 'teams.teamPlayers.player']);

        $participants = $matchDay->teams->flatMap(
            fn (Team $team) => $team->teamPlayers->map(fn (TeamPlayer $teamPlayer) => [
                'player' => $teamPlayer->player,
                'team_name' => $team->name,
            ])
        )->values();

        if ($participants->isEmpty()) {
            return redirect()
                ->route('matchDays.show', $matchDay)
                ->with('error', 'Convoque os jogadores antes de finalizar este match day.');
        }

        $existing = PlayerDayStat::query()
            ->where('match_day_id', $matchDay->id)
            ->get()
            ->keyBy('player_id');

        return Inertia::render('MatchDays/Finalize', [
            'matchDay' => [
                'id' => $matchDay->id,
                'date' => $matchDay->date->format('Y-m-d'),
                'number_of_matches' => $matchDay->number_of_matches,
                'number_of_teams' => $matchDay->number_of_teams,
                'players_per_team' => $matchDay->players_per_team,
                'finalized_at' => $matchDay->finalized_at?->toIso8601String(),
            ],
            'participants' => $participants->map(fn (array $entry) => [
                'player' => $entry['player'],
                'team_name' => $entry['team_name'],
                'stat' => $existing->get($entry['player']->id)?->only([
                    'goals', 'assists', 'decisive_passes', 'stars',
                ]),
            ]),
        ]);
    }

    /**
     * Persist the performance entries and close the match day.
     */
    public function store(FinalizeMatchDayRequest $request, MatchDay $matchDay): RedirectResponse
    {
        if ($matchDay->isFinalized()) {
            return redirect()
                ->route('matchDays.show', $matchDay)
                ->with('error', 'Este match day já foi finalizado e não pode ser finalizado novamente.');
        }

        $updated = $this->finalizer->finalize($matchDay, $request->validated()['stats']);

        return redirect()
            ->route('matchDays.show', $matchDay)
            ->with('success', "Match day finalizado: {$updated} jogadores tiveram atributos e overall recalculados.");
    }
}
