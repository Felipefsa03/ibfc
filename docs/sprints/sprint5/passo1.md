# Criar o StorePlayerDayStatRequest

Validação do lançamento de gols e assistências de um jogador em um dia de jogo.

## Objetivo

Criar `app/Http/Requests/StorePlayerDayStatRequest.php` com as regras do registro de estatística diária (RN09).

## Contexto

O lançamento de estatística chega via `PUT /match-days/{matchDay}/players/{player}/stats` ([../../12-Routes.md](../../12-Routes.md)) com `goals` e `assists`. A unicidade por jogador/dia é garantida pelo unique do banco + `updateOrCreate` no Controller; o Form Request cuida dos valores e de uma regra contextual importante: o jogador precisa estar **escalado em algum time daquele dia** (RN09 — só participantes têm estatística).

## Pré-requisitos

- [../sprint4/passo8.md](../sprint4/passo8.md) concluído (Sprint 4 fechada — existem times/escalações para validar contra).

## Arquivos que serão criados

- `app/Http/Requests/StorePlayerDayStatRequest.php`

## Arquivos que serão modificados

- Nenhum.

## O que implementar

1. Regras: `goals` e `assists` obrigatórios, inteiros, mínimo 0 (teto alto de sanidade, ex.: 50, para pegar erro de digitação).
2. Validação contextual (via `withValidator` ou regra custom): o `{player}` da rota deve possuir vínculo em `team_players` de algum time do `{matchDay}` da rota — caso contrário, erro claro ("jogador não participa deste dia").
3. `authorize()`: `true`; mensagens em português.

## Regras de negócio envolvidas

- RN09 — contadores não-negativos; estatística apenas de quem compõe algum time do dia.

## Fluxo

```
UI de lançamento (Show do Match Day)
    ↓
PUT /match-days/{id}/players/{playerId}/stats { goals, assists }
    ↓
StorePlayerDayStatRequest
    ├── valores válidos?
    └── jogador escalado no dia?
    ↓
Controller (passo2)
```

## Critérios de aceite

- ☐ Valores negativos rejeitados.
- ☐ Jogador não escalado no dia rejeitado com mensagem específica.
- ☐ Mensagens em português; Pint limpo.

## Observações

- **Armadilha**: a checagem de participação usa os parâmetros de **rota** (route model binding), não do body — o request tem acesso a eles via `$this->route()`.
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) (RN09), [../../07-BancoDeDados.md](../../07-BancoDeDados.md) (tabela `player_day_stats`).

## Dependências

**Depende de:**
- [../sprint4/passo8.md](../sprint4/passo8.md)

**Desbloqueia:**
- [passo2.md](passo2.md)
