# Implementar o encerramento do Match Day (close)

O momento de consolidação: o dia fecha e o overall de todos os participantes é recalculado de uma vez, em transação.

## Objetivo

Criar a action `MatchDayController@close` (rota `POST match-days/{matchDay}/close`) que marca o dia como encerrado e recalcula o `current_overall` de todos os participantes.

## Contexto

O recálculo roda **uma única vez por dia**, no encerramento (RN08/RN12) — nunca a cada lançamento individual. Como a tabela `match_days` não tem coluna de estado, este passo **adiciona a coluna `closed_at`** (nullable timestamp) via nova migration: `NULL` = dia aberto; preenchida = encerrado. Essa é a materialização do estado "fechado" descrito no ciclo de vida da entidade ([../../06-Entidades.md](../../06-Entidades.md)). Toda a operação (marcar fechado + recalcular N jogadores) ocorre em uma transação; na Sprint 7, a mesma transação ganhará a atualização das season stats.

## Pré-requisitos

- [passo1.md](passo1.md) e [passo2.md](passo2.md) concluídos (fórmula pronta e testada).
- [../sprint5/passo2.md](../sprint5/passo2.md) concluído (estatísticas lançáveis).

## Arquivos que serão criados

- `database/migrations/<timestamp>_add_closed_at_to_match_days_table.php`

## Arquivos que serão modificados

- `app/Models/MatchDay.php` — `closed_at` no `$casts` (datetime) e um helper de leitura (ex.: `isClosed()`).
- `app/Http/Controllers/MatchDayController.php` — action `close`.
- `routes/web.php` — rota `match-days.close`.
- `resources/js/pages/MatchDays/Show.tsx` — botão "Encerrar dia" (com confirmação descrevendo o efeito) e badge de "Encerrado".

## O que implementar

1. Migration da coluna `closed_at` (nullable, sem default).
2. **`close(MatchDay $matchDay)`**: rejeitar se já encerrado; exigir ao menos um `PlayerDayStat` lançado (encerrar dia sem nenhuma estatística é suspeito — confirmar intenção via validação); em `DB::transaction`: para cada participante (escalados do dia), buscar seu day stat (ausente = 0/0), chamar `OverallCalculatorService::recalculate` e atualizar o `Player`; por fim gravar `closed_at = now()`.
3. Confirmação na UI explicando: "O overall dos participantes será recalculado. Após encerrar, times e estatísticas não poderão mais ser alterados."

## Regras de negócio envolvidas

- RN08 (encerramento dispara consolidação), RN12 (recálculo por participante; ausentes não mudam).

## Fluxo

```
POST /match-days/{id}/close
    ↓
já encerrado? → rejeita
    ↓
DB::transaction:
    para cada jogador escalado:
        dayStat (ou 0/0) → recalculate → player.current_overall
    matchDay.closed_at = now()
    ↓
Redirect show + flash "Dia encerrado"
```

## Critérios de aceite

- ☐ Migration aplicada; `closed_at` funcional.
- ☐ Encerramento recalcula todos os escalados (inclusive quem não pontuou — sem mudança).
- ☐ Jogadores não escalados no dia intocados.
- ☐ Encerrar duas vezes é rejeitado.
- ☐ Transação: falha no meio não deixa recálculo parcial.
- ☐ Badge "Encerrado" na tela.

## Observações

- **Armadilha**: iterar sobre os **escalados** (`team_players` do dia), não sobre os day stats — participante sem estatística lançada também "jogou" (bônus 0, overall mantido), e conta como jogo na Sprint 7.
- **Boas práticas**: a action deve permanecer orquestração fina; se crescer, extrair um `MatchDayCloserService` — a Sprint 7 provavelmente justificará isso ao adicionar as season stats.
- Referências: [../../15-CalculoOverall.md](../../15-CalculoOverall.md) (seção 5), [../../05-FluxoDaAplicacao.md](../../05-FluxoDaAplicacao.md) (fluxo 5).

## Dependências

**Depende de:**
- [passo1.md](passo1.md)
- [passo2.md](passo2.md)
- [../sprint5/passo2.md](../sprint5/passo2.md)

**Desbloqueia:**
- [passo4.md](passo4.md)
- [../sprint7/passo3.md](../sprint7/passo3.md)
