# Testes Feature do encerramento do dia

Fecha a Sprint 6: consolidação e imutabilidade cobertas de ponta a ponta.

## Objetivo

Criar `tests/Feature/MatchDayCloseTest.php` (Pest) cobrindo o encerramento, o recálculo de overall e as travas de imutabilidade.

## Contexto

É o teste de integração mais importante até aqui: verifica que a fórmula (já garantida unitariamente) é aplicada às pessoas certas, na hora certa, de forma atômica e irreversível.

## Pré-requisitos

- [passo4.md](passo4.md) concluído.

## Arquivos que serão criados

- `tests/Feature/MatchDayCloseTest.php`

## Arquivos que serão modificados

- Nenhum.

## O que implementar

Cenários mínimos:
1. Encerramento recalcula o overall dos escalados com estatística (valores esperados calculáveis pelos exemplos da doc 15).
2. Escalado **sem** estatística lançada mantém o overall (e o dia fecha normalmente).
3. Jogador não escalado no dia não muda.
4. `closed_at` preenchido após o close.
5. Encerrar dia já encerrado → rejeitado.
6. Encerrar dia sem nenhuma estatística → rejeitado (validação de intenção).
7. Pós-encerramento: lançamento de estatística, resultado de time e regeneração todos rejeitados.
8. Dias distintos são independentes (fechar um não afeta o outro).

## Regras de negócio envolvidas

- RN08, RN12, RN07 (trava), e o contrato de imutabilidade.

## Fluxo

```
Helper: dia completo com stats conhecidos
    ↓
POST close
    ↓
Asserções: overalls novos, closed_at, travas ativas
```

## Critérios de aceite

- ☐ Os 8 cenários implementados e passando.
- ☐ Valores de overall asseridos numericamente (não só "mudou").
- ☐ Suíte completa verde.

## Observações

- **Boas práticas**: fixar overalls/atributos dos jogadores de teste (sem aleatoriedade da factory nos campos que entram na fórmula) para asserções numéricas estáveis.
- Referências: [../../15-CalculoOverall.md](../../15-CalculoOverall.md), [../../17-CasosDeUso.md](../../17-CasosDeUso.md) (UC07).

## Dependências

**Depende de:**
- [passo4.md](passo4.md)

**Desbloqueia:**
- [../sprint7/passo1.md](../sprint7/passo1.md)
