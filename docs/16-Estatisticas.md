# 16 — Estatísticas

## 1. Fonte de dados

- **Fonte primária/histórica**: `player_day_stats` — um registro por jogador por Match Day, nunca alterado após o fechamento do dia.
- **Fonte de consulta rápida**: `player_season_stats` — resumo agregado, mantido sincronizado automaticamente (RN13, [02-RegrasDeNegocio.md](02-RegrasDeNegocio.md)). Todos os rankings devem consultar esta tabela, não recalcular somas em tempo real sobre `player_day_stats`.

## 2. Ranking de artilharia

```php
PlayerSeasonStat::with('player')
    ->whereHas('player', fn ($q) => $q->active())
    ->orderByDesc('goals')
    ->limit(10)
    ->get();
```

## 3. Ranking de assistências

```php
PlayerSeasonStat::with('player')
    ->orderByDesc('assists')
    ->limit(10)
    ->get();
```

## 4. Ranking de participação (jogos disputados)

```php
PlayerSeasonStat::with('player')
    ->orderByDesc('games')
    ->limit(10)
    ->get();
```

## 5. Ranking de vitórias

```php
PlayerSeasonStat::with('player')
    ->orderByDesc('wins')
    ->limit(10)
    ->get();
```

## 6. Médias derivadas (calculadas em tempo de exibição, não armazenadas)

- **Média de gols por jogo**: `goals / games` (proteger contra divisão por zero quando `games == 0`).
- **Média de assistências por jogo**: `assists / games`.
- **Aproveitamento**: `wins / games * 100` (%).

Essas médias não precisam de coluna própria no banco — são calculadas no momento da exibição (Controller ou Accessor no Model `PlayerSeasonStat`), pois são triviais e sempre derivadas dos totais já armazenados.

## 7. Histórico de partidas de um jogador

```php
$player->dayStats()
    ->with('matchDay')
    ->join('match_days', 'match_days.id', '=', 'player_day_stats.match_day_id')
    ->orderByDesc('match_days.date')
    ->select('player_day_stats.*')
    ->get();
```

Exibido na tela de perfil do jogador (ou na aba "Histórico" de estatísticas): data do Match Day, gols, assistências e o time em que jogou naquele dia.

## 8. Estatísticas de um Match Day específico

```php
$matchDay->playerDayStats()->with('player')->get();
$matchDay->teams()->with('teamPlayers.player')->get();
```

Usado na tela `MatchDays/Show.tsx` para mostrar o resultado completo daquele dia: times formados, placar, gols/assistências de cada jogador.

## 9. Considerações de consistência

- Todo recálculo de `player_season_stats` deve ocorrer dentro da mesma transação que fecha o Match Day (RNF04, [01-Requisitos.md](01-Requisitos.md)) — nunca deixar a tabela agregada dessincronizada da fonte primária.
- Caso seja necessário reprocessar as estatísticas de temporada do zero (ex.: após corrigir um bug de cálculo), deve existir um Artisan Command dedicado (`php artisan stats:rebuild`) que recalcula `player_season_stats` inteiramente a partir de `player_day_stats` — nunca uma correção manual direto no banco.
