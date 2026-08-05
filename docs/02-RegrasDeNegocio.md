# 02 — Regras de Negócio

Este documento descreve, em detalhe, todas as regras de negócio do IBFC Team Builder. Cada regra é numerada (RN) para poder ser referenciada por outros documentos e por testes automatizados.

## 1. Jogadores (`Player`)

### RN01 — Cadastro de jogador
- `name` é obrigatório.
- `nickname` é opcional; quando informado, deve ser único entre jogadores ativos (evita dois "Formiga" na lista de convocação).
- Atributos táticos (`gol`, `sho`, `pas`, `dri`, `def`, `phy`) são números inteiros, faixa recomendada 0–99 (mesma escala de jogos de futebol conhecidos), com valor padrão 0.
- `overall_base` é calculado automaticamente a partir dos 6 atributos no momento do cadastro (ver [15-CalculoOverall.md](15-CalculoOverall.md)) — não é digitado livremente pelo usuário.
- `current_overall` inicia igual a `overall_base` e evolui com o tempo conforme desempenho em campo.
- `active` inicia `true`.

### RN02 — Edição de jogador
- Nome, apelido e os 6 atributos táticos podem ser editados a qualquer momento.
- Ao editar os atributos táticos, `overall_base` deve ser recalculado (o jogador está sendo reavaliado manualmente pelo organizador). `current_overall` **não** é resetado — a evolução conquistada em campo é preservada, apenas a base de cálculo muda.
- `current_overall` **não é editável diretamente** pelo usuário — só muda via recálculo automático (RN12).

### RN03 — "Exclusão" de jogador (inativação)
- Jogadores nunca são excluídos fisicamente do banco enquanto tiverem qualquer estatística associada (`player_day_stats`, `team_players`), pois isso apagaria histórico de partidas já ocorridas.
- A ação de "remover" um jogador da lista ativa apenas seta `active = false`.
- Jogadores inativos não aparecem na lista de seleção para novos Match Days, mas seu histórico permanece consultável.
- Exclusão física só é permitida (via ação administrativa explícita) para um jogador que nunca participou de nenhum Match Day — nesse caso não há histórico a preservar.

### RN04 — Duplicidade de jogador
- Antes de cadastrar, o sistema verifica se já existe um jogador ativo com o mesmo `nickname` (quando informado). Nomes iguais são permitidos (pessoas podem ter o mesmo nome), mas a combinação nome+apelido deve orientar o usuário a evitar duplicidade.

## 2. Dias de Jogo (`MatchDay`)

### RN05 — Criação de um Match Day
- Um Match Day é criado com `date`, `number_of_matches` (quantas partidas serão disputadas naquele dia), `number_of_teams` (quantos times serão formados) e `players_per_team` (tamanho de cada time).
- `number_of_teams` deve ser >= 2 (não há sentido em "gerar times" com um time só).
- Não há limite de Match Days por data — a associação pode ter mais de um encontro no mesmo dia (jogos em locais diferentes), cada um é um registro independente.

### RN06 — Seleção de jogadores presentes
- Antes de gerar os times, o organizador seleciona, dentre os jogadores **ativos**, quais estão presentes naquele Match Day.
- A quantidade de jogadores selecionados deve ser compatível com `number_of_teams * players_per_team` (ideal: igual; o algoritmo de balanceamento tolera sobras, ver [14-AlgoritmoDeBalanceamento.md](14-AlgoritmoDeBalanceamento.md)).

### RN07 — Geração de times
- A geração de times cria registros em `teams` (um por time, vinculado ao `match_day_id`) e em `team_players` (vínculo N:N entre `teams` e `players`).
- O algoritmo distribui os jogadores buscando equilibrar a soma/média de `current_overall` entre os times (detalhes em [14-AlgoritmoDeBalanceamento.md](14-AlgoritmoDeBalanceamento.md)).
- Times podem ser **regenerados** (nova distribuição) enquanto nenhuma estatística (`player_day_stats`) tiver sido lançada para aquele Match Day. Após o lançamento de estatísticas, os times ficam "travados" para preservar a integridade do histórico (não faz sentido mudar a escalação de uma partida já registrada).

### RN08 — Encerramento do Match Day
- Um Match Day é considerado "fechado" quando todas as estatísticas dos jogadores participantes foram lançadas.
- O fechamento dispara o recálculo de overall (RN12) e a atualização das estatísticas de temporada (RN13).

## 3. Estatísticas por dia (`PlayerDayStat`)

### RN09 — Registro de gols e assistências
- Cada jogador tem, no máximo, **um único registro de estatística por Match Day** (garantido pelo unique composto `match_day_id + player_id`). Se o jogador jogou mais de uma partida no mesmo dia, os gols/assistências são somados nesse único registro.
- `goals` e `assists` são contadores inteiros não-negativos, iniciando em 0 e incrementados conforme o organizador registra os eventos da partida.
- Só é possível registrar estatística para jogadores que efetivamente compõem algum time daquele Match Day (`team_players`).

### RN10 — Times e placar
- Cada `Team` tem um `score` (placar acumulado no dia) e uma flag `won` (indicando se aquele time venceu a partida/o dia).
- O `won` é definido manualmente pelo organizador ou automaticamente comparando `score` entre os times do mesmo Match Day, dependendo da fase de implementação (ver Roadmap, [19-Roadmap.md](19-Roadmap.md)).

## 4. Overall e evolução

### RN11 — Cálculo do overall base
- Ver fórmula completa em [15-CalculoOverall.md](15-CalculoOverall.md). Resumo: `overall_base` é a média ponderada dos 6 atributos táticos.

### RN12 — Recálculo do overall atual
- Disparado ao fechar um Match Day (RN08).
- `current_overall` do jogador é ajustado com base nos gols e assistências daquele dia, com crescimento marginal decrescente e um teto máximo em relação ao `overall_base`, para evitar que um jogador se torne artificialmente muito mais forte que os demais (detalhes matemáticos em [15-CalculoOverall.md](15-CalculoOverall.md)).
- Jogadores que não participaram do Match Day não sofrem alteração de overall.

## 5. Estatísticas de temporada (`PlayerSeasonStat`)

### RN13 — Atualização do resumo agregado
- Sempre que um `PlayerDayStat` é criado ou atualizado (fechamento de um Match Day), o resumo em `player_season_stats` daquele jogador deve ser recalculado: `games` (+1 por Match Day disputado), `goals` e `assists` (soma acumulada), `wins`/`draws`/`losses` (com base no resultado do time do jogador naquele dia).
- Esta tabela existe para que os rankings (RN14) sejam consultas simples e rápidas, sem precisar agregar `player_day_stats` toda vez.

### RN14 — Cálculo de ranking
- **Ranking de artilharia**: jogadores ordenados por `player_season_stats.goals` decrescente.
- **Ranking de assistências**: ordenados por `player_season_stats.assists` decrescente.
- **Ranking de participação**: ordenados por `player_season_stats.games` decrescente.
- Em caso de empate, critério de desempate sugerido: menor número de jogos disputados (eficiência) e, em último caso, ordem alfabética do nome.

## 6. Regras gerais de integridade

### RN15 — Cascata de exclusão
- Excluir um `MatchDay` remove em cascata seus `teams` e `player_day_stats` (proteção via `cascadeOnDelete` nas migrations — ver [09-Migrations.md](09-Migrations.md)). Essa é uma operação destrutiva e deve exigir confirmação explícita na interface.
- Excluir um `Team` remove em cascata seus `team_players`.
- Excluir um `Player` só é permitido quando ele não possuir nenhum vínculo em `team_players` ou `player_day_stats` (ver RN03).
