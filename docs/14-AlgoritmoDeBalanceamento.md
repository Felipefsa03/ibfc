# 14 — Algoritmo de Balanceamento de Times

Este documento descreve, **em pseudocódigo** (nenhum código PHP real), como os times de um Match Day devem ser gerados de forma equilibrada. A implementação efetiva pertence a `app/Services/TeamBalancerService.php` (ver [03-ArquiteturaMVC.md](03-ArquiteturaMVC.md) e [19-Roadmap.md](19-Roadmap.md)).

## 1. Entradas

- `jogadoresSelecionados`: lista de jogadores ativos escolhidos para o Match Day (cada um com seu `current_overall` e seus atributos, incluindo `gol`).
- `numeroDeTimes`: quantidade de times a formar (`match_day.number_of_teams`).
- `jogadoresPorTime`: tamanho alvo de cada time (`match_day.players_per_team`).

## 2. Visão geral do algoritmo

1. Separar goleiros dos demais jogadores.
2. Distribuir os goleiros, um por time, de forma round-robin.
3. Ordenar os jogadores de linha por força (`current_overall`) decrescente.
4. Distribuir os jogadores de linha em "draft serpentina" (snake draft) entre os times, para equilibrar a soma de overall.
5. Calcular a força total de cada time.
6. Comparar o time mais forte com o mais fraco; se a diferença ultrapassar um limite aceitável, trocar jogadores entre esses dois times para reduzir a diferença.
7. Repetir o passo 6 até a diferença ficar dentro do limite ou até um número máximo de iterações ser atingido (evita loop infinito).

## 3. Pseudocódigo

```
FUNÇÃO gerarTimes(jogadoresSelecionados, numeroDeTimes, jogadoresPorTime):

    // 1. Separar goleiros dos jogadores de linha
    goleiros ← jogadores em jogadoresSelecionados ONDE atributo "gol" é o mais alto entre seus próprios atributos
               (ou marcados explicitamente como goleiro, se o cadastro vier a ter esse campo)
    jogadoresDeLinha ← jogadoresSelecionados - goleiros

    // 2. Inicializar os times vazios
    times ← lista vazia de numeroDeTimes times, cada um com: jogadores = [], somaOverall = 0

    // 3. Distribuir goleiros, um por time (round-robin)
    ORDENAR goleiros por current_overall DESCENDENTE
    PARA cada goleiro, índice i EM goleiros:
        time ← times[i MOD numeroDeTimes]
        ADICIONAR goleiro a time.jogadores
        time.somaOverall ← time.somaOverall + goleiro.current_overall

    // Se sobrarem goleiros além do número de times, eles entram na distribuição
    // normal de jogadores de linha (passo 4), pois já não há "vaga de goleiro" livre.
    SE quantidade(goleiros) > numeroDeTimes:
        jogadoresDeLinha ← jogadoresDeLinha + goleiros[numeroDeTimes:]

    // 4. Draft serpentina para os jogadores de linha
    ORDENAR jogadoresDeLinha por current_overall DESCENDENTE
    direção ← "frente"
    índiceTime ← 0
    PARA cada jogador EM jogadoresDeLinha:
        time ← times[índiceTime]
        ADICIONAR jogador a time.jogadores
        time.somaOverall ← time.somaOverall + jogador.current_overall

        SE direção é "frente":
            índiceTime ← índiceTime + 1
            SE índiceTime == numeroDeTimes:
                índiceTime ← numeroDeTimes - 1
                direção ← "trás"
        SENÃO:
            índiceTime ← índiceTime - 1
            SE índiceTime < 0:
                índiceTime ← 0
                direção ← "frente"

    // Draft serpentina (1,2,3,3,2,1,1,2,3,...) distribui o jogador mais forte
    // restante sempre para o time mais "atrasado" no ciclo, equilibrando a soma.

    // 5. Calcular força de cada time (já mantida incrementalmente em somaOverall,
    //    mas pode-se recalcular a força média também)
    PARA cada time EM times:
        time.forcaMedia ← time.somaOverall / quantidade(time.jogadores)

    // 6. Balanceamento fino: comparar extremos e trocar se necessário
    iteracao ← 0
    LIMITE_MAX_ITERACOES ← 20
    LIMITE_DIFERENCA_ACEITAVEL ← definido pelo negócio (ex.: 5% da soma média de overall)

    ENQUANTO iteracao < LIMITE_MAX_ITERACOES:
        timeMaisForte ← time com maior somaOverall
        timeMaisFraco ← time com menor somaOverall
        diferenca ← timeMaisForte.somaOverall - timeMaisFraco.somaOverall

        SE diferenca <= LIMITE_DIFERENCA_ACEITAVEL:
            PARAR // já está equilibrado o suficiente

        // Procurar um par de jogadores (um de cada time) cuja troca reduza a diferença
        melhorPar ← NULO
        melhorReducaoDiferenca ← 0

        PARA cada jogadorForte EM timeMaisForte.jogadores:
            PARA cada jogadorFraco EM timeMaisFraco.jogadores:
                SE jogadorForte é goleiro DIFERENTE de jogadorFraco ser goleiro:
                    CONTINUAR // não trocar goleiro por jogador de linha, preserva 1 goleiro por time

                novaDiferenca ← calcular diferença resultante se jogadorForte e
                                 jogadorFraco trocassem de time

                SE novaDiferenca < diferenca E (diferenca - novaDiferenca) > melhorReducaoDiferenca:
                    melhorPar ← (jogadorForte, jogadorFraco)
                    melhorReducaoDiferenca ← diferenca - novaDiferenca

        SE melhorPar é NULO:
            PARAR // nenhuma troca possível melhora o equilíbrio, evita loop sem progresso

        // Efetiva a troca
        MOVER melhorPar.jogadorForte para timeMaisFraco
        MOVER melhorPar.jogadorFraco para timeMaisForte
        RECALCULAR somaOverall dos dois times afetados

        iteracao ← iteracao + 1

    RETORNAR times
FIM FUNÇÃO
```

## 4. Casos especiais

- **Número de jogadores não é múltiplo exato de `jogadoresPorTime`**: o draft serpentina naturalmente distribui a sobra um a um pelos times (alguns times ficam com um jogador a mais); não é um erro bloqueante, apenas gera aviso na interface.
- **Menos goleiros que times**: alguns times ficam sem goleiro dedicado — aceitável, a interface deve avisar o organizador.
- **Mais goleiros que times**: o excedente de goleiros entra na distribuição normal como jogador de linha (passo 4), já que não há mais "vaga de goleiro" disponível.
- **Apenas 1 jogador selecionado por time (`jogadoresPorTime == 1`)**: o algoritmo ainda funciona, mas o balanceamento perde sentido prático — a interface pode alertar que a configuração é incomum.

## 5. Por que draft serpentina + troca fina, e não sorteio puro

- Sorteio aleatório puro não garante equilíbrio de força — dois jogadores fortes podem cair no mesmo time por acaso.
- Draft serpentina (padrão usado em ligas de fantasy sports) já produz um bom equilíbrio inicial de forma determinística e previsível.
- A etapa de troca fina (passo 6) corrige desequilíbrios residuais que o draft sozinho não resolve — por exemplo, quando os jogadores goleiros têm overalls muito diferentes entre si.

## 6. Regeneração de times

Quando o organizador solicita "gerar times novamente" (RN07, [02-RegrasDeNegocio.md](02-RegrasDeNegocio.md)), o algoritmo é executado do zero, com a mesma lista de jogadores selecionados — como a ordenação por overall é determinística, o resultado tende a ser semelhante; para introduzir variação intencional entre tentativas, pode-se embaralhar aleatoriamente jogadores com overall empatado antes da ordenação (sem afetar o equilíbrio geral).
