<?php

namespace App\Services;

class OverallCalculatorService
{
    /**
     * Weights used to compute the base overall from the six tactical
     * attributes. Weights are equal in the initial configuration.
     *
     * @var array<string, int>
     */
    protected const WEIGHTS = [
        'gol' => 1,
        'sho' => 1,
        'pas' => 1,
        'dri' => 1,
        'def' => 1,
        'phy' => 1,
    ];

    /**
     * Calculate the base overall from the six tactical attributes.
     *
     * @param  array{gol: int, sho: int, pas: int, dri: int, def: int, phy: int}  $attributes
     */
    public function base(array $attributes): int
    {
        $numerator = 0;
        $denominator = 0;

        foreach (self::WEIGHTS as $attribute => $weight) {
            $numerator += $attributes[$attribute] * $weight;
            $denominator += $weight;
        }

        return (int) round($numerator / $denominator);
    }
}
