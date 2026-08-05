# Travar o Match Day encerrado (imutabilidade do histórico)

Depois de encerrado, o dia é história: nada nele pode mudar.

## Objetivo

Bloquear, no backend, toda operação de escrita sobre um Match Day com `closed_at` preenchido: lançamento/edição de estatísticas, resultado de times e regeneração de times.

## Contexto

O encerramento consolidou overall (e, na Sprint 7, season stats) a partir dos dados do dia. Alterar qualquer dado depois deixaria as consolidações dessincronizadas da fonte (RN08; imutabilidade do `PlayerDayStat` pós-fechamento, [../../06-Entidades.md](../../06-Entidades.md)). Os pontos de extensão deixados nas Sprints 4–5 são fechados agora. A exclusão do dia inteiro permanece permitida (RN15 — com sua confirmação forte), pois remove a história por completo em vez de corrompê-la.

## Pré-requisitos

- [passo3.md](passo3.md) concluído (`closed_at` existe).

## Arquivos que serão criados

- Nenhum. (Se a checagem se repetir em 3+ pontos, avaliar um Form Request base ou uma verificação centralizada no Model — decidir na implementação e documentar no PR.)

## Arquivos que serão modificados

- `app/Http/Controllers/PlayerDayStatController.php` — rejeitar `update` em dia encerrado.
- `app/Http/Controllers/TeamController.php` — rejeitar `updateResult` e `update` (regeneração) em dia encerrado.
- `resources/js/pages/MatchDays/Show.tsx` — em dia encerrado, esconder/desabilitar contadores, edição de placar e botões de geração; exibir tudo como leitura.

## O que implementar

1. Checagem `isClosed()` no início de cada action de escrita listada, retornando erro claro ("Este dia já foi encerrado e não pode ser alterado").
2. UI em modo leitura para dias encerrados (a tela vira o "registro histórico" do dia).
3. Garantir que a regeneração já bloqueada por estatísticas (Sprint 4) também bloqueie por encerramento (as duas travas coexistem).

## Regras de negócio envolvidas

- RN07 (times travados), RN08 (dia fechado), imutabilidade da fonte histórica ([../../16-Estatisticas.md](../../16-Estatisticas.md), seção 1).

## Fluxo

```
Qualquer PUT/POST de escrita no dia
    ↓
matchDay.isClosed()?
    ├── SIM → 4xx / redirect com erro (nada muda)
    └── NÃO → fluxo normal
```

## Critérios de aceite

- ☐ Lançamento de estatística em dia encerrado rejeitado (backend).
- ☐ Resultado de time em dia encerrado rejeitado.
- ☐ Regeneração em dia encerrado rejeitada.
- ☐ UI em modo leitura para dias encerrados.
- ☐ Exclusão do dia continua possível (com confirmação forte).

## Observações

- **Armadilha**: a trava é do **backend**; a UI em modo leitura é cortesia. Testar as três rotas com requests diretos.
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) (RN07/RN08), [../../06-Entidades.md](../../06-Entidades.md).

## Dependências

**Depende de:**
- [passo3.md](passo3.md)

**Desbloqueia:**
- [passo5.md](passo5.md)
