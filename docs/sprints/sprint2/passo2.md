# Criar o cálculo do overall base (OverallCalculatorService — parte 1)

O `overall_base` nunca é digitado pelo usuário: é derivado dos 6 atributos táticos. Este passo cria o Service que faz esse cálculo.

## Objetivo

Criar `app/Services/OverallCalculatorService.php` com a responsabilidade de calcular o `overall_base` a partir dos atributos de um jogador.

## Contexto

A fórmula pertence a um Service ([../../15-CalculoOverall.md](../../15-CalculoOverall.md), seção 6) — não ao Controller nem ao Model — porque é regra de negócio testável isoladamente e será expandida na Sprint 6 (evolução do `current_overall`). Nesta sprint, o Service nasce apenas com o cálculo do base: média ponderada dos atributos `gol`, `sho`, `pas`, `dri`, `def`, `phy` (pesos iguais na configuração inicial → média aritmética arredondada). Esta é a **primeira classe da pasta `app/Services`**, que deve ser criada agora.

## Pré-requisitos

- [../sprint1/passo2.md](../sprint1/passo2.md) concluído.

## Arquivos que serão criados

- `app/Services/OverallCalculatorService.php` (via `php artisan make:class Services/OverallCalculatorService --no-interaction`).
- `tests/Unit/OverallCalculatorServiceTest.php` (teste unitário Pest do cálculo base — `php artisan make:test --pest --unit OverallCalculatorServiceTest`).

## Arquivos que serão modificados

- Nenhum.

## O que implementar

1. Método público (ex.: `calculateBase`) que recebe os 6 atributos (ou um value object/array tipado) e retorna o overall base inteiro: soma ponderada dividida pela soma dos pesos, arredondada.
2. Pesos definidos como constantes da classe (todos `1` inicialmente), para que um ajuste futuro de pesos seja uma mudança em um único lugar, sem tocar na assinatura.
3. Testes unitários: o exemplo numérico da documentação (atributos 10/70/65/68/40/72 → base 54), caso de todos os atributos iguais, caso de extremos (todos 0 → 0; todos 99 → 99).

## Regras de negócio envolvidas

- RN01 — `overall_base` calculado automaticamente no cadastro.
- RN11 — fórmula do overall base ([../../15-CalculoOverall.md](../../15-CalculoOverall.md), seção 2).

## Fluxo

```
PlayerController@store (futuro)
    ↓
OverallCalculatorService::calculateBase(atributos)
    ↓
Retorna inteiro 0–99
    ↓
Gravado em players.overall_base (e current_overall na criação)
```

## Critérios de aceite

- ☐ Pasta `app/Services` criada com a classe.
- ☐ Método com type hints e return type explícitos.
- ☐ Pesos como constantes, não números mágicos espalhados.
- ☐ Testes unitários passando (`php artisan test --compact --filter=OverallCalculatorService`), incluindo o exemplo da doc 15.
- ☐ Pint sem pendências.

## Observações

- **Armadilha**: manter o arredondamento idêntico ao documentado (arredondamento matemático padrão) — testes da doc dependem disso.
- **Boas práticas**: o Service não deve tocar no banco neste passo (recebe valores, retorna valor) — isso o mantém puro e trivialmente testável.
- Referências: [../../15-CalculoOverall.md](../../15-CalculoOverall.md) (seções 2 e 6), [../../03-ArquiteturaMVC.md](../../03-ArquiteturaMVC.md) (seção 6).

## Dependências

**Depende de:**
- [../sprint1/passo2.md](../sprint1/passo2.md)

**Desbloqueia:**
- [passo5.md](passo5.md)
- [passo6.md](passo6.md)
- [../sprint6/passo1.md](../sprint6/passo1.md) (a evolução do current_overall estende este mesmo Service)
