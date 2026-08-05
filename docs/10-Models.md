# 10 — Models

## 1. Player

```php
protected $fillable = [
    'name', 'nickname', 'gol', 'sho', 'pas', 'dri', 'def', 'phy',
    'overall_base', 'current_overall', 'active',
];

protected $casts = [
    'active' => 'boolean',
];
```

**Relationships**: `dayStats()` (`HasMany` → `PlayerDayStat`), `teamPlayers()` (`HasMany` → `TeamPlayer`), `seasonStat()` (`HasOne` → `PlayerSeasonStat`, a adicionar).

**Accessors sugeridos**:
- `displayName` — retorna `nickname` quando presente, senão `name`. Útil para listas compactas (ex.: cards de time).

**Scopes sugeridos**:
```php
public function scopeActive(Builder $query): Builder
{
    return $query->where('active', true);
}
```
Uso: `Player::active()->orderByDesc('current_overall')->get()`.

## 2. MatchDay

```php
protected $fillable = [
    'date', 'number_of_matches', 'number_of_teams', 'players_per_team',
];

protected $casts = [
    'date' => 'date',
];
```

**Relationships**: `teams()` (`HasMany`), `playerDayStats()` (`HasMany`).

**Scopes sugeridos**:
```php
public function scopeUpcoming(Builder $query): Builder
{
    return $query->where('date', '>=', now()->toDateString());
}
```

## 3. Team

```php
protected $fillable = [
    'match_day_id', 'name', 'score', 'won',
];

protected $casts = [
    'won' => 'boolean',
];
```

**Relationships**: `matchDay()` (`BelongsTo`), `teamPlayers()` (`HasMany`).

**Accessor sugerido**: `totalOverall` — soma do `current_overall` de todos os jogadores do time (via `teamPlayers.player`), útil para exibir "força do time" na tela de resultado da geração.

## 4. TeamPlayer

```php
protected $fillable = ['team_id', 'player_id'];

public $timestamps = false;
```

**Relationships**: `team()` (`BelongsTo`), `player()` (`BelongsTo`).

> Ver observação sobre a inconsistência `$timestamps = false` vs coluna `timestamps()` na migration em [07-BancoDeDados.md](07-BancoDeDados.md).

## 5. PlayerDayStat

```php
protected $fillable = ['match_day_id', 'player_id', 'goals', 'assists'];
```

**Relationships**: `matchDay()` (`BelongsTo`), `player()` (`BelongsTo`).

**Uso típico**: `PlayerDayStat::updateOrCreate(['match_day_id' => $id, 'player_id' => $playerId], ['goals' => $goals, 'assists' => $assists])` — o `updateOrCreate` já respeita a regra de unicidade (RN09) sem precisar de checagem manual.

## 6. PlayerSeasonStat — *a criar*

```php
protected $fillable = ['player_id', 'games', 'wins', 'draws', 'losses', 'goals', 'assists'];
```

**Relationships**: `player()` (`BelongsTo`).

## 7. Boas práticas gerais de Models neste projeto

- **Mass assignment sempre via `$fillable` explícito** — nunca usar `$guarded = []`, que exporia todas as colunas a atribuição em massa, incluindo campos sensíveis como `current_overall` (que só deve mudar via recálculo automático, RN02).
- **Casts explícitos** para booleans e dates, evitando comparações erradas (`"0"` vs `false`, string vs `Carbon`).
- **Relacionamentos sempre com return type declarado** (`HasMany`, `BelongsTo`, etc.), conforme padrão PHP 8.4 já usado nos Models existentes.
- **Nenhuma lógica de negócio pesada dentro do Model** — cálculos como overall ou balanceamento de times vivem em Services (ver [03-ArquiteturaMVC.md](03-ArquiteturaMVC.md)), o Model apenas expõe os dados e relacionamentos.
- **Scopes para queries repetidas** (ex.: `active()`) em vez de repetir `where('active', true)` em múltiplos Controllers.
