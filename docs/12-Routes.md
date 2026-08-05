# 12 — Routes

Todas as rotas de negócio ficam em `routes/web.php` e exigem o middleware `auth` (Breeze), exceto login/registro. Hoje o arquivo contém apenas:

```php
Route::inertia('/', 'welcome')->name('home');
```

## 1. Rotas propostas

| Método | URI | Nome | Controller@Ação | Middleware |
|---|---|---|---|---|
| GET | `/players` | `players.index` | `PlayerController@index` | `auth` |
| GET | `/players/create` | `players.create` | `PlayerController@create` | `auth` |
| POST | `/players` | `players.store` | `PlayerController@store` | `auth` |
| GET | `/players/{player}/edit` | `players.edit` | `PlayerController@edit` | `auth` |
| PUT | `/players/{player}` | `players.update` | `PlayerController@update` | `auth` |
| DELETE | `/players/{player}` | `players.destroy` | `PlayerController@destroy` | `auth` |
| GET | `/match-days` | `match-days.index` | `MatchDayController@index` | `auth` |
| GET | `/match-days/create` | `match-days.create` | `MatchDayController@create` | `auth` |
| POST | `/match-days` | `match-days.store` | `MatchDayController@store` | `auth` |
| GET | `/match-days/{matchDay}` | `match-days.show` | `MatchDayController@show` | `auth` |
| DELETE | `/match-days/{matchDay}` | `match-days.destroy` | `MatchDayController@destroy` | `auth` |
| POST | `/match-days/{matchDay}/teams` | `match-days.teams.store` | `TeamController@store` | `auth` |
| PUT | `/match-days/{matchDay}/teams` | `match-days.teams.update` | `TeamController@update` (regenerar) | `auth` |
| PUT | `/match-days/{matchDay}/players/{player}/stats` | `match-days.stats.update` | `PlayerDayStatController@update` | `auth` |
| POST | `/match-days/{matchDay}/close` | `match-days.close` | `MatchDayController@close` | `auth` |
| GET | `/stats` | `stats.index` | `StatsController@index` | `auth` |

## 2. Convenções

- Nomes de rota em `kebab-case` no plural para recursos (`match-days`, `players`), seguindo a convenção padrão do Laravel para rotas resourceful.
- Ações que não são CRUD puro (gerar times, encerrar dia, registrar estatística de um jogador específico) são sub-recursos aninhados sob `match-days/{matchDay}/...`, deixando explícito o contexto pai.
- Uso de **route model binding** implícito (`{player}`, `{matchDay}`) para que o Laravel resolva automaticamente a instância do Model a partir do ID na URL.
- Rotas de escrita (`POST`/`PUT`/`DELETE`) sempre com o Form Request correspondente tipado no método do Controller.
- O frontend nunca deve hardcodar essas URIs — usar as funções tipadas geradas pelo **Wayfinder** (`resources/js/actions`/`resources/js/routes`), ver [13-Views.md](13-Views.md).

## 3. Registro sugerido em `routes/web.php`

```php
Route::middleware('auth')->group(function () {
    Route::resource('players', PlayerController::class)->except(['show']);

    Route::resource('match-days', MatchDayController::class)->except(['edit', 'update']);
    Route::post('match-days/{matchDay}/teams', [TeamController::class, 'store'])->name('match-days.teams.store');
    Route::put('match-days/{matchDay}/teams', [TeamController::class, 'update'])->name('match-days.teams.update');
    Route::put('match-days/{matchDay}/players/{player}/stats', [PlayerDayStatController::class, 'update'])->name('match-days.stats.update');
    Route::post('match-days/{matchDay}/close', [MatchDayController::class, 'close'])->name('match-days.close');

    Route::get('stats', [StatsController::class, 'index'])->name('stats.index');
});
```

(Apresentado aqui como referência de estrutura — a implementação efetiva faz parte das próximas sprints, ver [19-Roadmap.md](19-Roadmap.md).)
