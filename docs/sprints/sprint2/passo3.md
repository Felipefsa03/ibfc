# Criar o PlayerController com a action index e as rotas de players

Primeiro Controller de domínio do projeto: a porta de entrada da área de Jogadores.

## Objetivo

Criar `app/Http/Controllers/PlayerController.php` com a action `index` funcional e registrar o resource de rotas `players.*` em `routes/web.php`, protegido por `auth`.

## Contexto

Seguindo o padrão REST resourceful ([../../11-Controllers.md](../../11-Controllers.md)), o `PlayerController` concentrará todo o CRUD de jogadores. Este passo cria o Controller com a primeira action (`index` — listagem) e já registra o `Route::resource` completo (as demais actions são preenchidas nos passos seguintes). Registrar as rotas cedo permite que o Wayfinder gere as funções TypeScript tipadas que o frontend usará.

## Pré-requisitos

- [../sprint1/passo4.md](../sprint1/passo4.md) concluído (middleware `auth` funcional).

## Arquivos que serão criados

- `app/Http/Controllers/PlayerController.php` (via `php artisan make:controller PlayerController --no-interaction`).

## Arquivos que serão modificados

- `routes/web.php` — grupo `Route::middleware('auth')` com `Route::resource('players', PlayerController::class)->except(['show'])` ([../../12-Routes.md](../../12-Routes.md)).
- `resources/js/layouts/AppLayout.tsx` — adicionar o item "Jogadores" na navegação, apontando para a rota `players.index` via Wayfinder.

## O que implementar

1. Action `index`: buscar jogadores com filtro opcional por status (`active`) e busca textual por nome/apelido (query params); ordenar por nome; retornar `Inertia::render('Players/Index', [...])` com a lista e os filtros aplicados.
2. Usar o scope `active()` no Model `Player` — **criar o scope neste passo** (`scopeActive`), conforme [../../10-Models.md](../../10-Models.md).
3. Selecionar apenas as colunas necessárias para a listagem (id, name, nickname, current_overall, active) — não vazar colunas à toa ([../../11-Controllers.md](../../11-Controllers.md), seção 7).
4. Registrar as rotas e rodar a geração do Wayfinder (build do Vite) para disponibilizar as funções tipadas.

## Regras de negócio envolvidas

- RF04 — listagem com filtro ativo/inativo e busca ([../../01-Requisitos.md](../../01-Requisitos.md)).

## Fluxo

```
Usuário autenticado
    ↓
GET /players (?search=...&status=...)
    ↓
Route players.index → PlayerController@index
    ↓
Player::query() + scope active/busca
    ↓
Inertia::render('Players/Index', props)
    ↓
Página React (criada no passo4)
```

## Critérios de aceite

- ☐ Controller criado; action `index` implementada.
- ☐ Rotas `players.*` registradas sob `auth` (`php artisan route:list --name=players` confere).
- ☐ Scope `Player::active()` criado no Model.
- ☐ Acesso sem login redireciona para `/login`.
- ☐ Wayfinder gerou as funções de rota (arquivos em `resources/js/actions`/`routes` atualizados no build).
- ☐ Pint e Larastan sem erros novos.

## Observações

- **Armadilha**: enquanto a página `Players/Index.tsx` não existir ([passo4.md](passo4.md)), acessar a rota renderizará erro de página Inertia inexistente — aceitável temporariamente; os dois passos podem ser desenvolvidos em sequência imediata.
- **Boas práticas**: filtros chegam como query params e voltam como props, para a página poder refletir o estado do filtro na UI.
- Referências: [../../11-Controllers.md](../../11-Controllers.md), [../../12-Routes.md](../../12-Routes.md), [../../10-Models.md](../../10-Models.md).

## Dependências

**Depende de:**
- [../sprint1/passo4.md](../sprint1/passo4.md)

**Desbloqueia:**
- [passo4.md](passo4.md)
- [passo5.md](passo5.md)
- [passo6.md](passo6.md)
- [passo7.md](passo7.md)
