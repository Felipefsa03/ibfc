<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MatchDay extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'number_of_matches',
        'number_of_teams',
        'players_per_team',
    ];

    protected $casts = [
        'date' => 'date',
        'finalized_at' => 'datetime',
    ];

    /**
     * A finalized match day has already paid out attribute progression, so it
     * must never be finalized twice.
     */
    public function isFinalized(): bool
    {
        return $this->finalized_at !== null;
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function playerDayStats(): HasMany
    {
        return $this->hasMany(PlayerDayStat::class);
    }
}
