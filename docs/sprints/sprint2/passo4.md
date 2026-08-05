# Criar a página Players/Index (listagem de jogadores)

Primeira tela de negócio do sistema: a lista de jogadores com busca e filtro.

## Objetivo

Criar `resources/js/pages/Players/Index.tsx` exibindo a listagem entregue pelo `PlayerController@index`, com busca por nome/apelido, filtro ativo/inativo e acesso às ações (novo, editar).

## Contexto

A página consome as props do Inertia ([../../13-Views.md](../../13-Views.md)) e usa o `AppLayout` como persistent layout. Com o seeder da Sprint 1 já populando ~20 jogadores, a tela nasce com dados reais para validação visual. Os botões "Novo Jogador" e "Editar" apontarão para rotas criadas nos próximos passos — podem ser incluídos já, pois as rotas do resource foram registradas no passo anterior.

## Pré-requisitos

- [passo3.md](passo3.md) concluído (rota e Controller entregando props).
- [../sprint1/passo7.md](../sprint1/passo7.md) concluído (dados de exemplo no banco).
- [../sprint1/passo8.md](../sprint1/passo8.md) concluído (AppLayout).

## Arquivos que serão criados

- `resources/js/pages/Players/Index.tsx`
- `resources/js/types/index.ts` — adicionar (ou criar) o tipo TypeScript `Player` compartilhado.

## Arquivos que serão modificados

- Nenhum além dos acima.

## O que implementar

1. Tabela/lista responsiva de jogadores: nome (com apelido em destaque quando houver), overall atual, status (ativo/inativo com badge visual).
2. Campo de busca e filtro de status que atualizam a URL via visita Inertia (query params), mantendo o estado refletido nos inputs.
3. Botões: "Novo Jogador" (rota `players.create`) e "Editar" por linha (rota `players.edit`), usando funções do Wayfinder — nunca URLs hardcoded.
4. Estado vazio: mensagem clara + CTA "Cadastrar primeiro jogador" quando não há resultados.
5. Layout mobile-first: em telas pequenas, a tabela colapsa para cards/linhas simplificadas (RNF02).

## Regras de negócio envolvidas

- RF04 (listagem/busca/filtro). Nenhuma lógica de negócio no frontend — dados prontos vêm do backend ([../../13-Views.md](../../13-Views.md), seção 7).

## Fluxo

```
PlayerController@index
    ↓
Inertia props { players, filters }
    ↓
Players/Index.tsx renderiza lista
    ↓
Busca/filtro → nova visita Inertia (query params) → Controller re-renderiza
```

## Critérios de aceite

- ☐ Página renderiza a lista com os dados do seeder.
- ☐ Busca e filtro funcionam e sobrevivem a refresh (estado na URL).
- ☐ Links usam Wayfinder (zero URLs hardcoded).
- ☐ Estado vazio implementado.
- ☐ Usável em 375px de largura.
- ☐ `npm run build` sem erros de TypeScript.

## Observações

- **Boas práticas**: tipar as props da página com o tipo `Player` compartilhado; debounce na busca para não disparar uma visita por tecla.
- **Armadilha**: filtro/busca devem ser aplicados **no backend** (Controller) — filtrar no JS quebraria a paginação futura e duplicaria regra.
- Referências: [../../13-Views.md](../../13-Views.md), [../../12-Routes.md](../../12-Routes.md).

## Dependências

**Depende de:**
- [passo3.md](passo3.md)
- [../sprint1/passo7.md](../sprint1/passo7.md)
- [../sprint1/passo8.md](../sprint1/passo8.md)

**Desbloqueia:**
- [passo5.md](passo5.md)
- [passo8.md](passo8.md)
