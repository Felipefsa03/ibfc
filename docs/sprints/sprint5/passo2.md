# Criar o endpoint de registro de estatísticas (PlayerDayStatController)

Grava gols e assistências respeitando a unicidade jogador/dia.

## Objetivo

Criar `app/Http/Controllers/PlayerDayStatController.php` com a action `update` (upsert do registro de estatística) e registrar a rota.

## Contexto

Cada jogador tem no máximo um registro por dia (`unique(match_day_id, player_id)`); múltiplas partidas no mesmo dia somam-se nesse único registro (RN09). O padrão `updateOrCreate` implementa exatamente essa semântica sem checagem manual de existência. A action também deve recusar lançamentos em dias **encerrados** — como o conceito de encerramento só nasce na Sprint 6, este passo deixa o ponto de extensão claro (ver Observações).

## Pré-requisitos

- [passo1.md](passo1.md) concluído.
- [../sprint4/passo5.md](../sprint4/passo5.md) concluído (escalações existem).

## Arquivos que serão criados

- `app/Http/Controllers/PlayerDayStatController.php`

## Arquivos que serão modificados

- `routes/web.php` — `PUT match-days/{matchDay}/players/{player}/stats` → `match-days.stats.update`.

## O que implementar

1. **`update(StorePlayerDayStatRequest $request, MatchDay $matchDay, Player $player)`**: `PlayerDayStat::updateOrCreate(['match_day_id' => ..., 'player_id' => ...], ['goals' => ..., 'assists' => ...])`; redirect de volta ao `show` com flash discreto (o lançamento é repetitivo — feedback leve).
2. Semântica de **valores absolutos** (o request envia o total do dia, não incrementos) — decisão documentada: a UI mostra contadores editáveis com o valor atual; reenviar o total é idempotente e tolerante a retentativas de rede.

## Regras de negócio envolvidas

- RN09 — um registro por jogador/dia; contadores não-negativos; apenas participantes.

## Fluxo

```
PUT stats { goals: 3, assists: 1 }
    ↓
Request valida (valores + participação)
    ↓
updateOrCreate (chave: match_day_id + player_id)
    ↓
Registro criado ou atualizado (nunca duplicado)
    ↓
Redirect show + flash
```

## Critérios de aceite

- ☐ Primeiro lançamento cria o registro; segundo atualiza o mesmo (sem duplicar).
- ☐ Chave composta respeitada (verificar no banco).
- ☐ Rota nomeada e protegida por `auth`.
- ☐ Pint/Larastan limpos.

## Observações

- **Ponto de extensão (Sprint 6)**: quando o encerramento existir, esta action deve recusar lançamentos em dia encerrado — deixar um comentário PHPDoc sinalizando, e o [../sprint6/passo4.md](../sprint6/passo4.md) implementará a trava.
- **Armadilha**: não usar incrementos (`+1`) no backend — retransmissão de request duplicaria gols; o modelo de "total absoluto" é idempotente.
- Referências: [../../10-Models.md](../../10-Models.md) (seção 5 — uso de updateOrCreate), [../../11-Controllers.md](../../11-Controllers.md) (seção 5).

## Dependências

**Depende de:**
- [passo1.md](passo1.md)
- [../sprint4/passo5.md](../sprint4/passo5.md)

**Desbloqueia:**
- [passo3.md](passo3.md)
- [passo5.md](passo5.md)
- [../sprint6/passo3.md](../sprint6/passo3.md)
