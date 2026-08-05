<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use App\Models\MatchDay;
use App\Models\Player;
use App\Models\Team;
use App\Models\TeamPlayer;
use Illuminate\Http\RedirectResponse;

class TeamController extends Controller
{
    public function store(MatchDay $matchDay, StoreTeamRequest $request): RedirectResponse
    {
        Team::create([
            'match_day_id' => $matchDay->id,
            'name' => $request->input('name'),
        ]);

        return redirect()
            ->route('matchDays.show', $matchDay)
            ->with('success', 'Time adicionado com sucesso.');
    }

    public function update(MatchDay $matchDay, Team $team, UpdateTeamRequest $request): RedirectResponse
    {
        $team->update([
            'name' => $request->input('name'),
            'score' => $request->integer('score'),
            'won' => $request->boolean('won'),
        ]);

        return redirect()
            ->route('matchDays.show', $matchDay)
            ->with('success', 'Time atualizado com sucesso.');
    }

    public function destroy(MatchDay $matchDay, Team $team): RedirectResponse
    {
        $team->delete();

        return redirect()
            ->route('matchDays.show', $matchDay)
            ->with('success', 'Time removido com sucesso.');
    }

    public function attach(MatchDay $matchDay, Team $team, Player $player): RedirectResponse
    {
        $team->loadCount('teamPlayers');

        if (! $player->active) {
            return back()->with('error', 'Jogadores inativos não podem ser convocados.');
        }

        if ($team->team_players_count >= $matchDay->players_per_team) {
            return back()->with('error', 'Esse time já está completo.');
        }

        $alreadyOnMatchDay = TeamPlayer::query()
            ->where('player_id', $player->id)
            ->whereHas('team', fn ($query) => $query->where('match_day_id', $matchDay->id))
            ->exists();

        if ($alreadyOnMatchDay) {
            return back()->with('error', "{$player->name} já está em outro time deste match day.");
        }

        TeamPlayer::create([
            'team_id' => $team->id,
            'player_id' => $player->id,
        ]);

        return back()->with('success', "{$player->name} convocado para {$team->name}.");
    }

    public function detach(MatchDay $matchDay, Team $team, Player $player): RedirectResponse
    {
        TeamPlayer::query()
            ->where('team_id', $team->id)
            ->where('player_id', $player->id)
            ->delete();

        return back()->with('success', "{$player->name} removido de {$team->name}.");
    }
}
