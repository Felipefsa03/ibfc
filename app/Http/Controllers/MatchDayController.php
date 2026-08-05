<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMatchDayRequest;
use App\Models\MatchDay;
use App\Models\Player;
use App\Models\Team;
use App\Models\TeamPlayer;
use App\Services\TeamBalancingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class MatchDayController extends Controller
{
    public function __construct(protected TeamBalancingService $balancer) {}

    public function index(): Response
    {
        $matchDays = MatchDay::query()
            ->with(['teams.teamPlayers'])
            ->orderByDesc('date')
            ->get()
            ->map(fn (MatchDay $matchDay) => $this->summarize($matchDay));

        return Inertia::render('MatchDays/Index', [
            'matchDays' => $matchDays,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('MatchDays/Create');
    }

    public function store(StoreMatchDayRequest $request): RedirectResponse
    {
        MatchDay::create($request->validated());

        return redirect()
            ->route('matchDays.index')
            ->with('success', 'Match Day criado com sucesso.');
    }

    public function show(MatchDay $matchDay): Response
    {
        $matchDay->load(['teams' => fn ($query) => $query->orderBy('id'), 'teams.teamPlayers.player']);

        $teams = $matchDay->teams->map(function (Team $team) {
            $players = $team->teamPlayers
                ->sortByDesc(fn (TeamPlayer $teamPlayer) => $teamPlayer->player->current_overall)
                ->map(fn (TeamPlayer $teamPlayer) => $teamPlayer->player)
                ->values();

            return [
                'id' => $team->id,
                'name' => $team->name,
                'score' => $team->score,
                'won' => $team->won,
                'players' => $players,
                'total_overall' => $players->sum('current_overall'),
            ];
        });

        $assignedPlayerIds = $matchDay->teams
            ->flatMap(fn (Team $team) => $team->teamPlayers->pluck('player_id'))
            ->flip();

        $pool = Player::query()
            ->where('active', true)
            ->orderByDesc('current_overall')
            ->get()
            ->filter(fn (Player $player) => ! $assignedPlayerIds->has($player->id))
            ->values();

        return Inertia::render('MatchDays/Show', [
            'matchDay' => $this->summarize($matchDay)->put('teams', $teams),
            'pool' => $pool,
        ]);
    }

    public function destroy(MatchDay $matchDay): RedirectResponse
    {
        $matchDay->delete();

        return redirect()
            ->route('matchDays.index')
            ->with('success', 'Match Day excluído com sucesso.');
    }

    public function balance(MatchDay $matchDay): RedirectResponse
    {
        if ($matchDay->isFinalized()) {
            return redirect()
                ->route('matchDays.show', $matchDay)
                ->with('error', 'Este match day já foi finalizado: as escalações não podem mais ser alteradas.');
        }

        $teamCount = max(2, $matchDay->number_of_teams);
        $playersPerTeam = max(1, $matchDay->players_per_team);

        $teams = $matchDay->teams()->orderBy('id')->get();

        while ($teams->count() < $teamCount) {
            $teams->push(Team::create([
                'match_day_id' => $matchDay->id,
                'name' => 'Time '.($teams->count() + 1),
            ]));
        }

        $players = Player::query()->where('active', true)->get();

        $assignments = $this->balancer->balance($players, $teamCount, $playersPerTeam);

        TeamPlayer::query()
            ->whereIn('team_id', $teams->pluck('id'))
            ->delete();

        foreach ($assignments as $assignment) {
            TeamPlayer::create([
                'team_id' => $teams->get($assignment['team_index'])->id,
                'player_id' => $assignment['player_id'],
            ]);
        }

        $assigned = count($assignments);
        $message = "Elenco balanceado: {$assigned} de {$players->count()} ativos convocados.";

        if ($assigned < $players->count()) {
            $message .= ' Ajuste o número de times ou jogadores por time para convocar todos.';
        }

        return redirect()
            ->route('matchDays.show', $matchDay)
            ->with('success', $message);
    }

    /**
     * Build a lightweight, frontend-friendly representation of a match day.
     *
     * @return Collection<string, mixed>
     */
    private function summarize(MatchDay $matchDay): Collection
    {
        $teamCount = $matchDay->teams->count();
        $playerCount = $matchDay->teams->sum(fn (Team $team) => $team->teamPlayers->count());

        return collect([
            'id' => $matchDay->id,
            'date' => $matchDay->date->format('Y-m-d'),
            'number_of_matches' => $matchDay->number_of_matches,
            'number_of_teams' => $matchDay->number_of_teams,
            'players_per_team' => $matchDay->players_per_team,
            'finalized_at' => $matchDay->finalized_at?->toIso8601String(),
            'teams_count' => $teamCount,
            'players_count' => $playerCount,
        ]);
    }
}
