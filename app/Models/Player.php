<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'nickname',
        'position',
        'nationality',
        'club',
        'gol',
        'sho',
        'pas',
        'dri',
        'def',
        'phy',
        'overall_base',
        'current_overall',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function dayStats(): HasMany
    {
        return $this->hasMany(PlayerDayStat::class);
    }

    public function teamPlayers(): HasMany
    {
        return $this->hasMany(TeamPlayer::class);
    }
}
