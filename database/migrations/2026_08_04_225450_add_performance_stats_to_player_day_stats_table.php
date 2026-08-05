<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('player_day_stats', function (Blueprint $table) {
            $table->unsignedInteger('decisive_passes')->default(0)->after('assists');
            $table->unsignedTinyInteger('stars')->default(0)->after('decisive_passes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('player_day_stats', function (Blueprint $table) {
            $table->dropColumn(['decisive_passes', 'stars']);
        });
    }
};
