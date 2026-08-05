# Registrar placar e vencedor por time

Complementa as estatísticas individuais com o resultado coletivo do dia.

## Objetivo

Permitir registrar o `score` de cada time e marcar o(s) vencedor(es) (`won`) do Match Day.

## Contexto

O resultado por time (RN10) alimenta, na Sprint 7, os campos `wins`/`draws`/`losses` das estatísticas de temporada. O organizador informa o placar acumulado de cada time no dia; o `won` é definido manualmente (decisão da fase atual — a comparação automática de `score` é evolução futura, conforme RN10). A ação vive num endpoint próprio simples de atualização de time.

## Pré-requisitos

- [../sprint4/passo5.md](../sprint4/passo5.md) concluído (times existem).
- [passo3.md](passo3.md) em andamento ou concluído (a UI compartilha a mesma tela).

## Arquivos que serão criados

- `app/Http/Requests/UpdateTeamResultRequest.php` — `score` inteiro ≥ 0; `won` booleano.

## Arquivos que serão modificados

- `app/Http/Controllers/TeamController.php` — nova action de resultado (ex.: `updateResult`), atualizando apenas `score`/`won` do time.
- `routes/web.php` — `PUT teams/{team}/result` (ou aninhada sob match-days; escolher e nomear consistentemente, ex.: `teams.result.update`).
- `resources/js/components/TeamCard.tsx` — edição inline do placar e toggle "Vencedor".

## O que implementar

1. Request de validação dedicado (valores simples, mas o padrão do projeto é Form Request sempre).
2. Action enxuta: valida, atualiza o time, redirect com flash discreto.
3. UI no `TeamCard`: placar editável e marcação de vencedor; múltiplos vencedores permitidos (dias com mais de uma partida podem ter vencedores distintos — o modelo `won` por time acomoda isso), e empate = nenhum time marcado.
4. Mesma trava futura de dia encerrado (comentário/ponto de extensão para a Sprint 6, como no lançamento individual).

## Regras de negócio envolvidas

- RN10 — placar e vencedor por time, definidos pelo organizador.

## Fluxo

```
TeamCard → editar placar / marcar vencedor
    ↓
PUT /teams/{team}/result { score, won }
    ↓
UpdateTeamResultRequest → TeamController@updateResult
    ↓
Team atualizado → props refletem na tela
```

## Critérios de aceite

- ☐ Placar salvo por time.
- ☐ Marcação de vencedor(es) funciona, inclusive nenhum (empate).
- ☐ Score negativo rejeitado.
- ☐ Rota protegida por `auth`; Pint limpo.

## Observações

- **Armadilha**: não inferir `won` automaticamente comparando scores nesta fase — dias com múltiplas partidas tornam a inferência ambígua; o organizador decide (RN10).
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) (RN10), [../../06-Entidades.md](../../06-Entidades.md) (Team).

## Dependências

**Depende de:**
- [../sprint4/passo5.md](../sprint4/passo5.md)

**Desbloqueia:**
- [passo5.md](passo5.md)
- [../sprint7/passo3.md](../sprint7/passo3.md)
