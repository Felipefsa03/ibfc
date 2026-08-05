# Testes unitários da evolução do overall

A fórmula documentada vira contrato executável.

## Objetivo

Ampliar `tests/Unit/OverallCalculatorServiceTest.php` com os cenários de evolução do `current_overall`, incluindo os exemplos numéricos exatos da documentação.

## Contexto

A doc [../../15-CalculoOverall.md](../../15-CalculoOverall.md) (seção 4) traz um exemplo completo de dois dias consecutivos com resultados esperados (54→55 e 55→57). Transformar esses exemplos em testes garante que a implementação e a documentação nunca divirjam silenciosamente.

## Pré-requisitos

- [passo1.md](passo1.md) concluído.

## Arquivos que serão criados

- Nenhum (amplia o teste unitário existente da Sprint 2).

## Arquivos que serão modificados

- `tests/Unit/OverallCalculatorServiceTest.php`

## O que implementar

Cenários mínimos:
1. **Exemplo Dia 1 da doc**: atual 54, base 54, 3 gols + 1 assistência → 55.
2. **Exemplo Dia 2 da doc**: atual 55, base 54, 8 gols + 2 assistências → 57.
3. Sem desempenho (0/0) → overall inalterado.
4. Teto por dia: desempenho absurdo (ex.: 30 gols) nunca adiciona mais que `TETO_BONUS_POR_DIA` pontos.
5. Teto estrutural: jogador já em `base + 15` não sobe mais, mesmo com gols.
6. Aproximação do teto: jogador a 1 ponto do teto estrutural ganha no máximo esse 1 ponto.
7. Assistências valem menos que gols (mesma quantidade → bônus menor).
8. Datasets do Pest para variações de valores (opcional, recomendado).

## Regras de negócio envolvidas

- RN12 — todas as propriedades da evolução (crescimento decrescente, tetos, neutralidade sem desempenho).

## Fluxo

```
Pest Unit (sem banco)
    ↓
Service::recalculate(cenários controlados)
    ↓
Asserções contra os valores documentados
```

## Critérios de aceite

- ☐ Os exemplos numéricos da doc 15 passam com os valores exatos.
- ☐ Cenários de teto (4–6) passando.
- ☐ Suíte completa verde.

## Observações

- **Boas práticas**: comentar nos testes 1–2 que os valores vêm da doc 15 seção 4 — se um dia as constantes mudarem, o desenvolvedor saberá que doc e teste devem mudar juntos.
- Referências: [../../15-CalculoOverall.md](../../15-CalculoOverall.md) (seção 4).

## Dependências

**Depende de:**
- [passo1.md](passo1.md)

**Desbloqueia:**
- [passo3.md](passo3.md)
