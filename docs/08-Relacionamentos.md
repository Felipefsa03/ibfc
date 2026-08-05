# 08 — Relacionamentos

## 1. Diagrama geral (ASCII)

```
                         ┌──────────────┐
                         │   Player     │
                         │──────────────│
                         │ id           │
                         │ name         │
                         │ nickname     │
                         │ current_ov.  │
                         └──────┬───────┘
                  1:N           │           1:N              1:1
        ┌────────────────────────┼─────────────────────┐        │
        ▼                         ▼                     ▼        ▼
┌────────────────┐      ┌──────────────────┐   ┌──────────────┐ ┌────────────────────┐
│  TeamPlayer     │      │  PlayerDayStat    │   │ (via Team)   │ │ PlayerSeasonStat    │
│─────────────────│      │───────────────────│   │              │ │─────────────────────│
│ id              │      │ id                │   │              │ │ id                  │
│ team_id (FK)    │      │ match_day_id (FK) │   │              │ │ player_id (FK,uniq) │
│ player_id (FK)  │      │ player_id (FK)    │   │              │ │ games/wins/draws/.. │
└───────┬─────────┘      │ goals             │   │              │ └─────────────────────┘
        │ N:1            │ assists           │   │              │
        ▼                └─────────┬─────────┘   │              │
┌────────────────┐                 │ N:1          │              │
│     Team        │                ▼              │              │
│─────────────────│      ┌──────────────────┐      │              │
│ id              │◄─────┤    MatchDay       │      │              │
│ match_day_id(FK)│ N:1  │───────────────────│      │              │
│ name / score    │      │ id                │      │              │
│ won             │      │ date              │      │              │
└─────────────────┘      │ number_of_teams   │      │              │
                          └───────────────────┘      │              │
```

## 2. Relacionamentos detalhados

### 2.1 Player 1:N PlayerDayStat
Um jogador pode ter várias estatísticas (uma por Match Day em que participou).

```php
// Player.php
public function dayStats(): HasMany
{
    return $this->hasMany(PlayerDayStat::class);
}

// PlayerDayStat.php
public function player(): BelongsTo
{
    return $this->belongsTo(Player::class);
}
```

Exemplo de uso:
```php
$player->dayStats()->sum('goals'); // total de gols do jogador (alternativa a usar player_season_stats)
```

### 2.2 Player 1:N TeamPlayer (e, por consequência, Player N:N Team)
Um jogador participa de vários times ao longo de diferentes Match Days; um time tem vários jogadores.

```php
// Player.php
public function teamPlayers(): HasMany
{
    return $this->hasMany(TeamPlayer::class);
}

// Team.php
public function teamPlayers(): HasMany
{
    return $this->hasMany(TeamPlayer::class);
}
```

> O relacionamento N:N (Player ↔ Team) é modelado explicitamente via `TeamPlayer` (Model próprio) em vez de `belongsToMany` direto, porque `TeamPlayer` é uma entidade de domínio com significado próprio (representa "escalação"), não apenas uma tabela pivô anônima. Ainda assim, é possível declarar um `belongsToMany` auxiliar caso seja conveniente para consultas (`Team::players()`).

### 2.3 Player 1:1 PlayerSeasonStat (a implementar)
Cada jogador tem no máximo um resumo agregado de temporada.

```php
// Player.php (a adicionar)
public function seasonStat(): HasOne
{
    return $this->hasOne(PlayerSeasonStat::class);
}

// PlayerSeasonStat.php (a criar)
public function player(): BelongsTo
{
    return $this->belongsTo(Player::class);
}
```

### 2.4 MatchDay 1:N Team
Um Match Day gera vários times; cada time pertence a um único Match Day.

```php
// MatchDay.php
public function teams(): HasMany
{
    return $this->hasMany(Team::class);
}

// Team.php
public function matchDay(): BelongsTo
{
    return $this->belongsTo(MatchDay::class);
}
```

### 2.5 MatchDay 1:N PlayerDayStat
Um Match Day tem várias estatísticas (uma por jogador participante).

```php
// MatchDay.php
public function playerDayStats(): HasMany
{
    return $this->hasMany(PlayerDayStat::class);
}
```

### 2.6 Team 1:N TeamPlayer
Já coberto em 2.2 — um time tem vários vínculos de jogador.

## 3. Exemplos de queries encadeando relacionamentos

```php
// Todos os jogadores de um time específico
$team->teamPlayers()->with('player')->get()->pluck('player');

// Todos os times de um Match Day, com seus jogadores
$matchDay->teams()->with('teamPlayers.player')->get();

// Estatísticas de um jogador em todos os Match Days
$player->dayStats()->with('matchDay')->orderByDesc('matchDay.date')->get();

// Ranking de artilheiros da temporada (via tabela agregada)
PlayerSeasonStat::with('player')->orderByDesc('goals')->limit(10)->get();
```

## 4. Cardinalidade — resumo

| Relação | Cardinalidade |
|---|---|
| Player → PlayerDayStat | 1:N |
| Player → TeamPlayer | 1:N |
| Player → PlayerSeasonStat | 1:1 |
| MatchDay → Team | 1:N |
| MatchDay → PlayerDayStat | 1:N |
| Team → TeamPlayer | 1:N |
| Team ↔ Player (via TeamPlayer) | N:N |
