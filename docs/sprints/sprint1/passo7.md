# Criar o seeder de jogadores de exemplo

Popular o banco de desenvolvimento com jogadores realistas para que as telas das próximas sprints possam ser construídas e testadas visualmente com dados.

## Objetivo

Atualizar o `DatabaseSeeder` para criar um conjunto de jogadores de demonstração (ex.: 20 jogadores, incluindo alguns goleiros e alguns inativos).

## Contexto

Sem dados de exemplo, cada desenvolvedor teria que cadastrar jogadores manualmente para ver qualquer listagem funcionando. O seeder usa a `PlayerFactory` ([passo5.md](passo5.md)) para gerar um elenco variado, refletindo o cenário real da associação: maioria de jogadores de linha ativos, 2–4 goleiros, 1–2 inativos.

## Pré-requisitos

- [passo5.md](passo5.md) concluído (PlayerFactory disponível).

## Arquivos que serão criados

- Nenhum obrigatório (a lógica pode viver no `DatabaseSeeder`). Opcionalmente, `database/seeders/PlayerSeeder.php` dedicado, chamado pelo `DatabaseSeeder` — preferível para organização.

## Arquivos que serão modificados

- `database/seeders/DatabaseSeeder.php` — manter a criação do usuário administrador ([passo4.md](passo4.md)) e adicionar a chamada ao seeding de jogadores.

## O que implementar

1. Criar (idealmente em um `PlayerSeeder`) a geração de: ~14 jogadores de linha ativos, ~3 goleiros (`goalkeeper()`), ~2 inativos (`inactive()`).
2. Registrar o seeder no `DatabaseSeeder`.
3. Executar `php artisan db:seed` e conferir os dados criados.

## Regras de negócio envolvidas

- RN01 (dados válidos, herdado da factory). O seeder não introduz regra própria — apenas volume e variedade.

## Fluxo

```
php artisan db:seed
    ↓
DatabaseSeeder
    ↓
PlayerSeeder → PlayerFactory (x N, com estados variados)
    ↓
Banco populado com elenco de demonstração
```

## Critérios de aceite

- ☐ `php artisan migrate:fresh --seed` executa sem erro do zero.
- ☐ ~20 jogadores criados, com goleiros e inativos entre eles.
- ☐ Usuário administrador continua sendo criado.
- ☐ Rodar o seed duas vezes não quebra (ou o seeder é claramente documentado como "apenas em banco fresh").

## Observações

- **Boas práticas**: seeders de demonstração devem ser idempotentes ou explicitamente destinados a `migrate:fresh --seed` — deixar isso claro em comentário PHPDoc do seeder.
- **Armadilha**: não usar o seeder para dados obrigatórios de produção (não há nenhum neste sistema); ele é ferramenta de desenvolvimento.
- Referências: [../../04-EstruturaDoProjeto.md](../../04-EstruturaDoProjeto.md), [../../18-FluxoCompleto.md](../../18-FluxoCompleto.md).

## Dependências

**Depende de:**
- [passo5.md](passo5.md)

**Desbloqueia:**
- [../sprint2/passo4.md](../sprint2/passo4.md) (listagem com dados reais para desenvolver a UI)
