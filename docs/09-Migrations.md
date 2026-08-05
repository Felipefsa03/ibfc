# 09 — Migrations

## 1. Ordem correta das migrations

As migrations do Laravel rodam em ordem cronológica pelo prefixo de timestamp do nome do arquivo. A ordem correta para este projeto é:

```
0001_01_01_000000_create_users_table.php          (padrão Laravel/Breeze)
0001_01_01_000001_create_cache_table.php           (padrão Laravel)
0001_01_01_000002_create_jobs_table.php             (padrão Laravel)
2026_07_30_054052_create_players_table.php          (já existe)
2026_07_30_054053_create_match_days_table.php        (já existe)
2026_07_30_054054_create_teams_table.php             (já existe — depende de match_days)
2026_07_30_054055_create_team_players_table.php      (já existe — depende de teams e players)
2026_07_30_054056_create_player_day_stats_table.php  (já existe — depende de match_days e players)
[nova]_create_player_season_stats_table.php          (a criar — depende de players)
```

A ordem importa porque cada tabela com `foreignId()->constrained()` exige que a tabela referenciada já exista. Isso já está corretamente respeitado nas migrations existentes (ex.: `teams` só é criada depois de `match_days`).

## 2. Boas práticas já seguidas no projeto (e que devem continuar sendo seguidas)

- **Foreign keys explícitas com `constrained()`**: `$table->foreignId('match_day_id')->constrained('match_days')->cascadeOnDelete();` — nomeia a coluna, resolve a tabela referenciada automaticamente pela convenção (`match_days` a partir de `match_day_id`) e já declara a ação de exclusão.
- **Índices em colunas de busca/filtro frequente**: `players.name`, `players.nickname`, `players.active`, `match_days.date`.
- **Uniques compostos para regras de negócio no nível de banco**: `team_players(team_id, player_id)` e `player_day_stats(match_day_id, player_id)` — a regra "não duplicar" é garantida pelo próprio banco, não apenas pela aplicação.
- **Defaults sensatos**: contadores (`goals`, `assists`, `score`) sempre com `default(0)`; booleans com default explícito (`active` default `true`, `won` default `false`).
- **Método `down()` sempre espelhando o `up()`** (`dropIfExists`), garantindo que a migration seja reversível.

## 3. Foreign Keys — cascade vs restrict vs null

| Estratégia | Quando usar | Uso neste projeto |
|---|---|---|
| `cascadeOnDelete()` | Quando o registro filho não tem sentido sem o pai | `teams.match_day_id`, `team_players.team_id`/`player_id`, `player_day_stats.match_day_id`/`player_id` — um time não existe sem o Match Day, uma estatística não existe sem o jogador/dia. |
| `restrictOnDelete()` | Quando o pai não deve poder ser excluído enquanto tiver filhos | Não usado atualmente; seria aplicável a `players.id` se quiséssemos impedir a exclusão física de um jogador com histórico em vez de fazer cascade (ver RN03 em [02-RegrasDeNegocio.md](02-RegrasDeNegocio.md) — a regra de negócio já impede isso na camada de aplicação, então cascade no banco é aceitável como segunda camada de proteção). |
| `nullOnDelete()` | Quando o filho pode existir sem o pai (referência opcional) | Não há caso de uso no domínio atual. |

## 4. Migration proposta: `create_player_season_stats_table`

Segue o mesmo padrão das migrations existentes:

```
Schema::create('player_season_stats', function (Blueprint $table) {
    $table->id();
    $table->foreignId('player_id')->unique()->constrained('players')->cascadeOnDelete();
    $table->unsignedInteger('games')->default(0);
    $table->unsignedInteger('wins')->default(0);
    $table->unsignedInteger('draws')->default(0);
    $table->unsignedInteger('losses')->default(0);
    $table->unsignedInteger('goals')->default(0);
    $table->unsignedInteger('assists')->default(0);
    $table->timestamps();
});
```

(Descrito aqui em pseudocódigo/estrutura, não como arquivo de código real — a criação efetiva do arquivo faz parte da implementação, ver [19-Roadmap.md](19-Roadmap.md), e deve usar `php artisan make:migration create_player_season_stats_table`.)

## 5. Item de cleanup a considerar em uma migration futura

A migration `create_team_players_table` adiciona `$table->timestamps()`, mas o Model `TeamPlayer` usa `$timestamps = false`. Ao resolver esse item (ver [07-BancoDeDados.md](07-BancoDeDados.md)), se a decisão for remover as colunas, isso deve ser feito por meio de uma **nova migration** (`php artisan make:migration remove_timestamps_from_team_players_table`) — nunca editando a migration original já aplicada.
