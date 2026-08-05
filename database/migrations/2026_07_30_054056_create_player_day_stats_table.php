<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('player_day_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_day_id')->constrained('match_days')->cascadeOnDelete();
            $table->foreignId('player_id')->constrained('players')->cascadeOnDelete();
            $table->unsignedInteger('goals')->default(0);
            $table->unsignedInteger('assists')->default(0);
            $table->timestamps();

            // Garante que o jogador tenha apenas um registro de estatística por dia de partida
            $table->unique(['match_day_id', 'player_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_day_stats');
    }
};
