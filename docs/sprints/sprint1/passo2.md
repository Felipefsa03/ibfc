# Revisar e executar as migrations existentes

O projeto já possui as migrations do domínio criadas. Este passo consiste em revisá-las, entendê-las e executá-las no banco MySQL configurado no passo anterior.

## Objetivo

Executar `php artisan migrate` e confirmar que todas as tabelas do sistema foram criadas corretamente no MySQL.

## Contexto

Diferentemente de um projeto novo, as migrations de `players`, `match_days`, `teams`, `team_players` e `player_day_stats` **já existem** em `database/migrations/2026_07_30_*` (junto com as migrations padrão do Laravel: `users`, `cache`, `jobs`). Não é necessário criar nenhuma migration neste passo — apenas revisar e aplicar. A tabela `player_season_stats` ainda **não** existe e será criada apenas na Sprint 7 ([../sprint7/passo1.md](../sprint7/passo1.md)).

## Pré-requisitos

- [passo1.md](passo1.md) concluído (banco MySQL configurado e acessível).

## Arquivos que serão criados

- Nenhum.

## Arquivos que serão modificados

- Nenhum (as migrations existentes não devem ser editadas).

## O que implementar

1. Ler cada migration em `database/migrations/2026_07_30_*` comparando com a especificação de [../../07-BancoDeDados.md](../../07-BancoDeDados.md) — colunas, tipos, defaults, índices, uniques e foreign keys devem bater.
2. Executar `php artisan migrate`.
3. Conferir no MySQL que as tabelas foram criadas: `users`, `cache`, `jobs`, `players`, `match_days`, `teams`, `team_players`, `player_day_stats` (mais as auxiliares padrão do framework).
4. Conferir as constraints: unique composto em `team_players(team_id, player_id)` e em `player_day_stats(match_day_id, player_id)`; FKs com `ON DELETE CASCADE`.

## Regras de negócio envolvidas

- RN09 (unicidade de estatística por jogador/dia) e a unicidade de escalação — ambas garantidas pelos uniques compostos criados aqui.
- RN15 (cascata de exclusão) — garantida pelas FKs `cascadeOnDelete`.

## Fluxo

```
Desenvolvedor
    ↓
Revisa migrations existentes (comparando com docs/07)
    ↓
php artisan migrate
    ↓
Banco MySQL
    ↓
Verificação das tabelas e constraints criadas
```

## Critérios de aceite

- ☐ Todas as migrations executadas sem erro (`php artisan migrate:status` mostra tudo "Ran").
- ☐ As 5 tabelas de domínio existem no MySQL com as colunas descritas em docs/07.
- ☐ Uniques compostos confirmados em `team_players` e `player_day_stats`.
- ☐ FKs com cascade confirmadas (`teams.match_day_id`, `team_players.*`, `player_day_stats.*`).

## Observações

- **Armadilha**: durante a revisão você notará que a migration de `team_players` cria colunas `created_at`/`updated_at`, mas o Model `TeamPlayer` tem `$timestamps = false`. **Não corrija agora** — essa inconsistência é tratada de forma controlada no [passo3.md](passo3.md).
- **Boas práticas**: nunca editar uma migration já aplicada; qualquer ajuste de schema é sempre uma migration nova ([../../09-Migrations.md](../../09-Migrations.md)).
- Referências: [../../07-BancoDeDados.md](../../07-BancoDeDados.md), [../../09-Migrations.md](../../09-Migrations.md), [../../08-Relacionamentos.md](../../08-Relacionamentos.md).

## Dependências

**Depende de:**
- [passo1.md](passo1.md)

**Desbloqueia:**
- [passo3.md](passo3.md)
- [passo4.md](passo4.md)
- [passo5.md](passo5.md)
- [passo6.md](passo6.md)
- [../sprint2/passo1.md](../sprint2/passo1.md)
- [../sprint4/passo1.md](../sprint4/passo1.md)
- [../sprint7/passo1.md](../sprint7/passo1.md)
