# 11 — Controllers

## 1. Convenção geral

Controllers seguem o padrão REST resourceful do Laravel (`index`, `create`, `store`, `edit`, `update`, `destroy`) sempre que a entidade tiver CRUD completo. Para ações que não se encaixam no CRUD padrão (ex.: "gerar times"), usa-se um Controller/método dedicado nomeado pela ação.

Todo Controller:
1. Recebe dados já validados (via Form Request injetado por type-hint).
2. Chama o Model ou Service responsável.
3. Retorna `Inertia::render(...)` ou um `redirect()`.

Nenhum Controller deve conter lógica de negócio complexa embutida — isso é delegado a Services (ver [03-ArquiteturaMVC.md](03-ArquiteturaMVC.md)).

## 2. PlayerController

| Método | Responsabilidade |
|---|---|
| `index()` | Lista jogadores (com filtro ativo/inativo e busca), `Inertia::render('Players/Index', [...])`. |
| `create()` | Exibe formulário de novo jogador, `Inertia::render('Players/Create')`. |
| `store(StorePlayerRequest $request)` | Calcula `overall_base`, cria o `Player`, redireciona para `index`. |
| `edit(Player $player)` | Exibe formulário de edição, `Inertia::render('Players/Edit', ['player' => $player])`. |
| `update(UpdatePlayerRequest $request, Player $player)` | Atualiza dados; se atributos táticos mudaram, recalcula `overall_base` (RN02). |
| `destroy(Player $player)` | Inativa (`active = false`) por padrão; exclusão física apenas se o jogador não tiver histórico (RN03). |

## 3. MatchDayController

| Método | Responsabilidade |
|---|---|
| `index()` | Lista Match Days (histórico), `Inertia::render('MatchDays/Index', [...])`. |
| `create()` | Formulário de novo Match Day + lista de jogadores ativos para seleção. |
| `store(StoreMatchDayRequest $request)` | Cria o `MatchDay`. |
| `show(MatchDay $matchDay)` | Exibe detalhes: times formados, estatísticas lançadas. `Inertia::render('MatchDays/Show', [...])`. |
| `destroy(MatchDay $matchDay)` | Exclui o Match Day (cascata para `teams`/`player_day_stats`), exige confirmação explícita na UI (RN15). |

## 4. TeamController

| Método | Responsabilidade |
|---|---|
| `store(GenerateTeamsRequest $request, MatchDay $matchDay)` | Recebe os jogadores selecionados, chama `TeamBalancerService::generate()`, persiste `Team`+`TeamPlayer` em transação, redireciona para `MatchDays/Show`. |
| `update(GenerateTeamsRequest $request, MatchDay $matchDay)` | Regenera os times (nova tentativa de balanceamento) — permitido apenas se nenhuma estatística já tiver sido lançada (RN07). |

## 5. PlayerDayStatController (ou método dentro de MatchDayController)

| Método | Responsabilidade |
|---|---|
| `update(StorePlayerDayStatRequest $request, MatchDay $matchDay, Player $player)` | `updateOrCreate` do registro de gols/assistências daquele jogador no dia. |
| `close(MatchDay $matchDay)` (ação dedicada) | Marca o Match Day como encerrado, dispara `OverallCalculatorService` e atualização de `PlayerSeasonStat` para todos os participantes, dentro de uma transação. |

## 6. StatsController

| Método | Responsabilidade |
|---|---|
| `index()` | Consulta `player_season_stats` ordenado por gols/assistências/jogos, `Inertia::render('Stats/Index', ['ranking' => ...])`. |

## 7. O que NÃO fazer em um Controller

- Não escrever queries SQL cruas — usar Eloquent/Query Builder.
- Não implementar o algoritmo de balanceamento ou a fórmula de overall diretamente no método do Controller — delegar ao Service correspondente.
- Não validar manualmente (`$request->validate([...])` inline) quando a regra é reutilizável ou não-trivial — usar Form Request dedicado.
- Não retornar Models diretamente sem passar por um array/Resource explícito quando exposto ao frontend (evita vazar colunas internas sem querer).
