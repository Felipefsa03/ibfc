<?php

use App\Services\OverallCalculatorService;

it('computes the arithmetic mean of the six attributes', function () {
    $overall = (new OverallCalculatorService)->base([
        'gol' => 10,
        'sho' => 70,
        'pas' => 65,
        'dri' => 68,
        'def' => 40,
        'phy' => 72,
    ]);

    expect($overall)->toBe(54);
});

it('rounds the average to the nearest integer', function () {
    $overall = (new OverallCalculatorService)->base([
        'gol' => 99,
        'sho' => 99,
        'pas' => 99,
        'dri' => 99,
        'def' => 99,
        'phy' => 99,
    ]);

    expect($overall)->toBe(99);
});

it('returns zero when all attributes are zero', function () {
    $overall = (new OverallCalculatorService)->base([
        'gol' => 0,
        'sho' => 0,
        'pas' => 0,
        'dri' => 0,
        'def' => 0,
        'phy' => 0,
    ]);

    expect($overall)->toBe(0);
});
