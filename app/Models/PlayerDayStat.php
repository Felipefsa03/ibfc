<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlayerDayStat extends Model
{
    protected $fillable = [
        'match_day_id',
        'player_id',
        'goals',
        'assists',
        'decisive_passes',
        'stars',
    ];

    protected $casts = [
        'goals' => 'integer',
        'assists' => 'integer',
        'decisive_passes' => 'integer',
        'stars' => 'integer',
    ];

    public function matchDay(): BelongsTo
    {
        return $this->belongsTo(MatchDay::class);
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }
}
