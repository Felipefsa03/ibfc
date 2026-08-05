# 07 — Banco de Dados

Banco de dados alvo: **MySQL** (conforme `.env` atual do projeto e requisito original). A suíte de testes (Pest/PHPUnit) normalmente roda contra SQLite em memória para velocidade — isso é uma prática comum do Laravel e não afeta o schema, que é definido pelas migrations.

> Todas as tabelas abaixo, exceto `player_season_stats`, já possuem migration criada no projeto (`database/migrations/2026_07_30_*`). `player_season_stats` é uma tabela **proposta**, ainda sem migration — ver [09-Migrations.md](09-Migrations.md) e [19-Roadmap.md](19-Roadmap.md).

## 1. Tabela `players`

| Coluna | Tipo | Nulo | Default | Índice | Por que existe |
|---|---|---|---|---|---|
| `id` | bigint unsigned (PK) | não | auto_increment | PK | Identificador único |
| `name` | varchar | não | — | index | Nome do jogador; indexado para busca/listagem por nome |
| `nickname` | varchar | sim | null | index | Apelido; indexado pois é usado para busca rápida e checagem de duplicidade |
| `gol` | int | não | 0 | — | Atributo de Goleiro, usado no cálculo do overall |
| `sho` | int | não | 0 | — | Atributo de Chute |
| `pas` | int | não | 0 | — | Atributo de Passe |
| `dri` | int | não | 0 | — | Atributo de Drible |
| `def` | int | não | 0 | — | Atributo de Defesa |
| `phy` | int | não | 0 | — | Atributo Físico |
| `overall_base` | int | não | 0 | — | Overall calculado a partir dos 6 atributos |
| `current_overall` | int | não | 0 | — | Overall vigente, evolui com desempenho |
| `active` | boolean | não | true | index | Filtra jogadores disponíveis para convocação; indexado pois é usado em quase toda listagem |
| `created_at` / `updated_at` | timestamp | sim | null | — | Auditoria padrão do Laravel |

## 2. Tabela `match_days`

| Coluna | Tipo | Nulo | Default | Índice | Por que existe |
|---|---|---|---|---|---|
| `id` | bigint unsigned (PK) | não | auto_increment | PK | Identificador único |
| `date` | date | não | — | index | Data do evento; indexada para ordenação/filtragem de histórico |
| `number_of_matches` | unsigned int | não | 0 | — | Quantidade de partidas do dia |
| `number_of_teams` | unsigned int | não | 0 | — | Quantidade de times a formar |
| `players_per_team` | unsigned int | não | 0 | — | Tamanho de cada time, usado pelo algoritmo de balanceamento |
| `created_at` / `updated_at` | timestamp | sim | null | — | Auditoria padrão |

## 3. Tabela `teams`

| Coluna | Tipo | Nulo | Default | Índice | Por que existe |
|---|---|---|---|---|---|
| `id` | bigint unsigned (PK) | não | auto_increment | PK | Identificador único |
| `match_day_id` | bigint unsigned (FK → match_days.id) | não | — | index | Vincula o time ao dia de jogo; `cascadeOnDelete` |
| `name` | varchar | não | — | — | Nome/identificação do time |
| `score` | int | não | 0 | — | Placar acumulado do time no dia |
| `won` | boolean | não | false | — | Indica se o time venceu, usado no cálculo de `player_season_stats.wins/draws/losses` |
| `created_at` / `updated_at` | timestamp | sim | null | — | Auditoria padrão |

## 4. Tabela `team_players` (pivô Team ↔ Player)

| Coluna | Tipo | Nulo | Default | Índice | Por que existe |
|---|---|---|---|---|---|
| `id` | bigint unsigned (PK) | não | auto_increment | PK | Identificador único |
| `team_id` | bigint unsigned (FK → teams.id) | não | — | — | Time ao qual o jogador foi escalado; `cascadeOnDelete` |
| `player_id` | bigint unsigned (FK → players.id) | não | — | — | Jogador escalado; `cascadeOnDelete` |
| `created_at` / `updated_at` | timestamp | sim | null | — | Ver observação abaixo |
| — | — | — | — | unique(`team_id`, `player_id`) | Evita escalar o mesmo jogador duas vezes no mesmo time |

> **Inconsistência conhecida**: a migration cria as colunas `created_at`/`updated_at` (via `$table->timestamps()`), mas o Model `TeamPlayer` define `public $timestamps = false`, então essas colunas nunca são preenchidas pelo Eloquent. Isso já está sinalizado com um comentário na própria migration. **Ação recomendada** (registrada no Roadmap, [19-Roadmap.md](19-Roadmap.md)): decidir entre (a) remover `timestamps()` da migration em uma nova migration de ajuste, ou (b) remover `$timestamps = false` do Model, e manter as duas pontas consistentes.

## 5. Tabela `player_day_stats`

| Coluna | Tipo | Nulo | Default | Índice | Por que existe |
|---|---|---|---|---|---|
| `id` | bigint unsigned (PK) | não | auto_increment | PK | Identificador único |
| `match_day_id` | bigint unsigned (FK → match_days.id) | não | — | — | Dia de jogo a que a estatística se refere; `cascadeOnDelete` |
| `player_id` | bigint unsigned (FK → players.id) | não | — | — | Jogador; `cascadeOnDelete` |
| `goals` | unsigned int | não | 0 | — | Gols marcados no dia |
| `assists` | unsigned int | não | 0 | — | Assistências dadas no dia |
| `created_at` / `updated_at` | timestamp | sim | null | — | Auditoria padrão |
| — | — | — | — | unique(`match_day_id`, `player_id`) | Garante um único registro de estatística por jogador por dia |

## 6. Tabela `player_season_stats` — *proposta, sem migration ainda*

| Coluna | Tipo | Nulo | Default | Índice | Por que existe |
|---|---|---|---|---|---|
| `id` | bigint unsigned (PK) | não | auto_increment | PK | Identificador único |
| `player_id` | bigint unsigned (FK → players.id) | não | — | unique | Um único resumo por jogador; `cascadeOnDelete` |
| `games` | unsigned int | não | 0 | — | Total de Match Days disputados |
| `wins` | unsigned int | não | 0 | — | Total de vitórias |
| `draws` | unsigned int | não | 0 | — | Total de empates |
| `losses` | unsigned int | não | 0 | — | Total de derrotas |
| `goals` | unsigned int | não | 0 | — | Total de gols na temporada |
| `assists` | unsigned int | não | 0 | — | Total de assistências na temporada |
| `created_at` / `updated_at` | timestamp | sim | null | — | Auditoria padrão |

Esta tabela existe para tornar os rankings (RN14, [16-Estatisticas.md](16-Estatisticas.md)) consultas simples de `ORDER BY`, em vez de agregações (`SUM`/`COUNT`) repetidas sobre `player_day_stats` a cada requisição.

## 7. Observação sobre ambiente de banco

- `.env` atual do projeto: `DB_CONNECTION=mysql`.
- `.env.example`: `DB_CONNECTION=sqlite` (padrão do starter kit Laravel, prático para rodar `php artisan serve` sem precisar subir um MySQL local).
- Recomendação: manter MySQL como banco de desenvolvimento/produção (conforme requisito original do projeto) e usar SQLite em memória apenas na configuração de testes (`phpunit.xml`), que é o padrão do Laravel e não requer nenhuma mudança de schema — as migrations rodam identicamente em ambos.
