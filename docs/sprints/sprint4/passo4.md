# Testes unitários do TeamBalancerService

O algoritmo é a regra de negócio mais sensível do sistema — precisa de bateria de testes própria antes de ser exposto via HTTP.

## Objetivo

Criar `tests/Unit/TeamBalancerServiceTest.php` (Pest) cobrindo o comportamento completo do serviço, incluindo todos os casos especiais documentados.

## Contexto

Como o Service é puro (entra coleção de jogadores, sai estrutura de times, sem banco), os testes unitários são rápidos e determinísticos. Jogadores de teste são construídos com a `PlayerFactory` (estados `goalkeeper()` e overalls controlados via override de atributos) — usar `make()` (sem persistir) quando possível para velocidade.

## Pré-requisitos

- [passo3.md](passo3.md) concluído (algoritmo completo).
- [../sprint1/passo5.md](../sprint1/passo5.md) e [../sprint1/passo6.md](../sprint1/passo6.md) (factories).

## Arquivos que serão criados

- `tests/Unit/TeamBalancerServiceTest.php` (`php artisan make:test --pest --unit TeamBalancerServiceTest`).

## Arquivos que serão modificados

- Possíveis correções no Service se os testes revelarem bugs.

## O que implementar

Cenários mínimos:
1. **Caso base**: 10 jogadores de linha, 2 times de 5 — todos alocados, nenhum repetido, diferença de soma dentro do limite.
2. **Goleiros = times**: 2 goleiros, 2 times — um goleiro em cada.
3. **Goleiros < times**: 1 goleiro, 3 times — um time com goleiro, aviso implícito (sem erro).
4. **Goleiros > times**: 4 goleiros, 2 times — 2 como goleiros, 2 tratados como linha.
5. **Sobras**: 11 jogadores, 2 times de 5 — um time com 6, sem erro.
6. **Overalls extremos**: um jogador muito acima dos demais — a troca fina não deve piorar o equilíbrio; diferença final ≤ diferença pós-serpentina.
7. **Empates de overall**: vários jogadores com o mesmo overall — resultado válido e estável.
8. **Convergência**: nenhum cenário excede o limite de iterações com estouro/loop.

## Regras de negócio envolvidas

- RN07 e todos os casos especiais de [../../14-AlgoritmoDeBalanceamento.md](../../14-AlgoritmoDeBalanceamento.md), seção 4.

## Fluxo

```
Pest Unit
    ↓
Player::factory()->make() com overalls controlados
    ↓
TeamBalancerService::generate(...)
    ↓
Asserções estruturais (alocação total, sem duplicatas, equilíbrio)
```

## Critérios de aceite

- ☐ Os 8 cenários implementados e passando.
- ☐ Asserção universal presente em todos: cada jogador aparece exatamente uma vez no resultado.
- ☐ Testes não tocam o banco onde `make()` basta.
- ☐ Suíte completa verde.

## Observações

- **Boas práticas**: asserções sobre **propriedades** do resultado (equilíbrio, completude) e não sobre a partição exata — permite evoluir o algoritmo sem quebrar testes por detalhe de implementação; exceto no teste do caso base da serpentina, onde a partição esperada é conhecida e vale fixar.
- Referências: [../../14-AlgoritmoDeBalanceamento.md](../../14-AlgoritmoDeBalanceamento.md), [../../01-Requisitos.md](../../01-Requisitos.md) (RNF06).

## Dependências

**Depende de:**
- [passo3.md](passo3.md)
- [../sprint1/passo5.md](../sprint1/passo5.md)
- [../sprint1/passo6.md](../sprint1/passo6.md)

**Desbloqueia:**
- [passo5.md](passo5.md)
