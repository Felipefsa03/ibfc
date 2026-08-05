# 05 — Fluxo da Aplicação

Este documento detalha, em fluxogramas textuais, os principais fluxos operacionais do sistema.

## 1. Cadastrar jogador

```
[Organizador acessa "Novo Jogador"]
        │
        ▼
[Preenche nome, apelido (opcional), atributos táticos]
        │
        ▼
[Submete formulário] ──► StorePlayerRequest valida entrada
        │
        ▼
   Válido? ──Não──► Retorna erros de validação para o formulário
        │
       Sim
        ▼
[PlayerController@store]
        │
        ▼
[Calcula overall_base a partir dos atributos] (ver 15-CalculoOverall.md)
        │
        ▼
[Player::create([...])] → current_overall = overall_base
        │
        ▼
[Redirect para Players/Index com mensagem de sucesso]
```

## 2. Editar jogador

```
[Organizador abre um jogador existente]
        │
        ▼
[PlayerController@edit] → Inertia::render('Players/Edit', ['player' => $player])
        │
        ▼
[Organizador altera dados/atributos e salva]
        │
        ▼
[UpdatePlayerRequest valida]
        │
        ▼
[PlayerController@update]
        │
        ▼
[Se atributos táticos mudaram → recalcula overall_base]
        │  (current_overall é preservado, não resetado — ver RN02)
        ▼
[Player::update([...])]
        │
        ▼
[Redirect para Players/Index]
```

## 3. Criar um Match Day e gerar times

```
[Organizador clica "Novo Dia de Jogo"]
        │
        ▼
[Preenche data, número de partidas, número de times, jogadores por time]
        │
        ▼
[MatchDayController@store] → cria MatchDay
        │
        ▼
[Organizador seleciona, dentre jogadores ativos, quem está presente]
        │
        ▼
[Confirma seleção] ──► TeamController@store (ou @generate)
        │
        ▼
[TeamBalancerService::generate($matchDay, $selectedPlayers)]
        │   (ver pseudocódigo completo em 14-AlgoritmoDeBalanceamento.md)
        │
        ▼
[DB::transaction]
    ├── cria N registros em `teams` (um por time)
    └── cria vínculos em `team_players` para cada jogador distribuído
        │
        ▼
[Inertia::render('MatchDays/Show', ['teams' => ...])]
        │
        ▼
[Organizador visualiza os times formados]
```

## 4. Registrar estatísticas do dia

```
[Durante/depois da partida, organizador abre o Match Day]
        │
        ▼
[Para cada jogador que jogou: informa gols e assistências]
        │
        ▼
[StorePlayerDayStatRequest valida (goals >= 0, assists >= 0)]
        │
        ▼
[PlayerDayStat::updateOrCreate(
    ['match_day_id' => ..., 'player_id' => ...],
    ['goals' => ..., 'assists' => ...]
 )]
        │
        ▼
[Organizador marca o Match Day como "encerrado"]
        │
        ▼
[Dispara recálculo — ver fluxo 5]
```

## 5. Recalcular overall e atualizar estatísticas de temporada

```
[Match Day encerrado]
        │
        ▼
[Para cada PlayerDayStat do Match Day:]
        │
        ├──► [OverallCalculatorService::recalculate($player, $dayStat)]
        │        │  aplica fórmula com bônus decrescente e teto (15-CalculoOverall.md)
        │        ▼
        │    [Player::update(['current_overall' => $novoValor])]
        │
        └──► [PlayerSeasonStat::updateOrCreate(['player_id' => ...], [...incrementa games/goals/assists/wins/draws/losses...])]
        │
        ▼
[Rankings e estatísticas de temporada ficam disponíveis imediatamente para consulta]
```

## 6. Consultar rankings e histórico

```
[Organizador acessa "Estatísticas"]
        │
        ▼
[StatsController@index] (ou similar)
        │
        ▼
[Consulta player_season_stats ordenado por goals/assists/games]
        │
        ▼
[Inertia::render('Stats/Index', ['ranking' => ...])]
```

## 7. Visão consolidada (todos os fluxos encadeados)

```
Cadastro de Jogadores
        │
        ▼
Criação de Match Day
        │
        ▼
Seleção de jogadores presentes
        │
        ▼
Geração automática de times
        │
        ▼
   (partida ocorre em campo, fora do sistema)
        │
        ▼
Registro de gols e assistências
        │
        ▼
Encerramento do Match Day
        │
        ├──► Recálculo de overall dos participantes
        └──► Atualização de player_season_stats
        │
        ▼
Consulta de rankings e histórico
```

Cada uma dessas etapas é detalhada com regras de negócio em [02-RegrasDeNegocio.md](02-RegrasDeNegocio.md) e com passo a passo operacional completo (incluindo setup do ambiente) em [18-FluxoCompleto.md](18-FluxoCompleto.md).
