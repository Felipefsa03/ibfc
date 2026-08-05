# 06 — Entidades

Este documento descreve cada entidade de domínio: sua responsabilidade, atributos, relacionamentos e ciclo de vida. O detalhamento de colunas em nível de banco está em [07-BancoDeDados.md](07-BancoDeDados.md); os relacionamentos com diagramas em [08-Relacionamentos.md](08-Relacionamentos.md).

---

## 1. Player (jogador)

**Responsabilidade**: representa um jogador cadastrado na associação, com seus atributos táticos e seu nível de habilidade (overall).

| Atributo | Tipo | Significado |
|---|---|---|
| `id` | bigint | Identificador único |
| `name` | string | Nome do jogador |
| `nickname` | string, nullable | Apelido usado no dia a dia |
| `gol` | int | Atributo de Goleiro |
| `sho` | int | Atributo de Chute (Shooting) |
| `pas` | int | Atributo de Passe |
| `dri` | int | Atributo de Drible |
| `def` | int | Atributo de Defesa |
| `phy` | int | Atributo Físico |
| `overall_base` | int | Overall calculado a partir dos 6 atributos, no cadastro/edição |
| `current_overall` | int | Overall atual, evolui com desempenho em campo |
| `active` | bool | Se o jogador está disponível para convocação |

**Relacionamentos**:
- `hasMany` `PlayerDayStat` — estatísticas por dia de jogo.
- `hasMany` `TeamPlayer` — vínculos com times ao longo dos Match Days.
- `hasOne` `PlayerSeasonStat` — resumo agregado de temporada.

**Ciclo de vida**: criado no cadastro → editado quando atributos mudam → `current_overall` atualizado automaticamente após cada Match Day em que participa → inativado (nunca excluído fisicamente se tiver histórico, ver RN03 em [02-RegrasDeNegocio.md](02-RegrasDeNegocio.md)).

---

## 2. MatchDay (dia de jogo)

**Responsabilidade**: representa um evento/encontro de futsal em uma data específica, com sua configuração (número de partidas, times, jogadores por time).

| Atributo | Tipo | Significado |
|---|---|---|
| `id` | bigint | Identificador único |
| `date` | date | Data do evento |
| `number_of_matches` | unsigned int | Quantas partidas serão jogadas no dia |
| `number_of_teams` | unsigned int | Quantos times serão formados |
| `players_per_team` | unsigned int | Tamanho de cada time |

**Relacionamentos**:
- `hasMany` `Team` — times formados naquele dia.
- `hasMany` `PlayerDayStat` — estatísticas de todos os jogadores naquele dia.

**Ciclo de vida**: criado pelo organizador → recebe a seleção de jogadores presentes → gera times (`Team` + `TeamPlayer`) → recebe registros de estatística (`PlayerDayStat`) → é "encerrado" (estado derivado: todas as estatísticas lançadas), disparando recálculo de overall e de `PlayerSeasonStat`.

---

## 3. Team (time)

**Responsabilidade**: representa um time formado dentro de um Match Day específico — não é um time "permanente", é reconstituído a cada dia de jogo.

| Atributo | Tipo | Significado |
|---|---|---|
| `id` | bigint | Identificador único |
| `match_day_id` | FK → match_days | A qual dia de jogo este time pertence |
| `name` | string | Nome/identificação do time (ex.: "Time A", "Coletes Azuis") |
| `score` | int | Placar acumulado do time no dia |
| `won` | bool | Se o time venceu |

**Relacionamentos**:
- `belongsTo` `MatchDay`.
- `hasMany` `TeamPlayer` — jogadores escalados.

**Ciclo de vida**: criado durante a geração automática de times → recebe jogadores via `TeamPlayer` → tem `score`/`won` atualizados conforme o resultado da partida → não é editável após o Match Day ser encerrado (RN07).

---

## 4. TeamPlayer (vínculo jogador ↔ time)

**Responsabilidade**: tabela pivô que resolve o relacionamento N:N entre `Team` e `Player` — "este jogador está escalado neste time".

| Atributo | Tipo | Significado |
|---|---|---|
| `id` | bigint | Identificador único |
| `team_id` | FK → teams | Time |
| `player_id` | FK → players | Jogador escalado |

**Relacionamentos**:
- `belongsTo` `Team`.
- `belongsTo` `Player`.

**Ciclo de vida**: criado em lote durante a geração de times → nunca editado individualmente → removido em cascata se o `Team` ou o `Player` for excluído. Único por par (`team_id`, `player_id`) — um jogador não pode aparecer duas vezes no mesmo time.

---

## 5. PlayerDayStat (estatística do jogador no dia)

**Responsabilidade**: registra o desempenho (gols e assistências) de um jogador em um Match Day específico.

| Atributo | Tipo | Significado |
|---|---|---|
| `id` | bigint | Identificador único |
| `match_day_id` | FK → match_days | Dia de jogo |
| `player_id` | FK → players | Jogador |
| `goals` | unsigned int | Gols marcados naquele dia |
| `assists` | unsigned int | Assistências dadas naquele dia |

**Relacionamentos**:
- `belongsTo` `MatchDay`.
- `belongsTo` `Player`.

**Ciclo de vida**: criado/atualizado conforme o organizador registra os eventos da partida → único por par (`match_day_id`, `player_id`) → ao ser finalizado (Match Day encerrado), dispara o recálculo de `Player.current_overall` e a atualização de `PlayerSeasonStat`. É a fonte primária de dados históricos — nunca deve ser sobrescrito ou apagado após o encerramento do dia.

---

## 6. PlayerSeasonStat (resumo agregado por jogador) — *a implementar*

**Responsabilidade**: mantém, por jogador, um resumo agregado de toda a temporada — evita recalcular somas sobre `PlayerDayStat` a cada consulta de ranking.

> Esta entidade ainda **não possui migration/model no código atual**. Está documentada aqui como parte do desenho do sistema e deve ser criada conforme o Roadmap ([19-Roadmap.md](19-Roadmap.md)).

| Atributo | Tipo | Significado |
|---|---|---|
| `id` | bigint | Identificador único |
| `player_id` | FK → players, unique | Jogador (um resumo por jogador) |
| `games` | unsigned int | Total de Match Days disputados |
| `wins` | unsigned int | Total de vitórias |
| `draws` | unsigned int | Total de empates |
| `losses` | unsigned int | Total de derrotas |
| `goals` | unsigned int | Total de gols na temporada |
| `assists` | unsigned int | Total de assistências na temporada |

**Relacionamentos**:
- `belongsTo` `Player` (inverso: `Player hasOne PlayerSeasonStat`).

**Ciclo de vida**: criado no primeiro Match Day em que o jogador participa (`updateOrCreate`) → incrementado a cada encerramento de Match Day subsequente → nunca editado manualmente pelo usuário, sempre derivado de `PlayerDayStat` + resultado do `Team`.
