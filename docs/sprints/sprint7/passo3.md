# Integrar a agregação de temporada ao encerramento do dia

O fechamento do Match Day passa a alimentar também as estatísticas de temporada — na mesma transação.

## Objetivo

Estender a operação de encerramento ([../sprint6/passo3.md](../sprint6/passo3.md)) para atualizar o `PlayerSeasonStat` de cada participante: `games`, `goals`, `assists` e `wins`/`draws`/`losses`.

## Contexto

RN13 exige que a tabela agregada seja atualizada junto do fechamento, **dentro da mesma transação** — nunca dessincronizada da fonte ([../../16-Estatisticas.md](../../16-Estatisticas.md), seção 9). O resultado individual (vitória/empate/derrota) deriva do time do jogador naquele dia: time com `won = true` → vitória para seus jogadores; nenhum time do dia com `won` → empate para todos; algum time venceu e o do jogador não → derrota (RN10 + RN13). Com essa segunda responsabilidade, a action `close` deve ser refatorada para um Service dedicado (ex.: `MatchDayCloserService`), como antecipado na Sprint 6.

## Pré-requisitos

- [passo2.md](passo2.md) concluído (Model pronto).
- [../sprint6/passo3.md](../sprint6/passo3.md) concluído (close existe).
- [../sprint5/passo4.md](../sprint5/passo4.md) concluído (resultado por time registrável).

## Arquivos que serão criados

- `app/Services/MatchDayCloserService.php` — orquestra o fechamento: recálculo de overall (delegando ao `OverallCalculatorService`) + agregação de temporada.

## Arquivos que serão modificados

- `app/Http/Controllers/MatchDayController.php` — `close` delega ao novo Service (action volta a ser fina).

## O que implementar

1. **`MatchDayCloserService`**: método público que recebe o `MatchDay` e, em transação: (a) recálculo de overall por escalado (lógica movida da action); (b) para cada escalado, `updateOrCreate` do `PlayerSeasonStat` incrementando `games` +1, somando `goals`/`assists` do day stat (0/0 se ausente) e incrementando `wins`/`draws`/`losses` conforme o resultado do time do jogador; (c) `closed_at = now()`.
2. Derivação do resultado individual conforme a regra descrita no Contexto (empate = nenhum vencedor no dia).
3. Manter os testes da Sprint 6 verdes após a refatoração (comportamento do close inalterado, apenas realocado).

## Regras de negócio envolvidas

- RN13 (agregação na mesma transação), RN10 (derivação de W/D/L a partir de `won`), RN08.

## Fluxo

```
close → MatchDayCloserService (DB::transaction)
    ├── por escalado: overall recalculado
    ├── por escalado: seasonStat updateOrCreate (games/goals/assists/W-D-L)
    └── closed_at = now()
```

## Critérios de aceite

- ☐ Fechamento cria/atualiza o resumo de todos os escalados.
- ☐ W/D/L corretos nos três cenários (vitória, derrota, empate do dia).
- ☐ Escalado sem estatística soma `games` +1 com 0 gols/assistências.
- ☐ Tudo na mesma transação (falha não deixa agregação parcial).
- ☐ Testes da Sprint 6 continuam verdes.

## Observações

- **Armadilha**: jogador **não** escalado não ganha `games` — iterar sobre escalações, não sobre a lista geral de jogadores.
- **Boas práticas**: a refatoração para Service é o momento de aplicar o critério da doc de arquitetura ([../../03-ArquiteturaMVC.md](../../03-ArquiteturaMVC.md), seção 6): regra multi-entidade não mora em Controller.
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) (RN13), [../../16-Estatisticas.md](../../16-Estatisticas.md) (seção 9).

## Dependências

**Depende de:**
- [passo2.md](passo2.md)
- [../sprint6/passo3.md](../sprint6/passo3.md)
- [../sprint5/passo4.md](../sprint5/passo4.md)

**Desbloqueia:**
- [passo4.md](passo4.md)
- [passo5.md](passo5.md)
