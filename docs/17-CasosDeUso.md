# 17 — Casos de Uso

## Ator

Nesta fase do produto existe um único ator: **Administrador** (o organizador da associação IBFC, autenticado via Breeze). Não há distinção de perfis (ex.: jogador comum com acesso próprio) — todos os casos de uso abaixo pressupõem um usuário autenticado.

---

## UC01 — Cadastrar jogador

- **Ator**: Administrador
- **Pré-condição**: usuário autenticado.
- **Fluxo principal**:
  1. Administrador acessa "Novo Jogador".
  2. Informa nome, apelido (opcional) e os 6 atributos táticos.
  3. Submete o formulário.
  4. Sistema calcula `overall_base`, cria o jogador com `active = true` e `current_overall = overall_base`.
  5. Sistema redireciona para a lista de jogadores com mensagem de sucesso.
- **Fluxo alternativo**: nome em branco ou apelido duplicado → sistema exibe erros de validação sem salvar (RN01/RN04).

## UC02 — Editar jogador

- **Ator**: Administrador
- **Pré-condição**: jogador existente.
- **Fluxo principal**:
  1. Administrador abre um jogador na lista.
  2. Altera nome/apelido/atributos.
  3. Submete.
  4. Sistema recalcula `overall_base` se atributos mudaram (RN02), preserva `current_overall`.
- **Fluxo alternativo**: dados inválidos → erros de validação exibidos.

## UC03 — Inativar/excluir jogador

- **Ator**: Administrador
- **Pré-condição**: jogador existente.
- **Fluxo principal**:
  1. Administrador solicita remoção do jogador.
  2. Sistema verifica se o jogador possui histórico (`team_players`/`player_day_stats`).
  3. Se possui: marca `active = false` (RN03), preservando o histórico.
  4. Se não possui: exclui fisicamente o registro.
- **Fluxo alternativo**: nenhum — a decisão entre inativar/excluir é automática, baseada na existência de histórico.

## UC04 — Criar Match Day

- **Ator**: Administrador
- **Pré-condição**: usuário autenticado.
- **Fluxo principal**:
  1. Administrador informa data, número de partidas, número de times, jogadores por time.
  2. Sistema cria o `MatchDay`.
  3. Sistema exibe a lista de jogadores ativos para seleção dos presentes.
- **Fluxo alternativo**: `number_of_teams < 2` → validação impede o cadastro (RN05).

## UC05 — Gerar times

- **Ator**: Administrador
- **Pré-condição**: Match Day criado, jogadores presentes selecionados.
- **Fluxo principal**:
  1. Administrador confirma a lista de jogadores presentes.
  2. Sistema executa o algoritmo de balanceamento ([14-AlgoritmoDeBalanceamento.md](14-AlgoritmoDeBalanceamento.md)).
  3. Sistema cria os registros de `Team` e `TeamPlayer` em transação.
  4. Sistema exibe os times formados.
- **Fluxo alternativo — regenerar**: Administrador solicita nova geração antes de qualquer estatística ser lançada → sistema descarta os times anteriores e repete o processo (RN07).
- **Fluxo de erro**: tentativa de regenerar times após estatísticas já lançadas → sistema bloqueia a ação com mensagem explicativa.

## UC06 — Registrar estatísticas do dia

- **Ator**: Administrador
- **Pré-condição**: times gerados para o Match Day.
- **Fluxo principal**:
  1. Administrador informa gols e assistências de cada jogador participante.
  2. Sistema grava/atualiza os registros em `player_day_stats` (`updateOrCreate`, respeitando unicidade por jogador/dia — RN09).
- **Fluxo alternativo**: valores negativos → validação bloqueia (RN09).

## UC07 — Encerrar Match Day

- **Ator**: Administrador
- **Pré-condição**: estatísticas de todos os participantes lançadas.
- **Fluxo principal**:
  1. Administrador confirma o encerramento do dia.
  2. Sistema recalcula `current_overall` de cada participante ([15-CalculoOverall.md](15-CalculoOverall.md)).
  3. Sistema atualiza `player_season_stats` de cada participante (RN13).
  4. Match Day passa a ser considerado histórico (times não podem mais ser regenerados).

## UC08 — Consultar histórico de partidas

- **Ator**: Administrador
- **Pré-condição**: existir ao menos um Match Day cadastrado.
- **Fluxo principal**:
  1. Administrador acessa a lista de Match Days.
  2. Filtra/navega por data.
  3. Abre um Match Day específico para ver detalhes (times, placar, estatísticas individuais).

## UC09 — Consultar rankings/estatísticas

- **Ator**: Administrador
- **Pré-condição**: existir ao menos uma estatística de temporada registrada.
- **Fluxo principal**:
  1. Administrador acessa a tela de Estatísticas.
  2. Sistema exibe rankings de artilharia, assistências, jogos e vitórias (ver [16-Estatisticas.md](16-Estatisticas.md)).
