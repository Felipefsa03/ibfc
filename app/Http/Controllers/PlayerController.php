<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlayerRequest;
use App\Http\Requests\UpdatePlayerRequest;
use App\Models\Player;
use App\Services\OverallCalculatorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlayerController extends Controller
{
    public function __construct(protected OverallCalculatorService $calculator) {}

    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = $request->query('status', 'all');

        $players = Player::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->whereLike('name', "%{$search}%")
                        ->orWhereLike('nickname', "%{$search}%");
                });
            })
            ->when(in_array($status, ['active', 'inactive'], true), function ($query) use ($status) {
                $query->where('active', $status === 'active');
            })
            ->orderByDesc('current_overall')
            ->get();

        return Inertia::render('Players/Index', [
            'players' => $players,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Players/Create');
    }

    public function store(StorePlayerRequest $request): RedirectResponse
    {
        $attributes = $request->safe()->except(['active']);

        $overall = $this->calculator->base([
            'gol' => (int) $attributes['gol'],
            'sho' => (int) $attributes['sho'],
            'pas' => (int) $attributes['pas'],
            'dri' => (int) $attributes['dri'],
            'def' => (int) $attributes['def'],
            'phy' => (int) $attributes['phy'],
        ]);

        Player::create([
            ...$attributes,
            'overall_base' => $overall,
            'current_overall' => $overall,
            'active' => $request->boolean('active', true),
        ]);

        return redirect()
            ->route('players.index')
            ->with('success', 'Jogador cadastrado com sucesso.');
    }

    public function show(Player $player): Response
    {
        return Inertia::render('Players/Show', [
            'player' => $player,
        ]);
    }

    public function edit(Player $player): Response
    {
        return Inertia::render('Players/Edit', [
            'player' => $player,
        ]);
    }

    public function update(UpdatePlayerRequest $request, Player $player): RedirectResponse
    {
        $attributes = $request->safe()->except(['active']);

        $overall = $this->calculator->base([
            'gol' => (int) $attributes['gol'],
            'sho' => (int) $attributes['sho'],
            'pas' => (int) $attributes['pas'],
            'dri' => (int) $attributes['dri'],
            'def' => (int) $attributes['def'],
            'phy' => (int) $attributes['phy'],
        ]);

        $player->update([
            ...$attributes,
            'overall_base' => $overall,
            'active' => $request->boolean('active', $player->active),
        ]);

        return redirect()
            ->route('players.show', $player)
            ->with('success', 'Jogador atualizado com sucesso.');
    }

    public function destroy(Player $player): RedirectResponse
    {
        $hasHistory = $player->teamPlayers()->exists() || $player->dayStats()->exists();

        if ($hasHistory) {
            $player->update(['active' => false]);
        } else {
            $player->delete();
        }

        return redirect()
            ->route('players.index')
            ->with('success', $hasHistory
                ? 'Jogador com histórico foi inativado.'
                : 'Jogador excluído com sucesso.');
    }
}
