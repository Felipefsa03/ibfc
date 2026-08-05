# 13 — Views

## 1. Stack de apresentação

As "Views" deste projeto são componentes **React** renderizados via **Inertia.js**, não templates Blade. `resources/views/app.blade.php` existe apenas como o shell HTML raiz (onde o Inertia injeta o app React) — ele não contém HTML de negócio.

## 2. Estrutura de páginas

```
resources/js/
├── app.tsx                 # bootstrap: cria a instância Inertia + monta o React
├── layouts/
│   └── AppLayout.tsx       # layout com header/menu, usado por todas as páginas autenticadas
├── pages/
│   ├── welcome.tsx         # já existe (landing padrão do starter kit)
│   ├── Players/
│   │   ├── Index.tsx       # lista de jogadores
│   │   ├── Create.tsx      # formulário de novo jogador
│   │   └── Edit.tsx        # formulário de edição
│   ├── MatchDays/
│   │   ├── Index.tsx       # histórico de dias de jogo
│   │   ├── Create.tsx      # criação de match day + seleção de jogadores
│   │   └── Show.tsx        # detalhe: times formados, lançamento de estatísticas
│   └── Stats/
│       └── Index.tsx       # rankings
├── components/
│   ├── PlayerCard.tsx
│   ├── TeamCard.tsx
│   ├── PlayerForm.tsx
│   └── StatBadge.tsx
└── types/
    └── index.ts             # tipos TS compartilhados (Player, MatchDay, Team, etc.)
```

Cada página corresponde 1:1 a um método de Controller que faz `Inertia::render('<Caminho>', [...])` (ver [04-EstruturaDoProjeto.md](04-EstruturaDoProjeto.md) e [11-Controllers.md](11-Controllers.md)).

## 3. Layout compartilhado

Um layout (`AppLayout.tsx`) envolve as páginas autenticadas, provendo cabeçalho, menu de navegação (Jogadores / Dias de Jogo / Estatísticas) e área de conteúdo. Páginas usam o layout via a convenção de "persistent layouts" do Inertia:

```tsx
Players/Index.tsx
  export default function Index({ players }: Props) { ... }
  Index.layout = (page) => <AppLayout>{page}</AppLayout>
```

## 4. Componentes reutilizáveis

- `PlayerCard` — exibe nome/apelido/overall de um jogador (usado nas listagens e na visualização de times).
- `TeamCard` — exibe um time formado, seus jogadores (`PlayerCard` cada) e o overall total do time.
- `PlayerForm` — formulário compartilhado entre `Create.tsx` e `Edit.tsx` de jogador, evitando duplicação de campos.
- `StatBadge` — badge visual para gols/assistências/vitórias nas telas de estatística.

## 5. Estilização

TailwindCSS v4 é usado para toda a estilização — classes utilitárias diretamente no JSX, sem CSS customizado extenso. Componentes devem ser responsivos por padrão (mobile-first), já que o uso típico é em campo, pelo celular, no dia do jogo (RNF02, [01-Requisitos.md](01-Requisitos.md)).

## 6. Comunicação com o backend (Wayfinder)

Formulários e ações usam as funções TypeScript **geradas automaticamente pelo Wayfinder** a partir das rotas/Controllers do backend, em vez de strings de URL hardcoded:

```tsx
import { store } from '@/actions/App/Http/Controllers/PlayerController';
import { useForm } from '@inertiajs/react';

const form = useForm({ name: '', nickname: '', gol: 0, sho: 0, pas: 0, dri: 0, def: 0, phy: 0 });

function submit() {
  form.post(store.url());
}
```

Isso garante que, se uma rota mudar no backend, o frontend quebra em tempo de build (erro de tipo), não silenciosamente em produção.

## 7. Organização geral

- Uma página por ação de Controller — nunca uma página "genérica" que decide o que renderizar via prop `mode`.
- Lógica de apresentação (formatação de data, badge de cor por status) fica em componentes/helpers no frontend; lógica de negócio (cálculo de overall, regras de balanceamento) nunca é replicada em JS — sempre vem pronta do backend via props.
- Estados vazios (nenhum jogador cadastrado, nenhum Match Day ainda) devem ter uma mensagem/CTA clara, não uma tela em branco.
