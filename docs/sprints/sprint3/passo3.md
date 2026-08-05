# Criar as páginas MatchDays/Index e MatchDays/Create

As telas de histórico e de criação de um dia de jogo.

## Objetivo

Criar `resources/js/pages/MatchDays/Index.tsx` (histórico) e `resources/js/pages/MatchDays/Create.tsx` (formulário de configuração do dia).

## Contexto

O `Index` é a "linha do tempo" da associação: todos os dias de jogo, dos mais recentes aos mais antigos, com acesso ao detalhe de cada um. O `Create` captura a configuração do dia (data e formato). A seleção de jogadores presentes é um refinamento do Create tratado em passo próprio ([passo5.md](passo5.md)) — neste passo, a tela nasce apenas com os campos de configuração.

## Pré-requisitos

- [passo2.md](passo2.md) concluído (Controller e rotas).
- [../sprint1/passo8.md](../sprint1/passo8.md) concluído (AppLayout).

## Arquivos que serão criados

- `resources/js/pages/MatchDays/Index.tsx`
- `resources/js/pages/MatchDays/Create.tsx`
- `resources/js/types/index.ts` — adicionar o tipo `MatchDay`.

## Arquivos que serão modificados

- Nenhum além dos acima.

## O que implementar

1. **Index**: lista responsiva com data formatada (pt-BR), formato do dia (ex.: "3 times × 5 jogadores"), contagem de times formados e link para o detalhe; botão "Novo Dia de Jogo"; estado vazio com CTA.
2. **Create**: formulário com data (input date), número de partidas, número de times (mínimo 2 já refletido na UI), jogadores por time; `useForm` + submit via Wayfinder para `match-days.store`; erros de validação por campo.
3. Ambas com `AppLayout` e usáveis em mobile.

## Regras de negócio envolvidas

- RN05 (a UI reflete o mínimo de 2 times, mas a validação autoritativa é do backend).

## Fluxo

```
MatchDayController@index / @create
    ↓
Inertia props
    ↓
MatchDays/Index.tsx (histórico) / MatchDays/Create.tsx (form)
    ↓
POST match-days.store → redirect para o Show
```

## Critérios de aceite

- ☐ Histórico renderiza dias ordenados por data desc.
- ☐ Formulário cria um dia e redireciona ao detalhe.
- ☐ Erros de validação visíveis por campo.
- ☐ Estado vazio no Index.
- ☐ Build TS sem erros; telas usáveis em 375px.

## Observações

- **Boas práticas**: formatar datas no frontend a partir do valor ISO das props (não formatar no backend — a View é dona da apresentação).
- Referências: [../../13-Views.md](../../13-Views.md), [../../05-FluxoDaAplicacao.md](../../05-FluxoDaAplicacao.md) (fluxo 3).

## Dependências

**Depende de:**
- [passo2.md](passo2.md)
- [../sprint1/passo8.md](../sprint1/passo8.md)

**Desbloqueia:**
- [passo5.md](passo5.md)
