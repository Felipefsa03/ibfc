# Escrever os testes Feature de Match Days

Fecha a Sprint 3 com cobertura do ciclo criar → visualizar → excluir.

## Objetivo

Criar `tests/Feature/MatchDayTest.php` (Pest) cobrindo criação, listagem, detalhe e exclusão em cascata.

## Contexto

Mesmo racional da Sprint 2: os testes Feature exercitam rota → validação → Controller → banco, usando `MatchDayFactory`/`TeamFactory` da Sprint 1. A verificação da cascata de exclusão é o cenário mais importante — é a garantia automatizada da RN15.

## Pré-requisitos

- [passo6.md](passo6.md) concluído.
- [../sprint1/passo6.md](../sprint1/passo6.md) concluído (factories).

## Arquivos que serão criados

- `tests/Feature/MatchDayTest.php`

## Arquivos que serão modificados

- Nenhum.

## O que implementar

Cenários mínimos:
1. Rotas de match-days exigem autenticação.
2. Criação válida persiste e redireciona para o show.
3. Criação inválida: `number_of_teams = 1` rejeitado; campos obrigatórios ausentes rejeitados.
4. Dois Match Days na mesma data são permitidos.
5. Index lista ordenado por data desc.
6. Show carrega o dia com times e estatísticas aninhados (montar cenário com factories + vínculos manuais).
7. Exclusão remove em cascata: criar dia com time, escalação e uma estatística; deletar; asserir que `teams`, `team_players` e `player_day_stats` associados sumiram e que os `players` **permanecem**.

## Regras de negócio envolvidas

- RN05, RN15 (e indiretamente RN06 pela entrega de jogadores ativos no create/show).

## Fluxo

```
Pest + RefreshDatabase
    ↓
Factories montam dia completo (dia → time → escalação → estatística)
    ↓
Requisições simuladas + asserções de banco
```

## Critérios de aceite

- ☐ Todos os cenários passando (`php artisan test --compact --filter=MatchDay`).
- ☐ Cenário de cascata confirma preservação dos jogadores.
- ☐ Suíte completa verde.

## Observações

- **Boas práticas**: extrair um helper local de teste que monta "um dia completo" — será reutilizado nas Sprints 4–7.
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md), [../../08-Relacionamentos.md](../../08-Relacionamentos.md).

## Dependências

**Depende de:**
- [passo6.md](passo6.md)
- [../sprint1/passo6.md](../sprint1/passo6.md)

**Desbloqueia:**
- [../sprint4/passo1.md](../sprint4/passo1.md)
