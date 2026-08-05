# Revisão de responsividade mobile

O sistema é usado em campo, no celular. Esta revisão garante que todas as telas honram isso.

## Objetivo

Auditar e corrigir a experiência mobile (viewport 375px) de todas as telas do sistema, priorizando os fluxos "de campo": seleção de presentes, times gerados e lançamento de estatísticas.

## Contexto

RNF02 ([../../01-Requisitos.md](../../01-Requisitos.md)) define mobile como requisito, não nice-to-have. As sprints anteriores construíram cada tela mobile-first, mas a revisão integrada — navegando o fluxo completo num viewport pequeno — sempre revela problemas de composição (overflow, alvos de toque pequenos, tabelas que estouram).

## Pré-requisitos

- [../sprint7/passo7.md](../sprint7/passo7.md) concluído (sistema funcional completo).

## Arquivos que serão criados

- Nenhum.

## Arquivos que serão modificados

- Qualquer página/componente em `resources/js/` que a auditoria apontar (correções de classes Tailwind, reorganização de grids/tabelas).

## O que implementar

1. Percorrer o fluxo completo (login → jogadores → criar dia → selecionar presentes → gerar times → lançar estatísticas → encerrar → rankings) em viewport 375px e 768px, listando cada defeito encontrado.
2. Corrigir: overflow horizontal (proibido), alvos de toque < 44px, textos truncados sem tooltip, formulários com teclado mobile inadequado (inputs numéricos devem abrir teclado numérico).
3. Conferir também o layout desktop (1280px) — a revisão não pode regredir o desktop.

## Regras de negócio envolvidas

- Nenhuma RN de domínio; RNF01/RNF02.

## Fluxo

```
Auditoria guiada pelo fluxo real (mobile)
    ↓
Lista de defeitos → correções pontuais de UI
    ↓
Re-verificação nos 3 viewports
```

## Critérios de aceite

- ☐ Fluxo completo executável em 375px sem overflow horizontal em nenhuma tela.
- ☐ Contadores de estatística e checkboxes de seleção operáveis com o polegar.
- ☐ Inputs numéricos abrem teclado numérico no mobile.
- ☐ Desktop sem regressões.
- ☐ Build limpo.

## Observações

- **Boas práticas**: registrar a lista de defeitos encontrados no PR — vira histórico do que foi auditado.
- Referências: [../../01-Requisitos.md](../../01-Requisitos.md) (RNF02), [../../13-Views.md](../../13-Views.md) (seção 5).

## Dependências

**Depende de:**
- [../sprint7/passo7.md](../sprint7/passo7.md)

**Desbloqueia:**
- [passo4.md](passo4.md)
