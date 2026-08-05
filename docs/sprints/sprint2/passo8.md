# Escrever os testes Feature do CRUD de jogadores

Sela a sprint: cobertura automatizada de todo o ciclo de vida do jogador.

## Objetivo

Criar `tests/Feature/PlayerCrudTest.php` (Pest) cobrindo listagem, criação, edição e remoção, incluindo os casos de erro.

## Contexto

Os testes de Feature exercitam o fluxo HTTP completo (rota → Form Request → Controller → banco) usando as factories da Sprint 1. Eles são o critério objetivo de "pronto" da sprint e a rede de proteção para as sprints futuras, que mexerão nos mesmos Models.

## Pré-requisitos

- [passo7.md](passo7.md) concluído (CRUD completo).
- [../sprint1/passo5.md](../sprint1/passo5.md) concluído (PlayerFactory).

## Arquivos que serão criados

- `tests/Feature/PlayerCrudTest.php` (via `php artisan make:test --pest PlayerCrudTest`).

## Arquivos que serão modificados

- Nenhum (se algum teste revelar bug, corrigir no passo correspondente antes de fechar este).

## O que implementar

Cenários mínimos (todos autenticados, exceto o primeiro):
1. Visitante não autenticado é redirecionado para login em `/players`.
2. Listagem retorna jogadores; filtro `active` e busca por nome/apelido funcionam.
3. Criação válida: jogador persiste com `overall_base` correto (média dos atributos) e `current_overall` igual ao base.
4. Criação inválida: sem nome; atributo fora de 0–99; apelido duplicado entre ativos → erros de validação, nada persiste.
5. Apelido de jogador inativo pode ser reutilizado (unicidade só entre ativos).
6. Edição: atributos alterados recalculam base; `current_overall` intocado; unique ignora o próprio registro.
7. Remoção: jogador com estatística/escalação é inativado (registro continua no banco); jogador sem vínculos é apagado.
8. Tentativa de mass assignment de `current_overall` no POST é ignorada.

## Regras de negócio envolvidas

- RN01, RN02, RN03, RN04 — todas verificadas por teste.

## Fluxo

```
Pest (SQLite em memória + RefreshDatabase)
    ↓
Factories montam cenário
    ↓
Requisições HTTP simuladas (get/post/put/delete)
    ↓
Asserções de resposta + estado do banco
```

## Critérios de aceite

- ☐ Todos os cenários acima implementados e passando (`php artisan test --compact --filter=PlayerCrud`).
- ☐ Testes usam factories (nunca criação manual repetitiva).
- ☐ Suíte completa do projeto verde.
- ☐ Nenhum teste depende de ordem de execução.

## Observações

- **Boas práticas**: seguir a sintaxe Pest (`it()`/`expect()`); um comportamento por teste; nomes descritivos em linguagem de negócio.
- **Armadilha**: o cenário 7 exige criar vínculos manualmente (um `TeamPlayer` ou `PlayerDayStat` mínimo) — montar via Models direto no teste, já que a UI dessas entidades ainda não existe.
- Referências: [../../01-Requisitos.md](../../01-Requisitos.md) (RNF06), [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md).

## Dependências

**Depende de:**
- [passo7.md](passo7.md)
- [../sprint1/passo5.md](../sprint1/passo5.md)

**Desbloqueia:**
- [../sprint3/passo1.md](../sprint3/passo1.md) (sprint seguinte parte de uma base testada)
