# TeamBalancerService — etapa 3: troca fina (minimização da diferença)

Última etapa do algoritmo: refinar o resultado da serpentina trocando jogadores entre os times extremos.

## Objetivo

Implementar o loop de balanceamento fino: enquanto a diferença entre o time mais forte e o mais fraco exceder o limite aceitável, buscar a melhor troca de par de jogadores entre eles; parar por convergência, ausência de troca útil ou limite de iterações.

## Contexto

A serpentina produz um bom equilíbrio, mas desequilíbrios residuais surgem (ex.: goleiros com overalls muito díspares alocados na etapa 1). A troca fina corrige isso conforme o pseudocódigo (seção 3, passo 6): a cada iteração identifica os times extremos, avalia todos os pares (jogadorForte, jogadorFraco) — respeitando a restrição de não trocar goleiro por jogador de linha — e efetiva a troca que mais reduz a diferença. Constantes de negócio: `LIMITE_MAX_ITERACOES = 20` e `LIMITE_DIFERENCA_ACEITAVEL` (percentual da soma média, ex.: 5%), ambas como constantes nomeadas da classe.

## Pré-requisitos

- [passo2.md](passo2.md) concluído.

## Arquivos que serão criados

- Nenhum.

## Arquivos que serão modificados

- `app/Services/TeamBalancerService.php` — método da etapa 3; o método público passa a retornar o resultado final completo.

## O que implementar

1. Loop com as três condições de parada: diferença dentro do limite, nenhuma troca melhora, ou máximo de iterações.
2. Busca do melhor par: simulação da diferença resultante de cada troca possível entre os dois times extremos, escolhendo a maior redução.
3. Restrição goleiro↔goleiro / linha↔linha nas trocas (preserva 1 goleiro por time).
4. Efetivação da troca e recálculo das somas apenas dos dois times afetados.
5. Constantes nomeadas para os limites, com PHPDoc explicando a semântica de cada uma.

## Regras de negócio envolvidas

- RN07 — minimização da diferença de força entre times.
- Pseudocódigo autoritativo: [../../14-AlgoritmoDeBalanceamento.md](../../14-AlgoritmoDeBalanceamento.md), seção 3 (passo 6) e seção 4.

## Fluxo

```
times pós-serpentina
    ↓
loop (máx. 20 iterações):
    identifica extremos → diferença <= limite? PARA
    busca melhor par de troca (goleiro↔goleiro | linha↔linha)
    nenhum par melhora? PARA
    efetiva a troca, recalcula somas dos 2 times
    ↓
times finais equilibrados
```

## Critérios de aceite

- ☐ As três condições de parada implementadas.
- ☐ Restrição de tipo (goleiro/linha) respeitada nas trocas.
- ☐ Somas recalculadas apenas para os times afetados.
- ☐ Limites como constantes nomeadas documentadas.
- ☐ Nenhum loop infinito possível (garantido pelo teto de iterações).

## Observações

- **Armadilha**: sem a parada por "nenhuma troca melhora", o loop pode oscilar trocando o mesmo par de ida e volta até estourar as iterações — a condição é obrigatória, não otimização.
- **Boas práticas**: o custo O(n²) da busca de pares é irrelevante no volume do projeto (times de ~5 jogadores) — não otimizar prematuramente.
- Referências: [../../14-AlgoritmoDeBalanceamento.md](../../14-AlgoritmoDeBalanceamento.md).

## Dependências

**Depende de:**
- [passo2.md](passo2.md)

**Desbloqueia:**
- [passo4.md](passo4.md)
- [passo5.md](passo5.md)
