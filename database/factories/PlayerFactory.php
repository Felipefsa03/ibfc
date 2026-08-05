<?php

namespace Database\Factories;

use App\Models\Player;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Player>
 */
class PlayerFactory extends Factory
{
    protected const POSITIONS = ['GOL', 'ZAG', 'LD', 'LE', 'VOL', 'MC', 'MEI', 'ATA', 'PE', 'PD'];

    protected const COUNTRIES = ['BR', 'AR', 'PT', 'UY', 'CO', 'FR', 'IT', 'ES', 'DE', 'NL'];

    protected const CLUBS = [
        'IBFC', 'IBFC Sub-20', 'Amigos FC', 'Liga da Vila', 'United Parque',
        'Real Bairro', 'Atlético Zona Sul', 'Ferroviária',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $attributes = [
            'gol' => $this->faker->numberBetween(30, 90),
            'sho' => $this->faker->numberBetween(30, 90),
            'pas' => $this->faker->numberBetween(30, 90),
            'dri' => $this->faker->numberBetween(30, 90),
            'def' => $this->faker->numberBetween(30, 90),
            'phy' => $this->faker->numberBetween(30, 90),
        ];

        $overall = (int) round(array_sum($attributes) / count($attributes));

        return [
            'name' => $this->faker->name(),
            'nickname' => $this->faker->optional(0.7)->firstName(),
            'position' => $this->faker->randomElement(self::POSITIONS),
            'nationality' => $this->faker->randomElement(self::COUNTRIES),
            'club' => $this->faker->randomElement(self::CLUBS),
            ...$attributes,
            'overall_base' => $overall,
            'current_overall' => $overall,
            'active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => ['active' => false]);
    }

    public function goalkeeper(): static
    {
        return $this->state(function (): array {
            $attributes = [
                'gol' => $this->faker->numberBetween(70, 99),
                'sho' => $this->faker->numberBetween(40, 70),
                'pas' => $this->faker->numberBetween(40, 70),
                'dri' => $this->faker->numberBetween(40, 70),
                'def' => $this->faker->numberBetween(40, 70),
                'phy' => $this->faker->numberBetween(50, 80),
            ];

            $overall = (int) round(array_sum($attributes) / count($attributes));

            return [
                ...$attributes,
                'position' => 'GOL',
                'overall_base' => $overall,
                'current_overall' => $overall,
            ];
        });
    }
}
