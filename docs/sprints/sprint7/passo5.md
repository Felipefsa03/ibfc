# Criar o StatsController e a rota de estatísticas

O backend dos rankings.

## Objetivo

Criar `app/Http/Controllers/StatsController.php` com a action `index` e registrar `GET /stats` (`stats.index`).

## Contexto

Os rankings são consultas diretas sobre `player_season_stats` ordenadas por cada critério ([../../16-Estatisticas.md](../../16-Estatisticas.md), seções 2–5), com desempate documentado (RN14: menos jogos primeiro, depois ordem alfabética). Uma única action entrega os quatro rankings (artilharia, assistências, participação, vitórias) como props — a página alterna a visualização no cliente sem novas requisições.

## Pré-requisitos

- [passo2.md](passo2.md) concluído (Model e accessors).

## Arquivos que serão criados

- `app/Http/Controllers/StatsController.php`

## Arquivos que serão modificados

- `routes/web.php` — `GET stats` → `stats.index`, sob `auth`.
- `resources/js/layouts/AppLayout.tsx` — item "Estatísticas" na navegação.

## O que implementar

1. **`index`**: consultas com `with('player')` (eager), ordenadas por `goals`/`assists`/`games`/`wins` desc com os desempates da RN14; limitar ao top N (ex.: 20) por ranking; incluir as médias derivadas (accessors) na serialização.
2. Filtrar jogadores conforme a decisão de produto: incluir inativos nos rankings (o histórico da temporada é deles também), sinalizando o status na resposta — a UI decide como exibir.
3. Selecionar apenas campos necessários do jogador (id, name, nickname, active).

## Regras de negócio envolvidas

- RN14 — critérios e desempates dos rankings.

## Fluxo

```
GET /stats
    ↓
StatsController@index
    ↓
4 consultas ordenadas sobre player_season_stats (+ player eager)
    ↓
Inertia::render('Stats/Index', { topScorers, topAssists, mostGames, mostWins })
```

## Critérios de aceite

- ☐ Rota registrada sob `auth`; navegação atualizada.
- ☐ Quatro rankings com ordenação e desempates corretos.
- ☐ Sem N+1 (eager loading verificado).
- ☐ Médias derivadas presentes nas props.
- ☐ Pint/Larastan limpos.

## Observações

- **Boas práticas**: os desempates (RN14) entram como `orderBy` secundários na própria query — não ordenar em PHP.
- Referências: [../../16-Estatisticas.md](../../16-Estatisticas.md), [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) (RN14).

## Dependências

**Depende de:**
- [passo2.md](passo2.md)

**Desbloqueia:**
- [passo6.md](passo6.md)
