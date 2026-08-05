<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained('teams')->cascadeOnDelete();
            $table->foreignId('player_id')->constrained('players')->cascadeOnDelete();

            // Nota: Se decidir manter $timestamps = false na model TeamPlayer, pode remover a linha abaixo[cite: 5].
            $table->timestamps();

            // Evita que o mesmo jogador seja adicionado duas vezes ao mesmo time
            $table->unique(['team_id', 'player_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_players');
    }
};
