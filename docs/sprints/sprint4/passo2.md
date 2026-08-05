# TeamBalancerService — etapa 2: draft serpentina dos jogadores de linha

Segunda etapa do algoritmo: distribuir os jogadores de linha equilibrando a soma de overall.

## Objetivo

Implementar a distribuição em "snake draft" (serpentina) dos jogadores de linha entre os times.

## Contexto

Após os goleiros (etapa 1), os jogadores de linha são ordenados por `current_overall` desc e distribuídos no padrão serpentina: times 1→N, depois N→1, alternando a direção a cada rodada (1,2,3,3,2,1,1,2,3...). Esse padrão — usado em fantasy sports — compensa a vantagem de escolher primeiro, produzindo somas de overall próximas entre os times já antes do refinamento da etapa 3. A soma incremental de overall por time deve ser mantida durante a distribuição.

## Pré-requisitos

- [passo1.md](passo1.md) concluído.

## Arquivos que serão criados

- Nenhum.

## Arquivos que serão modificados

- `app/Services/TeamBalancerService.php` — método da etapa 2.

## O que implementar

1. Ordenação dos jogadores de linha (incluindo goleiros excedentes reintegrados) por `current_overall` desc.
2. Percurso serpentina com controle de índice e direção exatamente como o pseudocódigo (seção 3, passo 4 do documento do algoritmo).
3. Atualização incremental de `somaOverall` de cada time a cada alocação.
4. Sobras (total não múltiplo de `players_per_team`): distribuídas naturalmente pelo percurso — nenhum tratamento especial além do já previsto; alguns times ficam com um jogador a mais.

## Regras de negócio envolvidas

- RN07 — o equilíbrio da soma de `current_overall` é o critério de justiça dos times.
- Casos especiais de quantidade: [../../14-AlgoritmoDeBalanceamento.md](../../14-AlgoritmoDeBalanceamento.md), seção 4.

## Fluxo

```
jogadoresDeLinha ordenados por overall desc
    ↓
serpentina: 1→N, N→1, 1→N, ...
    ↓
cada alocação atualiza somaOverall do time
    ↓
times preenchidos com somas próximas entre si
```

## Critérios de aceite

- ☐ Percurso serpentina idêntico ao pseudocódigo (incluindo as viradas de direção).
- ☐ Somas de overall mantidas corretas incrementalmente.
- ☐ Cenário com sobra distribui o excedente sem erro.
- ☐ Verificação manual: 10 jogadores de overalls conhecidos em 2 times produzem a partição esperada do snake draft.

## Observações

- **Armadilha**: erro clássico na virada da serpentina é pular o time da ponta ou repeti-lo duas vezes fora de hora — o pseudocódigo da doc trata as bordas explicitamente; siga-o à risca.
- Referências: [../../14-AlgoritmoDeBalanceamento.md](../../14-AlgoritmoDeBalanceamento.md) (seções 3 e 5 — por que serpentina e não sorteio puro).

## Dependências

**Depende de:**
- [passo1.md](passo1.md)

**Desbloqueia:**
- [passo3.md](passo3.md)
