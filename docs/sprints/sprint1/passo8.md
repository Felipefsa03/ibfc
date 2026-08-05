# Criar o layout base da aplicação (AppLayout)

Todas as páginas autenticadas compartilham o mesmo esqueleto visual: cabeçalho, menu de navegação e área de conteúdo. Este passo cria esse esqueleto uma única vez.

## Objetivo

Criar `resources/js/layouts/AppLayout.tsx` com navegação para as três áreas do sistema (Jogadores, Dias de Jogo, Estatísticas) e informações do usuário logado (nome + logout).

## Contexto

O padrão de "persistent layouts" do Inertia ([../../13-Views.md](../../13-Views.md), seção 3) evita repetir header/menu em cada página. Criá-lo antes das telas de negócio garante que toda página nasça já dentro do layout, em vez de retrofit depois. Os links do menu apontarão para rotas que ainda não existem — devem ser adicionados progressivamente conforme cada sprint entrega suas rotas (nesta sprint, apenas a estrutura e o link "Início").

## Pré-requisitos

- [passo4.md](passo4.md) concluído (autenticação funcional — o layout exibe o usuário logado e o botão de logout).

## Arquivos que serão criados

- `resources/js/layouts/AppLayout.tsx`

## Arquivos que serão modificados

- `resources/js/pages/welcome.tsx` (ou página inicial autenticada equivalente) — passar a usar o layout, servindo de prova de conceito.

## O que implementar

1. Estrutura do layout: header com o nome do sistema ("IBFC Team Builder"), navegação horizontal (desktop) que colapsa em menu simples no mobile (Tailwind, mobile-first — RNF02), área de conteúdo (`children`).
2. Exibição do usuário autenticado (via props compartilhadas do `HandleInertiaRequests`) e ação de logout.
3. Convenção de uso documentada no próprio arquivo (PHPDoc/TSDoc breve): páginas atribuem `Page.layout = (page) => <AppLayout>{page}</AppLayout>`.
4. Links de navegação: nesta sprint apenas "Início"; os demais itens (Jogadores, Dias de Jogo, Estatísticas) são adicionados nos passos que criam as respectivas rotas.

## Regras de negócio envolvidas

- Nenhuma RN de domínio. Atende RNF01 (usabilidade) e RNF02 (responsividade) de [../../01-Requisitos.md](../../01-Requisitos.md).

## Fluxo

```
Página React (ex.: Players/Index)
    ↓
declara AppLayout como persistent layout
    ↓
AppLayout renderiza header + nav + conteúdo da página
    ↓
Browser
```

## Critérios de aceite

- ☐ `AppLayout.tsx` criado em `resources/js/layouts/`.
- ☐ Página inicial renderiza dentro do layout sem erros no console.
- ☐ Nome do usuário logado visível; logout funciona a partir do layout.
- ☐ Navegação utilizável em viewport mobile (375px) e desktop.
- ☐ `npm run build` compila sem erros de TypeScript.

## Observações

- **Boas práticas**: usar persistent layout (propriedade `layout` da página) e não envolver manualmente o JSX de cada página — preserva estado do layout entre navegações Inertia.
- **Armadilha**: não hardcodar URLs nos links de navegação; usar as funções geradas pelo Wayfinder assim que as rotas existirem ([../../13-Views.md](../../13-Views.md), seção 6).
- Referências: [../../13-Views.md](../../13-Views.md), [../../04-EstruturaDoProjeto.md](../../04-EstruturaDoProjeto.md).

## Dependências

**Depende de:**
- [passo4.md](passo4.md)

**Desbloqueia:**
- [../sprint2/passo4.md](../sprint2/passo4.md)
- [../sprint3/passo3.md](../sprint3/passo3.md)
- [../sprint7/passo6.md](../sprint7/passo6.md)
