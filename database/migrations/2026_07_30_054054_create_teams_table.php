<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_day_id')->constrained('match_days')->cascadeOnDelete();
            $table->string('name');
            $table->integer('score')->default(0);
            $table->boolean('won')->default(false);
            $table->timestamps();

            $table->index('match_day_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
