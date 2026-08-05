<?php

namespace App\Services;

use App\Models\Player;
use Illuminate\Support\Collection;

class TeamBalancingService
{
    /**
     * Distribute players across teams minimising the difference between the
     * teams' total overall. Greedy: players are sorted by current overall in
     * descending order and each one is assigned to the team with the lowest
     * total so far, tie-broken by the team with the fewest players so that
     * the squads also stay evenly sized.
     *
     * @param  Collection<int, Player>  $players
     * @return array<int, array{team_index: int, player_id: int}>
     */
    public function balance(Collection $players, int $teamCount, int $playersPerTeam): array
    {
        $teamCount = max(2, $teamCount);
        $playersPerTeam = max(1, $playersPerTeam);

        $buckets = array_fill(0, $teamCount, ['total' => 0, 'ids' => []]);

        foreach ($players->sortByDesc('current_overall')->values() as $player) {
            $target = $this->findTargetBucket($buckets, $playersPerTeam);

            if ($target === null) {
                break;
            }

            $buckets[$target]['total'] += $player->current_overall;
            $buckets[$target]['ids'][] = $player->id;
        }

        $assignments = [];

        foreach ($buckets as $teamIndex => $bucket) {
            foreach ($bucket['ids'] as $playerId) {
                $assignments[] = [
                    'team_index' => $teamIndex,
                    'player_id' => $playerId,
                ];
            }
        }

        return $assignments;
    }

    /**
     * Index of the bucket with the lowest total that still has room, or null
     * when every bucket is full.
     *
     * @param  array<int, array{total: int, ids: array<int, int>}>  $buckets
     */
    private function findTargetBucket(array $buckets, int $playersPerTeam): ?int
    {
        $target = null;
        $targetTotal = PHP_INT_MAX;
        $targetSize = PHP_INT_MAX;

        foreach ($buckets as $index => $bucket) {
            if (count($bucket['ids']) >= $playersPerTeam) {
                continue;
            }

            $total = $bucket['total'];
            $size = count($bucket['ids']);

            if ($total < $targetTotal || ($total === $targetTotal && $size < $targetSize)) {
                $target = $index;
                $targetTotal = $total;
                $targetSize = $size;
            }
        }

        return $target;
    }
}
