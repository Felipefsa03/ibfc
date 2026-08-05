<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\PlayerStatisticsService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Public leaderboards: top 3 goals, assists and goals+assists, each split
 * into the all-time ("G.O.A.T.") and last-30-days ("Mês") categories. Every
 * list comes from PlayerStatisticsService, which does the ranking with a
 * single aggregate query per list — nothing is summed in PHP.
 */
class RankingController extends Controller
{
    public function __construct(protected PlayerStatisticsService $stats) {}

    public function index(): Response
    {
        $since = Carbon::now()->subDays(30);

        return Inertia::render('Public/Rankings/Index', [
            'goat' => [
                'goals' => $this->format($this->stats->topScorers(), 'goals'),
                'assists' => $this->format($this->stats->topAssisters(), 'assists'),
                'goalsAssists' => $this->format($this->stats->topGoalsAssists(), 'ga'),
            ],
            'month' => [
                'goals' => $this->format($this->stats->topScorers($since), 'goals'),
                'assists' => $this->format($this->stats->topAssisters($since), 'assists'),
                'goalsAssists' => $this->format($this->stats->topGoalsAssists($since), 'ga'),
            ],
        ]);
    }

    /**
     * @param  Collection<int, object>  $rows
     * @return list<array{id: int, name: string, position: string|null, current_overall: int, value: int}>
     */
    protected function format(Collection $rows, string $metric): array
    {
        return $rows->map(fn (object $row) => [
            'id' => $row->id,
            'name' => $row->nickname ?: $row->name,
            'position' => $row->position,
            'current_overall' => $row->current_overall,
            'value' => match ($metric) {
                'goals' => (int) $row->goals,
                'assists' => (int) $row->assists,
                'ga' => (int) $row->goals + (int) $row->assists,
            },
        ])->all();
    }
}
