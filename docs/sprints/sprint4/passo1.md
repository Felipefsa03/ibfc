# TeamBalancerService — etapa 1: estrutura, separação de goleiros e round-robin

Início do coração do sistema: o serviço que monta times equilibrados. O algoritmo é construído em três passos incrementais (1–3), cada um testável.

## Objetivo

Criar `app/Services/TeamBalancerService.php` com a estrutura do algoritmo e a primeira etapa: identificar goleiros e distribuí-los um por time (round-robin).

## Contexto

O pseudocódigo completo está em [../../14-AlgoritmoDeBalanceamento.md](../../14-AlgoritmoDeBalanceamento.md) e é a especificação autoritativa deste Service. Nesta etapa implementa-se: a assinatura pública (recebe a coleção de jogadores selecionados, número de times, jogadores por time; retorna uma estrutura em memória de times com jogadores e soma de overall — **sem persistir nada**), o critério de goleiro (atributo `gol` é o maior entre os próprios atributos do jogador) e a distribuição round-robin dos goleiros ordenados por `current_overall` desc. Goleiros excedentes (mais goleiros que times) voltam ao grupo de linha.

## Pré-requisitos

- [../sprint3/passo7.md](../sprint3/passo7.md) concluído (Sprint 3 fechada).
- [../sprint1/passo2.md](../sprint1/passo2.md) (Models disponíveis).

## Arquivos que serão criados

- `app/Services/TeamBalancerService.php`

## Arquivos que serão modificados

- Nenhum.

## O que implementar

1. Estrutura de retorno em memória (ex.: DTO simples/array tipado por time: lista de jogadores, soma de overall) — a persistência é responsabilidade do Controller ([passo5.md](passo5.md)), o Service é puro.
2. Método privado de classificação de goleiro conforme o critério documentado.
3. Ordenação dos goleiros por `current_overall` desc e alocação `times[i mod N]`.
4. Reintegração de goleiros excedentes ao grupo de jogadores de linha.
5. As etapas seguintes (serpentina, troca fina) ficam como métodos privados vazios/pendentes claramente sinalizados — o método público já orquestra a sequência.

## Regras de negócio envolvidas

- RN07 — geração de times balanceados (etapa goleiros).
- Distribuição de goleiros: [../../14-AlgoritmoDeBalanceamento.md](../../14-AlgoritmoDeBalanceamento.md), seções 2–3 (passos 1–3 do pseudocódigo) e seção 4 (casos especiais de goleiros).

## Fluxo

```
TeamBalancerService::generate(jogadores, nTimes, porTime)
    ↓
separa goleiros ← critério: gol é o maior atributo
    ↓
ordena goleiros por current_overall desc
    ↓
round-robin: 1 goleiro por time
    ↓
excedentes → grupo de linha (para a etapa 2)
```

## Critérios de aceite

- ☐ Service criado, método público com tipos explícitos, sem acesso a banco.
- ☐ Critério de goleiro implementado exatamente como documentado.
- ☐ Round-robin correto (verificação manual via Tinker ou teste provisório).
- ☐ Excedentes reintegrados ao grupo de linha.
- ☐ Pint/Larastan limpos.

## Observações

- **Armadilha**: o critério "gol é o maior atributo" pode classificar como goleiro um jogador de linha com atributos baixos e `gol` relativamente alto — comportamento aceito e documentado; um campo explícito de posição é evolução futura.
- **Boas práticas**: manter o Service determinístico (sem aleatoriedade) até o passo de regeneração ([passo7.md](passo7.md)) discutir variação.
- Referências: [../../14-AlgoritmoDeBalanceamento.md](../../14-AlgoritmoDeBalanceamento.md) (seções 1–4).

## Dependências

**Depende de:**
- [../sprint3/passo7.md](../sprint3/passo7.md)
- [../sprint1/passo2.md](../sprint1/passo2.md)

**Desbloqueia:**
- [passo2.md](passo2.md)
