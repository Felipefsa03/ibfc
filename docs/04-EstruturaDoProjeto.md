# 04 — Estrutura do Projeto

## 1. Visão geral da árvore de pastas

```
ibfc/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php            # Controller base abstrato (já existe)
│   │   │   ├── PlayerController.php      # a criar
│   │   │   ├── MatchDayController.php    # a criar
│   │   │   └── TeamController.php        # a criar
│   │   ├── Middleware/
│   │   │   └── HandleInertiaRequests.php # já existe (compartilha props globais com o Inertia)
│   │   └── Requests/                     # a criar
│   │       ├── StorePlayerRequest.php
│   │       ├── UpdatePlayerRequest.php
│   │       ├── StoreMatchDayRequest.php
│   │       └── StorePlayerDayStatRequest.php
│   ├── Models/
│   │   ├── Player.php                    # já existe
│   │   ├── MatchDay.php                  # já existe
│   │   ├── Team.php                      # já existe
│   │   ├── TeamPlayer.php                # já existe
│   │   ├── PlayerDayStat.php             # já existe
│   │   └── PlayerSeasonStat.php          # a criar (ver 19-Roadmap.md)
│   ├── Services/                         # a criar
│   │   ├── TeamBalancerService.php       # algoritmo de balanceamento (14-AlgoritmoDeBalanceamento.md)
│   │   └── OverallCalculatorService.php  # recálculo de overall (15-CalculoOverall.md)
│   └── Providers/
│       └── AppServiceProvider.php        # já existe
│
├── database/
│   ├── migrations/                       # já existem as 5 primeiras; falta player_season_stats
│   ├── factories/
│   │   ├── UserFactory.php               # já existe (padrão Laravel)
│   │   ├── PlayerFactory.php             # a criar
│   │   ├── MatchDayFactory.php           # a criar
│   │   └── TeamFactory.php               # a criar
│   └── seeders/
│       └── DatabaseSeeder.php            # já existe (só cria usuário de teste)
│
├── resources/
│   ├── css/
│   │   └── app.css                       # Tailwind entrypoint
│   ├── js/
│   │   ├── app.tsx                       # bootstrap do Inertia/React
│   │   ├── pages/
│   │   │   ├── welcome.tsx               # já existe (página padrão do starter kit)
│   │   │   ├── Players/                  # a criar: Index.tsx, Create.tsx, Edit.tsx
│   │   │   ├── MatchDays/                # a criar: Index.tsx, Create.tsx, Show.tsx
│   │   │   └── Teams/                    # a criar: componentes de exibição de times
│   │   ├── components/                   # a criar: componentes reutilizáveis (PlayerCard, TeamCard, etc.)
│   │   ├── layouts/                      # a criar: AppLayout.tsx (menu, header)
│   │   ├── routes/                       # gerado automaticamente pelo Wayfinder
│   │   ├── actions/                      # gerado automaticamente pelo Wayfinder
│   │   ├── types/                        # tipos TypeScript compartilhados
│   │   └── lib/
│   │       └── utils.ts                  # já existe
│   └── views/
│       └── app.blade.php                 # já existe — shell HTML raiz do Inertia (não é uma "view" de negócio)
│
├── routes/
│   ├── web.php                           # rotas web (hoje só GET / → welcome)
│   └── console.php                       # comandos Artisan agendados
│
├── docs/                                 # esta documentação
├── tests/
│   ├── Feature/                          # testes de fluxo (Controllers, HTTP)
│   └── Unit/                             # testes de regra de negócio isolada (Services)
├── config/
├── public/
└── vendor/ / node_modules/               # dependências instaladas
```

## 2. Explicação de cada pasta relevante

| Pasta | Responsabilidade |
|---|---|
| `app/Http/Controllers` | Orquestra requisições HTTP: recebe input já validado, chama Models/Services, retorna `Inertia::render(...)` ou redirect. |
| `app/Http/Requests` | Uma classe por ação de escrita, contendo regras de validação (`rules()`) e autorização (`authorize()`). |
| `app/Http/Middleware` | Código que roda antes/depois de uma requisição chegar ao Controller (ex.: `HandleInertiaRequests` injeta dados compartilhados como o usuário autenticado em toda página). |
| `app/Models` | Entidades Eloquent — mapeiam tabelas do banco e seus relacionamentos. |
| `app/Services` | Regras de negócio que atravessam múltiplos Models ou são complexas demais para viver em um Controller/Model (balanceamento de times, cálculo de overall). |
| `database/migrations` | Histórico versionado da estrutura do banco de dados. |
| `database/factories` | Geração de dados fake para testes e seeders (`Player::factory()->create()`). |
| `database/seeders` | Povoamento inicial/de demonstração do banco. |
| `resources/js/pages` | Uma página React por rota Inertia — o equivalente às Views do Blade tradicional. |
| `resources/js/components` | Componentes de UI reutilizáveis entre páginas (tabelas, cards, formulários). |
| `resources/js/layouts` | Layouts compartilhados (cabeçalho, menu de navegação) que envolvem as páginas. |
| `resources/js/routes` e `resources/js/actions` | Gerados automaticamente pelo Wayfinder a partir das rotas/Controllers do backend — nunca editados manualmente. |
| `routes/web.php` | Declaração de todas as rotas web da aplicação (ver [12-Routes.md](12-Routes.md)). |
| `tests/Feature` | Testa o comportamento fim-a-fim de uma rota/Controller (ex.: "POST /players cria um jogador"). |
| `tests/Unit` | Testa uma classe isolada, tipicamente um Service (ex.: "TeamBalancerService distribui 10 jogadores em 2 times equilibrados"). |

## 3. Convenção de nomenclatura de páginas Inertia

Cada página React fica em `resources/js/pages/<Entidade>/<Ação>.tsx`, espelhando o Controller correspondente:

```
PlayerController@index   → resources/js/pages/Players/Index.tsx
PlayerController@create  → resources/js/pages/Players/Create.tsx
PlayerController@edit    → resources/js/pages/Players/Edit.tsx
MatchDayController@show  → resources/js/pages/MatchDays/Show.tsx
```

O Controller chama `Inertia::render('Players/Index', [...])` usando exatamente esse caminho (relativo a `resources/js/pages`, sem extensão).

## 4. Regra geral

Não criar pastas novas na raiz do projeto sem necessidade clara — seguir a estrutura padrão do Laravel descrita acima. Qualquer nova pasta de domínio (ex.: `app/Services`) deve ser criada apenas quando a primeira classe que a ocupa for efetivamente implementada.
