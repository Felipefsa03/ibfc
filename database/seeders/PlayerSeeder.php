<?php

namespace Database\Seeders;

use App\Models\Player;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Populates the database with a demo squad for development purposes.
 *
 * Meant to run on a fresh database (`php artisan migrate:fresh --seed`);
 * running it on an existing database will duplicate players.
 */
class PlayerSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        Player::factory()->count(14)->create();
        Player::factory()->goalkeeper()->count(3)->create();
        Player::factory()->inactive()->count(2)->create();
    }
}
