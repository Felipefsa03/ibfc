# Criar a página Stats/Index (rankings)

A vitrine da temporada: artilheiros, garçons, presença e vitórias.

## Objetivo

Criar `resources/js/pages/Stats/Index.tsx` exibindo os quatro rankings com alternância por abas.

## Contexto

A página recebe os quatro rankings prontos do `StatsController` e apenas apresenta ([../../13-Views.md](../../13-Views.md), seção 7 — zero lógica de negócio no cliente). Padrão visual: pódio destacado (top 3) + lista corrida, com as médias (gols/jogo, aproveitamento) como informação secundária.

## Pré-requisitos

- [passo5.md](passo5.md) concluído.
- [../sprint1/passo8.md](../sprint1/passo8.md) (AppLayout).

## Arquivos que serão criados

- `resources/js/pages/Stats/Index.tsx`
- `resources/js/components/StatBadge.tsx` — badge numérico reutilizável (gols, assistências, jogos, vitórias).

## Arquivos que serão modificados

- `resources/js/types/index.ts` — tipo `PlayerSeasonStat` (com as médias derivadas).

## O que implementar

1. Abas/segmentos: Artilharia, Assistências, Jogos, Vitórias — alternância client-side (dados já estão nas props).
2. Cada ranking: posição, jogador (nome/apelido), valor principal em destaque (`StatBadge`), médias como texto secundário; jogadores inativos com indicação visual sutil.
3. Estado vazio ("Nenhum dia encerrado ainda") quando não há dados agregados.
4. Responsivo mobile-first.

## Regras de negócio envolvidas

- RN14 — a ordem exibida é exatamente a recebida do backend (a View não reordena).

## Fluxo

```
StatsController@index → props com 4 rankings
    ↓
Stats/Index.tsx → abas client-side → listas com pódio + StatBadge
```

## Critérios de aceite

- ☐ Quatro rankings navegáveis por abas sem novas requisições.
- ☐ Médias exibidas; inativos sinalizados.
- ☐ Estado vazio implementado.
- ☐ Usável em 375px; build limpo.

## Observações

- **Boas práticas**: alternância de abas não deve reordenar/recalcular nada no cliente — só troca qual array é exibido.
- Referências: [../../13-Views.md](../../13-Views.md), [../../16-Estatisticas.md](../../16-Estatisticas.md).

## Dependências

**Depende de:**
- [passo5.md](passo5.md)
- [../sprint1/passo8.md](../sprint1/passo8.md)

**Desbloqueia:**
- [passo7.md](passo7.md)
