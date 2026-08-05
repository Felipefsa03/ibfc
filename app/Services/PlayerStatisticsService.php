<?php

namespace App\Services;

use App\Models\Player;
use App\Models\PlayerDayStat;
use App\Models\Team;
use App\Models\TeamPlayer;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Aggregates match-day performance (player_day_stats) into season totals and
 * leaderboards, entirely through database aggregation (SUM/COUNT/AVG/GROUP
 * BY) — never by loading match days into PHP and summing in a loop.
 *
 * A player's win/draw/loss for a given match day is derived from their
 * team's `won` flag: win when their own team is marked won, draw when no
 * team in that match day is marked won, loss when some other team is.
 */
class PlayerStatisticsService
{
    /**
     * The shared aggregate: one row per player who has at least one recorded
     * match-day performance, optionally scoped to match days on/after $since.
     *
     * Not joined to `players` — callers join it onto whatever player scope
     * they need (a single player, or the full roster for sorting).
     */
    public function aggregateQuery(?Carbon $since = null): QueryBuilder
    {
        $anyTeamWon = DB::table('teams')
            ->select('match_day_id', DB::raw('MAX(won) as any_won'))
            ->groupBy('match_day_id');

        return DB::table('player_day_stats as pds')
            ->join('team_players as tp', 'tp.player_id', '=', 'pds.player_id')
            ->join('teams as t', function ($join) {
                $join->on('t.id', '=', 'tp.team_id')
                    ->on('t.match_day_id', '=', 'pds.match_day_id');
            })
            ->joinSub($anyTeamWon, 'aw', 'aw.match_day_id', '=', 'pds.match_day_id')
            ->join('match_days as md', 'md.id', '=', 'pds.match_day_id')
            ->when($since, fn (QueryBuilder $query) => $query->where('md.date', '>=', $since->toDateString()))
            ->groupBy('pds.player_id')
            ->select([
                'pds.player_id',
                DB::raw('COUNT(*) as games'),
                DB::raw('SUM(pds.goals) as goals'),
                DB::raw('SUM(pds.assists) as assists'),
                DB::raw('SUM(pds.decisive_passes) as decisive_passes'),
                DB::raw('AVG(pds.stars) as avg_stars'),
                DB::raw('SUM(CASE WHEN t.won = 1 THEN 1 ELSE 0 END) as wins'),
                DB::raw('SUM(CASE WHEN t.won = 0 AND aw.any_won = 1 THEN 1 ELSE 0 END) as losses'),
                DB::raw('SUM(CASE WHEN aw.any_won = 0 THEN 1 ELSE 0 END) as draws'),
            ]);
    }

    /**
     * Season totals for a single player. Zeroed out when they have no
     * recorded performance yet.
     *
     * @return array{games: int, goals: int, assists: int, decisive_passes: int, avg_stars: float, wins: int, draws: int, losses: int}
     */
    public function totalsFor(Player $player, ?Carbon $since = null): array
    {
        $row = (array) $this->aggregateQuery($since)
            ->where('pds.player_id', $player->id)
            ->first();

        return [
            'games' => (int) ($row['games'] ?? 0),
            'goals' => (int) ($row['goals'] ?? 0),
            'assists' => (int) ($row['assists'] ?? 0),
            'decisive_passes' => (int) ($row['decisive_passes'] ?? 0),
            'avg_stars' => round((float) ($row['avg_stars'] ?? 0), 1),
            'wins' => (int) ($row['wins'] ?? 0),
            'draws' => (int) ($row['draws'] ?? 0),
            'losses' => (int) ($row['losses'] ?? 0),
        ];
    }

    /**
     * Top players by total goals.
     */
    public function topScorers(?Carbon $since = null, int $limit = 3): Collection
    {
        return $this->topBy('agg.goals', $since, $limit);
    }

    /**
     * Top players by total assists.
     */
    public function topAssisters(?Carbon $since = null, int $limit = 3): Collection
    {
        return $this->topBy('agg.assists', $since, $limit);
    }

    /**
     * Top players by goals + assists combined.
     */
    public function topGoalsAssists(?Carbon $since = null, int $limit = 3): Collection
    {
        return $this->topBy('(agg.goals + agg.assists)', $since, $limit);
    }

    /**
     * Shared leaderboard query: joins the aggregate onto `players` (an inner
     * join, since a leaderboard only makes sense for players who have
     * actually recorded a performance) and orders by the given expression.
     */
    protected function topBy(string $orderExpression, ?Carbon $since, int $limit): Collection
    {
        return Player::query()
            ->joinSub($this->aggregateQuery($since), 'agg', 'agg.player_id', '=', 'players.id')
            ->orderByRaw("{$orderExpression} desc")
            ->orderBy('players.name')
            ->limit($limit)
            ->get([
                'players.id',
                'players.name',
                'players.nickname',
                'players.position',
                'players.current_overall',
                'agg.goals',
                'agg.assists',
                'agg.decisive_passes',
                'agg.games',
            ]);
    }

    /**
     * Paginated match-day history for a player, newest first. Bounded to the
     * requested page: only the current page's match days are ever touched
     * for the opponent/result lookup (no N+1 across the full history).
     */
    public function history(Player $player, int $perPage = 10): LengthAwarePaginator
    {
        $paginator = PlayerDayStat::query()
            ->where('player_id', $player->id)
            ->join('match_days', 'match_days.id', '=', 'player_day_stats.match_day_id')
            ->orderByDesc('match_days.date')
            ->select('player_day_stats.*', 'match_days.date as match_date')
            ->paginate($perPage)
            ->withQueryString();

        $matchDayIds = $paginator->getCollection()->pluck('match_day_id');

        $ownTeamIdByMatchDay = TeamPlayer::query()
            ->join('teams', 'teams.id', '=', 'team_players.team_id')
            ->where('team_players.player_id', $player->id)
            ->whereIn('teams.match_day_id', $matchDayIds)
            ->pluck('teams.id', 'teams.match_day_id');

        $teamsByMatchDay = Team::query()
            ->whereIn('match_day_id', $matchDayIds)
            ->get()
            ->groupBy('match_day_id');

        return $paginator->through(function (PlayerDayStat $stat) use ($ownTeamIdByMatchDay, $teamsByMatchDay) {
            $dayTeams = $teamsByMatchDay->get($stat->match_day_id, collect());
            $ownTeamId = $ownTeamIdByMatchDay->get($stat->match_day_id);
            $ownTeam = $dayTeams->firstWhere('id', $ownTeamId);
            $opponents = $dayTeams->reject(fn (Team $team) => $team->id === $ownTeamId)->pluck('name')->implode(', ');
            $anyoneWon = $dayTeams->contains('won', true);

            return [
                'match_day_id' => $stat->match_day_id,
                'date' => $stat->getAttribute('match_date'),
                'team_name' => $ownTeam?->name,
                'opponent' => $opponents !== '' ? $opponents : '—',
                'result' => match (true) {
                    $ownTeam === null => null,
                    $ownTeam->won => 'win',
                    $anyoneWon => 'loss',
                    default => 'draw',
                },
                'goals' => $stat->goals,
                'assists' => $stat->assists,
                'decisive_passes' => $stat->decisive_passes,
                'stars' => $stat->stars,
            ];
        });
    }
}
