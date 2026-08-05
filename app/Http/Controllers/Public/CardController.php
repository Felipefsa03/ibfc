<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Player;
use App\Services\PlayerStatisticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Public, read-only portal: anyone with the link can look up a player's card
 * without logging in. No route here ever writes — that stays behind auth in
 * PlayerController.
 */
class CardController extends Controller
{
    public function __construct(protected PlayerStatisticsService $stats) {}

    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = $request->query('status', 'all');
        $sort = $request->query('sort', 'overall');
        $direction = $request->query('direction') === 'asc' ? 'asc' : 'desc';

        $players = Player::query()
            ->leftJoinSub($this->stats->aggregateQuery(), 'agg', 'agg.player_id', '=', 'players.id')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('players.name', 'like', "%{$search}%")
                        ->orWhere('players.nickname', 'like', "%{$search}%");
                });
            })
            ->when(in_array($status, ['active', 'inactive'], true), function ($query) use ($status) {
                $query->where('players.active', $status === 'active');
            })
            ->select([
                'players.*',
                DB::raw('COALESCE(agg.goals, 0) as total_goals'),
                DB::raw('COALESCE(agg.assists, 0) as total_assists'),
                DB::raw('COALESCE(agg.games, 0) as total_games'),
            ])
            ->orderBy($this->sortColumn($sort), $direction)
            ->when($sort !== 'name', fn ($query) => $query->orderBy('players.name'))
            ->get();

        return Inertia::render('Public/Cards/Index', [
            'players' => $players,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function show(Player $player): Response
    {
        return Inertia::render('Public/Cards/Show', [
            'player' => $player,
            'totals' => $this->stats->totalsFor($player),
            'history' => $this->stats->history($player),
        ]);
    }

    protected function sortColumn(string $sort): string
    {
        return match ($sort) {
            'name' => 'players.name',
            'goals' => 'total_goals',
            'assists' => 'total_assists',
            'participations' => 'total_games',
            default => 'players.current_overall',
        };
    }
}
