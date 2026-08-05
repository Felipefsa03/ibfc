<?php

namespace Database\Factories;

use App\Models\MatchDay;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Team>
 */
class TeamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'match_day_id' => MatchDay::factory(),
            'name' => 'Time '.strtoupper($this->faker->randomLetter()),
            'score' => 0,
            'won' => false,
        ];
    }

    public function winner(): static
    {
        return $this->state(fn (): array => ['won' => true]);
    }
}
