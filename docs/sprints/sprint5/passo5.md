# Testes Feature das estatísticas do dia

Fecha a Sprint 5: lançamento individual e resultado por time cobertos.

## Objetivo

Criar `tests/Feature/PlayerDayStatTest.php` (Pest) cobrindo o upsert de estatísticas e o registro de resultado de time.

## Contexto

Os cenários exercitam a cadeia completa: dia com times gerados → lançamentos → asserções de unicidade e valores. Reuso do helper "dia completo" das sprints anteriores.

## Pré-requisitos

- [passo3.md](passo3.md) e [passo4.md](passo4.md) concluídos.

## Arquivos que serão criados

- `tests/Feature/PlayerDayStatTest.php`

## Arquivos que serão modificados

- Nenhum.

## O que implementar

Cenários mínimos:
1. Lançamento válido cria o registro com os valores enviados.
2. Segundo lançamento do mesmo jogador/dia **atualiza** o registro existente (contagem na tabela não cresce).
3. Valores negativos rejeitados.
4. Jogador não escalado no dia rejeitado.
5. Jogador escalado em **outro** dia rejeitado para este dia.
6. Resultado de time: score salvo; `won` marcado/desmarcado; score negativo rejeitado.
7. Rotas exigem autenticação.

## Regras de negócio envolvidas

- RN09, RN10.

## Fluxo

```
Pest + RefreshDatabase
    ↓
Helper monta dia com times/escalações
    ↓
PUTs simulados → asserções de banco (unicidade, valores)
```

## Critérios de aceite

- ☐ Os 7 cenários implementados e passando.
- ☐ Asserção explícita de não-duplicação no cenário 2.
- ☐ Suíte completa verde.

## Observações

- **Boas práticas**: cenário 2 é o coração do modelo de dados — nomeá-lo pela regra ("um registro por jogador por dia").
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) (RN09/RN10).

## Dependências

**Depende de:**
- [passo3.md](passo3.md)
- [passo4.md](passo4.md)

**Desbloqueia:**
- [../sprint6/passo1.md](../sprint6/passo1.md)
