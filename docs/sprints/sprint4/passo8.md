# Testes Feature da geração de times

Fecha a Sprint 4: o fluxo HTTP completo de gerar e regenerar times, com as travas de negócio.

## Objetivo

Criar `tests/Feature/TeamGenerationTest.php` (Pest) cobrindo o endpoint de geração, a persistência e as travas.

## Contexto

Os testes unitários ([passo4.md](passo4.md)) já garantem o algoritmo; aqui o foco é a camada HTTP: validação do request, persistência transacional, bloqueios. Cenários montados com as factories e o helper "dia completo" criado nos testes da Sprint 3.

## Pré-requisitos

- [passo6.md](passo6.md) e [passo7.md](passo7.md) concluídos.
- [../sprint1/passo6.md](../sprint1/passo6.md) (factories).

## Arquivos que serão criados

- `tests/Feature/TeamGenerationTest.php`

## Arquivos que serão modificados

- Nenhum.

## O que implementar

Cenários mínimos:
1. Geração válida: POST com ids ativos cria `number_of_teams` times e todas as escalações; cada jogador em exatamente um time.
2. Validação: id inexistente, jogador inativo, ids duplicados, menos ids que `number_of_teams` → rejeitados.
3. Segundo POST (dia já com times) → rejeitado.
4. Regeneração (PUT) sem estatísticas → substitui os times (ids de times antigos somem, novos existem).
5. Regeneração com uma estatística lançada → rejeitada; times intocados.
6. Atomicidade indireta: contagens consistentes de `teams`/`team_players` após cada operação.
7. Rotas exigem autenticação.

## Regras de negócio envolvidas

- RN06, RN07, RN10.

## Fluxo

```
Pest + RefreshDatabase
    ↓
Factories: dia + jogadores ativos (com goleiros)
    ↓
POST/PUT simulados → asserções de resposta + estado do banco
```

## Critérios de aceite

- ☐ Os 7 cenários implementados e passando.
- ☐ Asserção "cada jogador em exatamente um time" presente na geração válida.
- ☐ Suíte completa verde (`php artisan test --compact`).

## Observações

- **Boas práticas**: reutilizar o helper de cenário da Sprint 3; nomear os testes pela regra de negócio que protegem (ex.: "regeneração é bloqueada após estatísticas").
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md), [../../17-CasosDeUso.md](../../17-CasosDeUso.md) (UC05).

## Dependências

**Depende de:**
- [passo6.md](passo6.md)
- [passo7.md](passo7.md)
- [../sprint1/passo6.md](../sprint1/passo6.md)

**Desbloqueia:**
- [../sprint5/passo1.md](../sprint5/passo1.md)
