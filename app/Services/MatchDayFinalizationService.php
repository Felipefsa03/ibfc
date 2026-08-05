<?php

namespace App\Services;

use App\Models\MatchDay;
use App\Models\Player;
use App\Models\PlayerDayStat;
use Illuminate\Support\Facades\DB;

class MatchDayFinalizationService
{
    /**
     * Every player called up for the match day pays this cost on the passing
     * and attacking attributes. Performance below earns it back, so a player
     * who does not produce decays over the season.
     */
    public const PARTICIPATION_PENALTY = 7;

    public const POINTS_PER_GOAL = 1.0;

    public const POINTS_PER_ASSIST = 0.5;

    public const POINTS_PER_DECISIVE_PASS = 0.5;

    /** Each star awards this much on *every* tactical attribute. */
    public const POINTS_PER_STAR = 0.5;

    public const ATTRIBUTE_MIN = 0;

    public const ATTRIBUTE_MAX = 99;

    /**
     * Attributes that carry the participation penalty and the performance
     * bonus: `pas` is passing, `sho` is finishing (attack).
     *
     * @var list<string>
     */
    public const PERFORMANCE_ATTRIBUTES = ['pas', 'sho'];

    /**
     * Every tactical attribute, all of which receive the star bonus.
     *
     * @var list<string>
     */
    public const ALL_ATTRIBUTES = ['gol', 'sho', 'pas', 'dri', 'def', 'phy'];

    public function __construct(protected OverallCalculatorService $calculator) {}

    /**
     * Persist each participant's performance and apply the resulting attribute
     * progression, then close the match day.
     *
     * @param  list<array{player_id: int, goals: int, assists: int, decisive_passes: int, stars: int}>  $entries
     * @return int Number of players updated.
     */
    public function finalize(MatchDay $matchDay, array $entries): int
    {
        return DB::transaction(function () use ($matchDay, $entries): int {
            $players = Player::query()
                ->whereIn('id', array_column($entries, 'player_id'))
                ->get()
                ->keyBy('id');

            foreach ($entries as $entry) {
                $player = $players->get($entry['player_id']);

                if (! $player instanceof Player) {
                    continue;
                }

                PlayerDayStat::updateOrCreate(
                    [
                        'match_day_id' => $matchDay->id,
                        'player_id' => $player->id,
                    ],
                    [
                        'goals' => $entry['goals'],
                        'assists' => $entry['assists'],
                        'decisive_passes' => $entry['decisive_passes'],
                        'stars' => $entry['stars'],
                    ],
                );

                $this->applyProgression($player, $entry);
            }

            $matchDay->finalized_at = now();
            $matchDay->save();

            return $players->count();
        });
    }

    /**
     * Recalculate a player's attributes and overall from one match day's
     * performance.
     *
     * @param  array{goals: int, assists: int, decisive_passes: int, stars: int}  $entry
     */
    protected function applyProgression(Player $player, array $entry): void
    {
        $performance = ($entry['goals'] * self::POINTS_PER_GOAL)
            + ($entry['assists'] * self::POINTS_PER_ASSIST)
            + ($entry['decisive_passes'] * self::POINTS_PER_DECISIVE_PASS);

        $starBonus = $entry['stars'] * self::POINTS_PER_STAR;

        $attributes = [];

        foreach (self::ALL_ATTRIBUTES as $attribute) {
            $value = $player->{$attribute} + $starBonus;

            if (in_array($attribute, self::PERFORMANCE_ATTRIBUTES, true)) {
                $value += $performance - self::PARTICIPATION_PENALTY;
            }

            $attributes[$attribute] = $this->clamp($value);
        }

        $overall = $this->calculator->base($attributes);

        $player->update([
            ...$attributes,
            'overall_base' => $overall,
            'current_overall' => $overall,
        ]);
    }

    protected function clamp(float $value): int
    {
        return (int) max(self::ATTRIBUTE_MIN, min(self::ATTRIBUTE_MAX, round($value)));
    }
}
