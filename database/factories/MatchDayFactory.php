<?php

namespace Database\Factories;

use App\Models\MatchDay;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MatchDay>
 */
class MatchDayFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => $this->faker->dateTimeBetween('-1 month', '+1 month')->format('Y-m-d'),
            'number_of_matches' => $this->faker->numberBetween(1, 3),
            'number_of_teams' => $this->faker->numberBetween(2, 4),
            'players_per_team' => $this->faker->numberBetween(4, 6),
        ];
    }
}
