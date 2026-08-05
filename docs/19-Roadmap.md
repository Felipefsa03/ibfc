# 19 — Roadmap

O desenvolvimento é dividido em **8 sprints**. Cada sprint entrega uma fatia funcional completa (backend + frontend + testes), seguindo a arquitetura descrita nos documentos anteriores.

> **Detalhamento passo a passo**: cada sprint está quebrada em tarefas pequenas e sequenciais em [`docs/sprints/`](sprints/README.md) — um arquivo `passoN.md` por tarefa, com objetivo, arquivos envolvidos, regras de negócio, critérios de aceite e dependências. Este Roadmap é a visão macro; os passos são o roteiro executável.

## Sprint 1 — Infraestrutura e Base de Dados

**Objetivo**: ambiente pronto para desenvolver: banco MySQL migrado, autenticação funcional, dados de exemplo e layout base.

**Entregáveis**:
- `.env`/`.env.example` configurados para MySQL; schema criado.
- Migrations existentes revisadas e aplicadas (`players`, `match_days`, `teams`, `team_players`, `player_day_stats`).
- **Cleanup**: migration de ajuste removendo os `timestamps()` órfãos de `team_players` (inconsistência documentada em [07-BancoDeDados.md](07-BancoDeDados.md)).
- Autenticação Breeze verificada/completada (RF14); usuário admin via seeder.
- `PlayerFactory` (com estados `inactive`/`goalkeeper`), `MatchDayFactory`, `TeamFactory`.
- Seeder de ~20 jogadores de demonstração.
- `AppLayout.tsx` com navegação base.

**Critério de pronto**: `php artisan migrate:fresh --seed` funciona do zero; login/logout operacionais; layout renderizando.

---

## Sprint 2 — Cadastro de Jogadores

**Objetivo**: CRUD completo de jogadores com overall base calculado automaticamente.

**Entregáveis**:
- `StorePlayerRequest` / `UpdatePlayerRequest` (RN01/RN02/RN04).
- `OverallCalculatorService` (parte 1: cálculo do `overall_base`, [15-CalculoOverall.md](15-CalculoOverall.md) §2) + testes unitários.
- `PlayerController` completo + rotas `players.*` + scope `Player::active()`.
- Páginas `Players/{Index,Create,Edit}.tsx` + componente `PlayerForm.tsx`.
- Remoção inteligente: inativação quando há histórico, exclusão física quando não há (RN03).
- Testes Feature do CRUD.

**Critério de pronto**: administrador cadastra, edita e remove (inativa) jogadores via interface, com validação e overall calculado corretamente; suíte verde.

---

## Sprint 3 — Dias de Jogo

**Objetivo**: criar e gerenciar Match Days, com seleção de jogadores presentes.

**Entregáveis**:
- `StoreMatchDayRequest` (RN05: mínimo 2 times).
- `MatchDayController` (`index`, `create`, `store`, `show`, `destroy`) + rotas.
- Páginas `MatchDays/{Index,Create,Show}.tsx` (Show como esqueleto evolutivo).
- `PlayerSelectionList.tsx` — seleção de presentes com avisos de quantidade (RN06).
- Exclusão com confirmação explícita e contagens do que será perdido (RN15).
- Testes Feature (incluindo cascata de exclusão).

**Critério de pronto**: administrador cria um dia, vê o histórico e seleciona presentes; exclusão em cascata testada.

---

## Sprint 4 — Times e Balanceamento

**Objetivo**: gerar times equilibrados automaticamente a partir dos presentes.

**Entregáveis**:
- `TeamBalancerService` implementando [14-AlgoritmoDeBalanceamento.md](14-AlgoritmoDeBalanceamento.md) em 3 etapas: goleiros round-robin, draft serpentina, troca fina.
- Bateria de testes unitários (casos especiais: goleiros a mais/menos, sobras, empates).
- `GenerateTeamsRequest` + `TeamController@store` (persistência em transação) e `@update` (regeneração com variação aleatória entre empates).
- Bloqueio de regeneração após estatísticas lançadas (RN07).
- `TeamCard.tsx`/`PlayerCard.tsx` + exibição de força total e diferença entre times.
- Testes Feature.

**Critério de pronto**: times gerados e regeneráveis via interface, com equilíbrio verificado por teste.

---

## Sprint 5 — Estatísticas do Dia

**Objetivo**: registrar o desempenho em campo.

**Entregáveis**:
- `StorePlayerDayStatRequest` (valores ≥ 0; apenas escalados do dia — RN09).
- `PlayerDayStatController@update` com `updateOrCreate` (um registro por jogador/dia).
- UI de lançamento mobile-first (`StatCounter.tsx`) na tela do Match Day.
- Registro de placar e vencedor por time (`UpdateTeamResultRequest`, RN10).
- Testes Feature.

**Critério de pronto**: gols/assistências e resultados lançáveis pelo celular, sem duplicação de registros.

---

## Sprint 6 — Evolução do Overall

**Objetivo**: consolidar o dia — recálculo automático de overall e imutabilidade do histórico.

**Entregáveis**:
- `OverallCalculatorService` (parte 2: evolução com retorno decrescente e tetos, [15-CalculoOverall.md](15-CalculoOverall.md) §3) + testes unitários com os exemplos numéricos da doc.
- Migration `closed_at` em `match_days` + `MatchDayController@close` (recálculo em transação — RN08/RN12).
- Travas pós-encerramento: estatísticas, resultados e regeneração bloqueados (backend + UI em modo leitura).
- Testes Feature do encerramento.

**Critério de pronto**: encerrar um dia recalcula o overall dos participantes e congela o dia; travas testadas.

---

## Sprint 7 — Temporada e Rankings

**Objetivo**: histórico agregado e rankings consultáveis.

**Entregáveis**:
- Migration `create_player_season_stats_table` ([09-Migrations.md](09-Migrations.md) §4) + Model `PlayerSeasonStat` (+ `Player::seasonStat()` e accessors de médias).
- `MatchDayCloserService` — fechamento passa a agregar `games/goals/assists/wins/draws/losses` na mesma transação (RN13; W/D/L derivados de `teams.won`).
- Comando `stats:rebuild` (reprocessamento a partir da fonte primária).
- `StatsController@index` + página `Stats/Index.tsx` (4 rankings com desempates da RN14).
- Testes de acumulação multi-dia, rankings e rebuild.

**Critério de pronto**: rankings corretos após múltiplos dias encerrados; rebuild reproduz o estado consolidado.

---

## Sprint 8 — Refatoração e Melhorias

**Objetivo**: polimento final e auditoria de conformidade.

**Entregáveis**:
- Revisão de responsividade mobile em todo o fluxo (RNF02).
- Estados vazios e feedback padronizados (`EmptyState.tsx`, `FlashMessages.tsx`).
- Passe de qualidade: Pint, Larastan zero erros, caça a N+1 com `preventLazyLoading`.
- Matriz de rastreabilidade RN01–RN15 / RF01–RF14 × implementação × testes; lacunas preenchidas.
- Teste de aceitação manual do fluxo completo ([18-FluxoCompleto.md](18-FluxoCompleto.md)).

**Critério de pronto**: sistema completo, auditado e sem inconsistências conhecidas em aberto.
