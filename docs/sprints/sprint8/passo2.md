# Estados vazios e mensagens de feedback

Polimento de UX: nenhuma tela em branco, nenhuma ação sem resposta.

## Objetivo

Garantir que todas as páginas tenham estados vazios informativos com CTA, e que toda ação de escrita produza feedback visível (flash de sucesso/erro).

## Contexto

As sprints anteriores especificaram estados vazios pontualmente; esta revisão fecha as lacunas de forma sistemática ([../../13-Views.md](../../13-Views.md), seção 7: "estados vazios devem ter mensagem/CTA clara, não tela em branco"). O mesmo vale para as mensagens flash: o padrão de exibição deve ser único (um componente de notificação no `AppLayout`), não improvisado por página.

## Pré-requisitos

- [../sprint7/passo7.md](../sprint7/passo7.md) concluído.

## Arquivos que serão criados

- `resources/js/components/FlashMessages.tsx` — componente único de notificações (sucesso/erro), integrado ao `AppLayout` (se as sprints anteriores ainda não o consolidaram).
- `resources/js/components/EmptyState.tsx` — componente padrão de estado vazio (ícone, mensagem, CTA opcional).

## Arquivos que serão modificados

- `resources/js/layouts/AppLayout.tsx` — integrar `FlashMessages`.
- Páginas que ainda tratam vazio/flash de forma ad hoc — migrar para os componentes padrão.

## O que implementar

1. Inventário: para cada página, verificar (a) estado vazio, (b) feedback de sucesso, (c) feedback de erro de validação, (d) feedback de erro de regra de negócio (ex.: regenerar times bloqueado).
2. Consolidar os dois componentes padrão e migrar as páginas.
3. Mensagens em português, específicas ("Times gerados com 3 times equilibrados", não "Operação realizada").

## Regras de negócio envolvidas

- Nenhuma RN nova — as mensagens devem **refletir** as RNs corretamente (ex.: o texto do bloqueio de regeneração explica a RN07).

## Fluxo

```
Ação do usuário → Controller → flash na sessão
    ↓
HandleInertiaRequests compartilha o flash
    ↓
FlashMessages (AppLayout) exibe e some sozinho
```

## Critérios de aceite

- ☐ Todas as páginas com estado vazio padronizado (componente único).
- ☐ Toda ação de escrita gera feedback visível.
- ☐ Mensagens específicas e em português.
- ☐ Flash some automaticamente (timeout) e é acessível (não só cor).

## Observações

- **Armadilha**: mensagens de erro de regra de negócio (4xx de bloqueio) chegam por canal diferente dos erros de validação — o componente deve tratar ambos.
- Referências: [../../13-Views.md](../../13-Views.md) (seção 7), [../../01-Requisitos.md](../../01-Requisitos.md) (RNF01).

## Dependências

**Depende de:**
- [../sprint7/passo7.md](../sprint7/passo7.md)

**Desbloqueia:**
- [passo4.md](passo4.md)
