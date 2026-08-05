<?php

use App\Models\Player;
use App\Services\TeamBalancingService;

/**
 * @return array<int, array{id: int, current_overall: int}>
 */
function balancedPlayer(int $id, int $currentOverall): Player
{
    $player = new Player(['current_overall' => $currentOverall]);
    $player->id = $id;

    return $player;
}

it('distributes players so the team totals are as even as possible', function () {
    $players = collect([
        balancedPlayer(1, 90),
        balancedPlayer(2, 80),
        balancedPlayer(3, 70),
        balancedPlayer(4, 60),
    ]);

    $assignments = app(TeamBalancingService::class)->balance($players, 2, 5);

    $totals = [0, 0];

    foreach ($assignments as $assignment) {
        $totals[$assignment['team_index']] += $players
            ->firstWhere('id', $assignment['player_id'])
            ->current_overall;
    }

    expect($totals)->toBe([150, 150]);
});

it('never exceeds the configured players per team', function () {
    $players = collect([
        balancedPlayer(1, 90),
        balancedPlayer(2, 80),
        balancedPlayer(3, 70),
        balancedPlayer(4, 60),
        balancedPlayer(5, 50),
        balancedPlayer(6, 40),
    ]);

    $assignments = app(TeamBalancingService::class)->balance($players, 2, 2);

    $perTeam = collect($assignments)->groupBy('team_index')->map->count();

    expect($assignments)->toHaveCount(4);
    expect($perTeam->values()->all())->toBe([2, 2]);
});

it('leaves the surplus players unassigned when slots run out', function () {
    $players = collect([
        balancedPlayer(1, 90),
        balancedPlayer(2, 80),
        balancedPlayer(3, 70),
        balancedPlayer(4, 60),
        balancedPlayer(5, 50),
        balancedPlayer(6, 40),
    ]);

    $assignments = app(TeamBalancingService::class)->balance($players, 2, 2);

    $assignedIds = collect($assignments)->pluck('player_id')->sort()->values()->all();

    expect($assignedIds)->toBe([1, 2, 3, 4]);
});

it('handles more teams than players leaving empty buckets', function () {
    $players = collect([
        balancedPlayer(1, 90),
        balancedPlayer(2, 80),
    ]);

    $assignments = app(TeamBalancingService::class)->balance($players, 4, 1);

    $teamIndexes = collect($assignments)->pluck('team_index')->sort()->values()->all();

    expect($teamIndexes)->toBe([0, 1]);
});

it('accepts an empty roster', function () {
    $assignments = app(TeamBalancingService::class)->balance(collect(), 2, 5);

    expect($assignments)->toBe([]);
});
