# Criar o StorePlayerRequest

Toda entrada de dados que grava no banco passa por um Form Request dedicado. Este passo cria a validação do cadastro de jogador.

## Objetivo

Criar `app/Http/Requests/StorePlayerRequest.php` com todas as regras de validação do cadastro de jogador (RN01/RN04).

## Contexto

A arquitetura do projeto ([../../03-ArquiteturaMVC.md](../../03-ArquiteturaMVC.md), seção 5) proíbe validação inline no Controller. O Form Request centraliza as regras e é injetado por type-hint no método `store` do futuro `PlayerController` ([passo5.md](passo5.md)). Criá-lo primeiro permite escrever e revisar as regras de validação isoladamente.

## Pré-requisitos

- [../sprint1/passo2.md](../sprint1/passo2.md) concluído (tabela `players` existe — necessária para a regra de unicidade de apelido).

## Arquivos que serão criados

- `app/Http/Requests/StorePlayerRequest.php` (gerar com `php artisan make:request StorePlayerRequest --no-interaction`).

## Arquivos que serão modificados

- Nenhum.

## O que implementar

Regras de validação (método `rules()`):
- `name`: obrigatório, string, tamanho máximo razoável (ex.: 255).
- `nickname`: opcional (nullable), string; **único entre jogadores ativos** (unicidade condicional — usar a regra `unique` com escopo `where active = true`, conforme RN04).
- `gol`, `sho`, `pas`, `dri`, `def`, `phy`: obrigatórios, inteiros, entre 0 e 99 (RN01).
- **Não aceitar** `overall_base`, `current_overall` nem `active` do usuário — esses campos são derivados/definidos pelo sistema (RN01/RN02); simplesmente não incluí-los nas rules e não repassá-los ao Model.

Método `authorize()`: retornar `true` (todo usuário autenticado é Administrador — ator único, [../../17-CasosDeUso.md](../../17-CasosDeUso.md)).

Mensagens de erro: personalizar em português para os campos de atributo (o usuário final é brasileiro).

## Regras de negócio envolvidas

- RN01 — cadastro de jogador (obrigatoriedade e faixas).
- RN04 — duplicidade de apelido entre ativos.

## Fluxo

```
Formulário React (Players/Create)
    ↓
POST /players
    ↓
StorePlayerRequest::rules() valida
    ↓
Inválido → erros voltam ao formulário (Inertia)
Válido   → PlayerController@store recebe dados limpos
```

## Critérios de aceite

- ☐ Request criado em `app/Http/Requests/`.
- ☐ Todas as regras acima presentes, incluindo unicidade condicional do apelido.
- ☐ `overall_base`/`current_overall`/`active` ausentes das rules.
- ☐ Mensagens de validação em português.
- ☐ `vendor/bin/pint --dirty` sem pendências.

## Observações

- **Armadilha**: a unicidade de `nickname` é **apenas entre ativos** — um apelido de jogador inativado pode ser reutilizado. Usar `unique` simples (sem o escopo) quebraria esse cenário.
- **Boas práticas**: tipos de retorno explícitos; array shape no PHPDoc de `rules()` (convenção do projeto, [CLAUDE.md](../../../CLAUDE.md)).
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) (RN01/RN04), [../../03-ArquiteturaMVC.md](../../03-ArquiteturaMVC.md) (seção 5), [../../11-Controllers.md](../../11-Controllers.md).

## Dependências

**Depende de:**
- [../sprint1/passo2.md](../sprint1/passo2.md)

**Desbloqueia:**
- [passo5.md](passo5.md)
- [passo6.md](passo6.md) (o UpdatePlayerRequest seguirá o mesmo padrão)
