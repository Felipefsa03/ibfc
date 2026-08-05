# Criar a migration de player_season_stats

A última tabela do sistema: o resumo agregado de temporada por jogador.

## Objetivo

Criar a migration `create_player_season_stats_table` conforme a especificação já documentada.

## Contexto

Os rankings devem ser `ORDER BY` simples sobre uma tabela agregada, não `SUM`s repetidos sobre `player_day_stats` a cada requisição ([../../16-Estatisticas.md](../../16-Estatisticas.md), seção 1). A estrutura exata da tabela está definida em [../../09-Migrations.md](../../09-Migrations.md) (seção 4) e [../../07-BancoDeDados.md](../../07-BancoDeDados.md) (seção 6): `player_id` FK **unique** (um resumo por jogador, cascade), contadores `games/wins/draws/losses/goals/assists` unsigned default 0, timestamps.

## Pré-requisitos

- [../sprint6/passo5.md](../sprint6/passo5.md) concluído (Sprint 6 fechada).
- [../sprint1/passo2.md](../sprint1/passo2.md) (tabela `players` existe).

## Arquivos que serão criados

- `database/migrations/<timestamp>_create_player_season_stats_table.php` (`php artisan make:migration create_player_season_stats_table --no-interaction`).

## Arquivos que serão modificados

- Nenhum.

## O que implementar

1. Migration exatamente conforme a estrutura da doc 09 seção 4 (incluindo o `unique` no `player_id` — é ele que garante o 1:1).
2. `down()` com `dropIfExists`.
3. Executar `php artisan migrate` e conferir a tabela no MySQL.

## Regras de negócio envolvidas

- RN13 — a tabela é o suporte físico do resumo agregado.

## Fluxo

```
make:migration → up() conforme doc 09 §4 → php artisan migrate → tabela criada
```

## Critérios de aceite

- ☐ Tabela criada com todas as colunas, defaults 0 e unique em `player_id`.
- ☐ FK com cascade confirmada.
- ☐ Migration reversível (rollback + migrate ok).

## Observações

- **Armadilha**: sem o `unique(player_id)`, `updateOrCreate` sob concorrência poderia duplicar resumos — o unique é a garantia final.
- Referências: [../../09-Migrations.md](../../09-Migrations.md) (seção 4), [../../07-BancoDeDados.md](../../07-BancoDeDados.md) (seção 6).

## Dependências

**Depende de:**
- [../sprint6/passo5.md](../sprint6/passo5.md)
- [../sprint1/passo2.md](../sprint1/passo2.md)

**Desbloqueia:**
- [passo2.md](passo2.md)
