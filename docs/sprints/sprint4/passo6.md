# Exibir os times gerados (TeamCard na tela do Match Day)

Materializa o resultado do balanceamento na interface.

## Objetivo

Criar o componente `TeamCard.tsx` e integrar a exibição dos times na seção "Times" de `MatchDays/Show.tsx`.

## Contexto

Depois da geração ([passo5.md](passo5.md)), o `show` do Match Day já entrega os times com jogadores aninhados (eager loading feito na Sprint 3). A tela troca a UI de seleção pelo grid de times: cada `TeamCard` mostra o nome do time, a lista de jogadores (com destaque para o goleiro) e a **força total** (soma de `current_overall`) — transparência do equilíbrio para o organizador.

## Pré-requisitos

- [passo5.md](passo5.md) concluído (times persistidos).
- [../sprint3/passo4.md](../sprint3/passo4.md) concluído (Show com seções).

## Arquivos que serão criados

- `resources/js/components/TeamCard.tsx`
- `resources/js/components/PlayerCard.tsx` (item de jogador reutilizável: nome/apelido + overall + badge de goleiro) — se ainda não existir.

## Arquivos que serão modificados

- `resources/js/pages/MatchDays/Show.tsx` — renderizar o grid de `TeamCard` quando `teams` não está vazio (substituindo a seleção de presentes).
- `app/Http/Controllers/MatchDayController.php` — incluir a soma de overall por time nas props (calculada no backend — a View não soma; [../../13-Views.md](../../13-Views.md), seção 7).

## O que implementar

1. **`TeamCard`**: cabeçalho (nome do time, força total), lista de `PlayerCard` com goleiro no topo e destacado, placar (`score`) — por ora sempre 0, o lançamento vem na Sprint 5.
2. Grid responsivo: cards lado a lado no desktop, empilhados no mobile.
3. Indicador de equilíbrio: exibir a diferença entre o time mais forte e o mais fraco (dados prontos do backend).
4. Lógica condicional do Show: sem times → seleção de presentes; com times → grid de cards + área para o botão de regenerar ([passo7.md](passo7.md)).

## Regras de negócio envolvidas

- RN07 — visualização do resultado do balanceamento; a "força do time" exibida é a mesma métrica usada pelo algoritmo.

## Fluxo

```
MatchDayController@show (times + somas calculadas)
    ↓
Inertia props
    ↓
Show.tsx → grid de TeamCard (goleiro destacado, força total, diferença entre extremos)
```

## Critérios de aceite

- ☐ Times exibidos com todos os jogadores, goleiro destacado.
- ☐ Força total por time e diferença entre extremos visíveis.
- ☐ Somas calculadas no backend, não no JSX.
- ☐ Grid responsivo (mobile empilhado).
- ☐ Build limpo.

## Observações

- **Boas práticas**: `PlayerCard` nasce aqui como componente reutilizável — a Sprint 5 o reaproveitará no lançamento de estatísticas.
- Referências: [../../13-Views.md](../../13-Views.md) (seção 4), [../../10-Models.md](../../10-Models.md) (accessor `totalOverall` sugerido).

## Dependências

**Depende de:**
- [passo5.md](passo5.md)
- [../sprint3/passo4.md](../sprint3/passo4.md)

**Desbloqueia:**
- [passo8.md](passo8.md)
- [../sprint5/passo3.md](../sprint5/passo3.md)
