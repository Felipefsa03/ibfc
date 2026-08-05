# OverallCalculatorService — parte 2: evolução do current_overall

Estende o Service criado na Sprint 2 com a fórmula de evolução por desempenho.

## Objetivo

Adicionar ao `OverallCalculatorService` o cálculo do novo `current_overall` de um jogador a partir dos gols/assistências de um dia, com retorno decrescente e tetos.

## Contexto

A especificação matemática completa está em [../../15-CalculoOverall.md](../../15-CalculoOverall.md) (seção 3) e é autoritativa: bônus bruto (`goals × PONTOS_POR_GOL + assists × PONTOS_POR_ASSISTENCIA`), suavização exponencial com `TETO_BONUS_POR_DIA` e `FATOR_SUAVIZACAO`, e o teto estrutural `overall_base + CRESCIMENTO_MAXIMO_TOTAL`. Constantes iniciais documentadas: 0.5 / 0.3 / 2 / 1.5 / 15. Sem desempenho no dia, bônus = 0 (sem penalidade). O método continua **puro**: recebe valores, retorna o novo overall — quem persiste é a action de encerramento ([passo3.md](passo3.md)).

## Pré-requisitos

- [../sprint2/passo2.md](../sprint2/passo2.md) concluído (Service existe com o cálculo base).
- [../sprint5/passo5.md](../sprint5/passo5.md) concluído (Sprint 5 fechada).

## Arquivos que serão criados

- Nenhum.

## Arquivos que serão modificados

- `app/Services/OverallCalculatorService.php` — novo método público (ex.: `recalculate`) e as constantes da fórmula.

## O que implementar

1. Método que recebe: `current_overall` atual, `overall_base`, `goals` e `assists` do dia; retorna o novo `current_overall` (inteiro, arredondado ao final).
2. As três camadas da fórmula, na ordem documentada: bônus bruto → suavização exponencial (`teto × (1 − e^(−bruto/fator))`) → `min` com o teto estrutural.
3. Todas as constantes nomeadas na classe, com PHPDoc explicando a semântica de cada uma (um ajuste de balanceamento do jogo deve ser uma mudança de constante, nunca de lógica).

## Regras de negócio envolvidas

- RN11/RN12 — evolução automática com crescimento limitado ([../../15-CalculoOverall.md](../../15-CalculoOverall.md), seções 3–4).

## Fluxo

```
recalculate(atual=54→55, base=54, goals=3, assists=1)
    ↓
bruto = 1.8 → suavizado ≈ 1.40 → min(55.40, 69)
    ↓
retorna 55 (arredondado)
```

## Critérios de aceite

- ☐ Método puro (sem banco), tipado.
- ☐ Fórmula idêntica à doc 15 (validável pelos exemplos numéricos).
- ☐ Constantes nomeadas e documentadas.
- ☐ Arredondamento apenas no resultado final (não em etapas intermediárias).
- ☐ Pint/Larastan limpos.

## Observações

- **Armadilha**: arredondar etapas intermediárias altera o resultado dos exemplos documentados — manter float até o fim.
- **Armadilha 2**: o teto estrutural usa `overall_base` **atual** do jogador (que pode ter sido reavaliado via edição) — não um valor congelado.
- Referências: [../../15-CalculoOverall.md](../../15-CalculoOverall.md).

## Dependências

**Depende de:**
- [../sprint2/passo2.md](../sprint2/passo2.md)
- [../sprint5/passo5.md](../sprint5/passo5.md)

**Desbloqueia:**
- [passo2.md](passo2.md)
- [passo3.md](passo3.md)
