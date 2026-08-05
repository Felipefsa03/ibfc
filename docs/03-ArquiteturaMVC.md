# 03 — Arquitetura MVC

## 1. O que é MVC

MVC (**Model-View-Controller**) é um padrão arquitetural que separa uma aplicação em três responsabilidades distintas:

- **Model**: representa os dados e as regras que governam esses dados (validações de domínio, relacionamentos, cálculos).
- **View**: responsável por apresentar os dados ao usuário.
- **Controller**: recebe a requisição, orquestra a busca/gravação de dados via Model, e decide qual View retornar.

## 2. Por que utilizar MVC neste projeto

- É o padrão **nativo e idiomático** do Laravel — todo o ecossistema (rotas, Eloquent, Blade/Inertia, Form Requests) é desenhado em torno dele.
- Separa claramente "o que os dados significam" (Model) de "como apresentar" (View) e "como orquestrar a requisição" (Controller), facilitando manutenção por múltiplos desenvolvedores.
- Para o tamanho e complexidade do IBFC Team Builder (CRUD + algumas regras de negócio bem definidas), MVC puro é suficiente — não há necessidade de arquiteturas mais elaboradas (CQRS, hexagonal, etc.) nesta fase.

## 3. Como o Laravel implementa o MVC (com Inertia)

Este projeto usa **Inertia.js + React** no lugar de Blade como camada de View. Isso é uma decisão importante que precisa ficar clara:

> **Inertia não é uma API REST/JSON separada do frontend.** O Controller continua sendo o único responsável por buscar os dados e "renderizar" a resposta — só que em vez de `return view('players.index', [...])`, ele faz `return Inertia::render('Players/Index', [...])`. O Inertia serializa esses dados como JSON, o cliente JS troca o componente React exibido e re-hidrata a página, sem recarregar o navegador. Para efeitos de arquitetura, o ciclo MVC continua o mesmo — só a tecnologia de renderização final muda.

### Ciclo de uma requisição

```
 Browser
    │  (usuário clica em um link/botão — Inertia intercepta e faz um
    │   fetch via XHR, sem full page reload)
    ▼
 Route (routes/web.php)
    │  resolve qual Controller/Action atende a URL
    ▼
 Controller (app/Http/Controllers/*)
    │  1. Valida a entrada (via Form Request)
    │  2. Consulta/grava dados através do Model (Eloquent)
    │  3. Aplica regra de negócio (diretamente ou via Service)
    ▼
 Model (app/Models/*)
    │  Eloquent traduz para SQL e conversa com o banco
    ▼
 Banco de Dados (MySQL)
    │  retorna as linhas
    ▼
 Model (Eloquent hidrata as Collections/Models)
    ▼
 Controller
    │  monta o payload de dados (props) e chama Inertia::render('Pagina', $props)
    ▼
 Inertia (camada de ponte)
    │  serializa a resposta como JSON (requisições Inertia) ou HTML completo
    │  (primeiro load / refresh de página)
    ▼
 View React (resources/js/pages/*.tsx)
    │  recebe as props e renderiza a UI
    ▼
 Browser (DOM atualizado)
```

## 4. Responsabilidades de cada camada

### Model (`app/Models`)
**Deve conter:**
- Relacionamentos Eloquent (`hasMany`, `belongsTo`, etc.).
- `$fillable`/`$casts`.
- Accessors/mutators simples (ex.: nome de exibição).
- Scopes de consulta reutilizáveis (ex.: `Player::active()`).
- Regras de integridade que fazem sentido "morar" no dado (ex.: um evento/observer que dispara recálculo relacionado ao próprio Model).

**Não deve conter:**
- Lógica de apresentação (formatação de tela).
- Chamadas a `Inertia::render` ou qualquer coisa de HTTP.
- Regras de negócio complexas e multi-entidade (ex.: todo o algoritmo de balanceamento de times) — isso é grande e testável o suficiente para merecer uma classe própria (Service), mesmo que o Model participe dele.

### Controller (`app/Http/Controllers`)
**Deve conter:**
- Recebimento da requisição (via Form Request já validado).
- Orquestração: chamar Models/Services, montar a resposta.
- Decisão de qual página Inertia renderizar ou para onde redirecionar.

**Não deve conter:**
- Queries SQL cruas ou lógica de negócio extensa embutida no método (isso pertence ao Model ou a um Service).
- Validação manual solta (`$request->input('x')` sem Form Request) — sempre usar Form Requests dedicados.
- HTML/JSX ou qualquer formatação de apresentação.

### View (`resources/js/pages/*.tsx`)
**Deve conter:**
- Apresentação dos dados recebidos via props do Inertia.
- Interações de UI (formulários, cliques, navegação) delegando para `router`/`useForm` do Inertia.

**Não deve conter:**
- Regras de negócio (ex.: cálculo de overall não deve ser replicado em JS — o backend é a fonte da verdade).
- Chamadas diretas a banco de dados (óbvio, mas vale reforçar: tudo passa pelo Controller).

## 5. Form Requests e validação

Toda entrada de usuário que grava dados (`store`/`update`) deve passar por uma classe de **Form Request** dedicada (`app/Http/Requests/`), nunca validação inline no Controller. Isso:
- Mantém o Controller enxuto.
- Centraliza as regras de validação em um único lugar por ação.
- Permite reaproveitar regras de autorização (`authorize()`) junto da validação.

Exemplo de convenção de nomenclatura: `StorePlayerRequest`, `UpdatePlayerRequest`, `GenerateTeamsRequest`.

## 6. Services (camada futura)

Regras de negócio que **não pertencem naturalmente a um único Model** — como o algoritmo de balanceamento de times ([14-AlgoritmoDeBalanceamento.md](14-AlgoritmoDeBalanceamento.md)) ou o recálculo de overall pós-Match Day ([15-CalculoOverall.md](15-CalculoOverall.md)) — devem ser extraídas para classes de **Service** (ex.: `app/Services/TeamBalancerService.php`, `app/Services/OverallCalculatorService.php`).

Isso é recomendado porque:
- Facilita testes unitários isolados (sem precisar de uma requisição HTTP completa).
- Evita "Controllers gordos" (Fat Controllers).
- Permite reuso da mesma lógica em mais de um ponto de entrada (ex.: um Controller e um Artisan Command).

Este projeto ainda não possui a pasta `app/Services` — ela deve ser criada quando a primeira dessas regras for implementada (ver [19-Roadmap.md](19-Roadmap.md)).

## 7. Por que **não** usar Repository Pattern (por enquanto)

O Repository Pattern adiciona uma camada de abstração entre o Model e o restante da aplicação, geralmente para permitir trocar a fonte de dados (ex.: banco por uma API externa) sem afetar o resto do sistema.

Neste projeto:
- Há **um único banco de dados** (MySQL) e nenhuma expectativa de trocar de fonte de dados.
- O Eloquent **já é** uma abstração sobre o SQL — adicionar Repository por cima dele, sem um motivo concreto, apenas adiciona indireção e boilerplate sem benefício real.
- CRUD simples via Eloquent (`Player::create()`, `Player::find()`, etc.) é suficiente e idiomático em Laravel.

**Quando reconsiderar**: se no futuro surgir necessidade real de múltiplas fontes de dados, testes que exijam trocar a implementação de persistência, ou regras de consulta extremamente complexas repetidas em muitos lugares, o Repository Pattern pode ser introduzido pontualmente — não como padrão global do projeto.

## 8. Quando o MVC deixa de ser suficiente

MVC puro começa a "doer" quando:
- Um único Controller cresce muito porque a regra de negócio não tem outro lugar para morar → solução: extrair para Services (seção 6).
- A mesma lógica de consulta complexa se repete em vários Controllers → solução: Query Objects ou scopes ricos no Model.
- O sistema precisa de múltiplos formatos de saída (ex.: API pública além do Inertia) → solução: extrair a lógica de Controllers em Actions/Services reutilizáveis por múltiplos "adapters" HTTP.

Nenhum desses cenários existe hoje no IBFC Team Builder, mas a arquitetura descrita aqui (Services isolando regras de negócio) já deixa o caminho aberto para crescer sem reescrita.

## 9. Vantagens e desvantagens do MVC neste contexto

**Vantagens:**
- Curva de aprendizado baixa (padrão universalmente conhecido em Laravel).
- Mapeamento direto com as convenções e ferramentas do framework (rotas resourceful, Form Requests, Eloquent).
- Fácil localizar onde cada responsabilidade vive.

**Desvantagens:**
- Pode incentivar Controllers ou Models "inchados" se a disciplina de extrair Services não for seguida.
- Não separa explicitamente "casos de uso" da infraestrutura HTTP (diferente de arquiteturas mais em camadas) — mitigado aqui pelo uso de Services para regras de negócio centrais.

## 10. SOLID dentro do MVC

- **S (Single Responsibility)**: Controller orquestra, Model representa dado, Service concentra regra de negócio complexa, Form Request valida. Cada classe tem um motivo para mudar.
- **O (Open/Closed)**: novas regras de balanceamento podem ser adicionadas criando novas estratégias/Services sem alterar o Controller que os invoca.
- **L (Liskov Substitution)**: não há hierarquias profundas de herança neste projeto; aplicável principalmente se, no futuro, existirem múltiplas implementações de uma interface de Service (ex.: diferentes estratégias de balanceamento).
- **I (Interface Segregation)**: Form Requests pequenos e específicos por ação, em vez de uma única classe de validação genérica.
- **D (Dependency Inversion)**: Controllers dependem de abstrações (Services injetados via constructor, usando Property Promotion do PHP 8) em vez de instanciar lógica de negócio diretamente.

## 11. Clean Code e convenções do Laravel

- Nomes descritivos: `isPlayerEligibleForMatchDay()`, não `check()`.
- Métodos curtos, um nível de responsabilidade por método.
- Convenção de nomenclatura Laravel: Models no singular (`Player`), tabelas no plural (`players`), Controllers com sufixo `Controller` (`PlayerController`), Form Requests com prefixo do verbo (`StorePlayerRequest`).
- Uso de **type hints e return types explícitos** em todos os métodos (PHP 8.4), conforme padrão do projeto.
- Preferência por **Eloquent expressivo** (`Player::query()->active()->orderByDesc('current_overall')->get()`) em vez de SQL cru.
