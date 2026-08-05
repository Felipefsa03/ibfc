# Criar a tela de detalhe do Match Day (show + Show.tsx)

A página central do dia de jogo — onde times serão exibidos e estatísticas lançadas nas próximas sprints.

## Objetivo

Implementar `MatchDayController@show` e criar `resources/js/pages/MatchDays/Show.tsx` como esqueleto do detalhe do dia.

## Contexto

O `Show` do Match Day é a tela mais rica do sistema e será construída em camadas ao longo das Sprints 3–6: nesta sprint, exibe a configuração do dia e as áreas reservadas ("Times ainda não gerados", "Sem estatísticas"); na Sprint 4 ganha os times; na Sprint 5, o lançamento de estatísticas; na Sprint 6, o botão de encerramento. Nascer como esqueleto bem estruturado evita retrabalho.

## Pré-requisitos

- [passo2.md](passo2.md) concluído.

## Arquivos que serão criados

- `resources/js/pages/MatchDays/Show.tsx`

## Arquivos que serão modificados

- `app/Http/Controllers/MatchDayController.php` — action `show`.

## O que implementar

1. **`show(MatchDay $matchDay)`**: carregar o dia com `teams.teamPlayers.player` e `playerDayStats` (eager loading completo — a tela usará tudo); `Inertia::render('MatchDays/Show', ...)`.
2. **`Show.tsx`**: cabeçalho com data e formato do dia; seção "Times" (estado vazio: "Times ainda não gerados" + área onde o botão de geração entrará na Sprint 4); seção "Estatísticas" (estado vazio equivalente); navegação de volta ao histórico.
3. Estrutura de props tipada já prevendo `teams` e `playerDayStats` (arrays vazios por ora).

## Regras de negócio envolvidas

- Nenhuma RN executada ainda — a tela materializa o ciclo de vida do MatchDay descrito em [../../06-Entidades.md](../../06-Entidades.md).

## Fluxo

```
GET /match-days/{matchDay}
    ↓
MatchDayController@show (eager loading)
    ↓
Inertia props { matchDay, teams, playerDayStats }
    ↓
MatchDays/Show.tsx (esqueleto com estados vazios)
```

## Critérios de aceite

- ☐ Detalhe abre a partir do histórico e após criar um dia.
- ☐ Eager loading sem N+1.
- ☐ Estados vazios das seções Times e Estatísticas presentes.
- ☐ Tipos TS das props definidos (mesmo com arrays vazios).
- ☐ Build limpo.

## Observações

- **Boas práticas**: mesmo vazio, tipar `teams` como o shape final (com jogadores aninhados) — as Sprints 4/5 só preencherão dados, sem quebrar contrato.
- Referências: [../../13-Views.md](../../13-Views.md), [../../08-Relacionamentos.md](../../08-Relacionamentos.md) (seção 3 — queries encadeadas).

## Dependências

**Depende de:**
- [passo2.md](passo2.md)

**Desbloqueia:**
- [passo5.md](passo5.md)
- [passo6.md](passo6.md)
- [../sprint4/passo6.md](../sprint4/passo6.md)
- [../sprint5/passo3.md](../sprint5/passo3.md)
