# Criar o MatchDayController (index, create, store) e as rotas

A porta de entrada da área "Dias de Jogo".

## Objetivo

Criar `app/Http/Controllers/MatchDayController.php` com `index`, `create` e `store`, registrando as rotas `match-days.*` sob `auth`.

## Contexto

Segue o mesmo padrão estabelecido pelo `PlayerController` na Sprint 2. O `index` lista o histórico de dias (mais recentes primeiro); o `create` entrega, além do formulário, a lista de jogadores ativos — necessária para a seleção de presentes ([passo5.md](passo5.md)); o `store` persiste a configuração do dia.

## Pré-requisitos

- [passo1.md](passo1.md) concluído (Form Request).
- [../sprint1/passo4.md](../sprint1/passo4.md) concluído (auth).

## Arquivos que serão criados

- `app/Http/Controllers/MatchDayController.php`

## Arquivos que serão modificados

- `routes/web.php` — `Route::resource('match-days', MatchDayController::class)->except(['edit', 'update'])` dentro do grupo `auth` ([../../12-Routes.md](../../12-Routes.md); edição de Match Day não é caso de uso — exclusão e recriação cobrem o cenário).
- `resources/js/layouts/AppLayout.tsx` — item "Dias de Jogo" na navegação.

## O que implementar

1. **`index`**: Match Days ordenados por `date` desc, com contagem de times formados (eager loading/withCount para evitar N+1); `Inertia::render('MatchDays/Index', ...)`.
2. **`create`**: `Inertia::render('MatchDays/Create', ['activePlayers' => ...])` — jogadores ativos ordenados por nome, apenas colunas necessárias (id, name, nickname, current_overall, atributo `gol` para sinalizar goleiros na UI).
3. **`store`**: recebe `StoreMatchDayRequest`, cria o `MatchDay`, redireciona para `match-days.show` do registro criado (a tela de detalhe nasce no [passo4.md](passo4.md)).

## Regras de negócio envolvidas

- RN05 (criação), RN06 (a seleção de presentes começa a se materializar aqui com a entrega de `activePlayers`).

## Fluxo

```
Usuário
    ↓
GET /match-days → index (histórico)
GET /match-days/create → create (form + jogadores ativos)
POST /match-days → StoreMatchDayRequest → store
    ↓
Redirect match-days.show/{id}
```

## Critérios de aceite

- ☐ Rotas registradas (`php artisan route:list --name=match-days`).
- ☐ `index` sem N+1 (verificar queries).
- ☐ `create` entrega apenas jogadores ativos.
- ☐ `store` cria e redireciona para o show.
- ☐ Navegação atualizada; Pint/Larastan limpos.

## Observações

- **Armadilha**: o redirect do `store` aponta para uma página que só existirá no [passo4.md](passo4.md) — desenvolver os passos em sequência.
- **Boas práticas**: `withCount('teams')` no index em vez de carregar coleções inteiras.
- Referências: [../../11-Controllers.md](../../11-Controllers.md), [../../12-Routes.md](../../12-Routes.md).

## Dependências

**Depende de:**
- [passo1.md](passo1.md)
- [../sprint1/passo4.md](../sprint1/passo4.md)

**Desbloqueia:**
- [passo3.md](passo3.md)
- [passo4.md](passo4.md)
- [passo6.md](passo6.md)
