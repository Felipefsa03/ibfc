# Implementar a exclusão de Match Day com confirmação explícita

Excluir um dia de jogo apaga times e estatísticas em cascata — operação destrutiva que exige fricção deliberada na UI.

## Objetivo

Implementar `MatchDayController@destroy` e o fluxo de confirmação na interface.

## Contexto

As FKs com `cascadeOnDelete` fazem a exclusão de um `MatchDay` remover automaticamente seus `teams`, `team_players` e `player_day_stats` (RN15). Isso é correto do ponto de vista de integridade, mas perigoso do ponto de vista de operação: o organizador precisa entender claramente o que será perdido. Importante: nesta fase, excluir um dia **não** reverte overall/estatísticas de temporada já consolidados — essa limitação deve ficar explícita na confirmação (a partir da Sprint 7, o comando `stats:rebuild` permite reprocessar).

## Pré-requisitos

- [passo2.md](passo2.md) e [passo4.md](passo4.md) concluídos.

## Arquivos que serão criados

- Nenhum.

## Arquivos que serão modificados

- `app/Http/Controllers/MatchDayController.php` — action `destroy`.
- `resources/js/pages/MatchDays/Index.tsx` e/ou `Show.tsx` — botão de exclusão com diálogo de confirmação.

## O que implementar

1. **`destroy(MatchDay $matchDay)`**: `delete()` do registro (a cascata do banco faz o resto); redirect para `match-days.index` com flash.
2. Diálogo de confirmação descrevendo as consequências: "Serão excluídos: N times e M registros de estatística deste dia. Esta ação não pode ser desfeita." — os números vêm das props já carregadas.
3. Exigir uma confirmação forte (ex.: botão desabilitado por alguns segundos, ou digitar a data do dia) para dias **que já possuem estatísticas lançadas**; confirmação simples para dias vazios.

## Regras de negócio envolvidas

- RN15 — cascata de exclusão com confirmação explícita obrigatória.

## Fluxo

```
Usuário clica "Excluir dia"
    ↓
Diálogo com consequências (contagens reais)
    ↓
Confirmação → DELETE /match-days/{id}
    ↓
Banco remove em cascata (teams, team_players, player_day_stats)
    ↓
Redirect match-days.index + flash
```

## Critérios de aceite

- ☐ Exclusão remove o dia e toda a cascata.
- ☐ Diálogo mostra contagens reais do que será perdido.
- ☐ Confirmação forte para dias com estatísticas.
- ☐ Flash de confirmação após a exclusão.

## Observações

- **Armadilha**: overall e (futuras) season stats **não** são revertidos pela exclusão — deixar isso escrito no diálogo para não criar expectativa falsa.
- **Boas práticas**: nunca implementar "excluir todos"; exclusão é sempre unitária.
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) (RN15), [../../09-Migrations.md](../../09-Migrations.md) (seção 3).

## Dependências

**Depende de:**
- [passo2.md](passo2.md)
- [passo4.md](passo4.md)

**Desbloqueia:**
- [passo7.md](passo7.md)
