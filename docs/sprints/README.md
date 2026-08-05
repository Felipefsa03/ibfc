# Roteiro de Implementação por Sprints — IBFC Team Builder

Este diretório é o **guia de desenvolvimento incremental** do sistema. Cada arquivo `passoN.md` é uma tarefa técnica pequena, autocontida e executável: abra um passo, execute-o por completo (incluindo os critérios de aceite) e só então avance para o próximo.

A fonte oficial de arquitetura, regras de negócio e algoritmos é a documentação em [`docs/`](../) (arquivos 00 a 19). Cada passo referencia os documentos relevantes — em caso de dúvida, a documentação principal prevalece.

## Como usar

1. Siga as sprints em ordem (1 → 8) e, dentro de cada sprint, os passos em ordem numérica.
2. Antes de iniciar um passo, confira a seção **Dependências** dele: tudo em "Depende de" precisa estar concluído.
3. Um passo só está concluído quando **todos** os itens do seu checklist de critérios de aceite estão marcados.
4. Nunca pule os passos de teste — eles são o critério de "pronto" de cada sprint.

## As 8 sprints

| Sprint | Tema | Passos | Entrega ao final |
|---|---|---|---|
| [sprint1](sprint1/) | Infraestrutura e Base de Dados | 8 | Banco MySQL migrado, auth funcionando, factories/seeder, layout base |
| [sprint2](sprint2/) | Cadastro de Jogadores | 8 | CRUD completo de jogadores com overall base calculado e testes |
| [sprint3](sprint3/) | Dias de Jogo | 7 | Match Days criáveis, tela de detalhe, seleção de presentes |
| [sprint4](sprint4/) | Times e Balanceamento | 8 | Geração automática de times equilibrados (algoritmo + endpoint + UI) |
| [sprint5](sprint5/) | Estatísticas do Dia | 5 | Lançamento de gols/assistências e resultado por time |
| [sprint6](sprint6/) | Evolução do Overall | 5 | Encerramento do dia com recálculo de overall e travas de histórico |
| [sprint7](sprint7/) | Temporada e Rankings | 7 | Estatísticas agregadas, rankings e comando de rebuild |
| [sprint8](sprint8/) | Refatoração e Melhorias | 4 | Polimento mobile/UX, qualidade de código e auditoria final |

Total: **52 passos**.

## Grafo de dependências entre sprints (resumo)

```
sprint1 (infra)
   │
   ▼
sprint2 (jogadores) ──────────────┐
   │                               │ (OverallCalculatorService nasce
   ▼                               │  na sprint2 e é estendido na sprint6)
sprint3 (dias de jogo)             │
   │                               │
   ▼                               │
sprint4 (times/balanceamento)      │
   │                               │
   ▼                               │
sprint5 (estatísticas do dia)      │
   │                               │
   ▼                               ▼
sprint6 (encerramento + overall) ◄─┘
   │
   ▼
sprint7 (temporada + rankings)
   │
   ▼
sprint8 (refatoração final)
```

As dependências finas (passo a passo, inclusive entre sprints) estão declaradas na seção **Dependências** de cada arquivo.

## Convenções seguidas pelos passos

- **Nenhum passo contém código** — apenas responsabilidades, nomes de arquivos/classes e referências à documentação. As decisões de arquitetura já estão tomadas nos docs 00–19; o desenvolvedor implementa, não redecide.
- Comandos Artisan citados nos passos (`php artisan make:...`, `migrate`, `test`) são a forma canônica de criar arquivos no projeto.
- Todo passo que altera PHP termina com `vendor/bin/pint --dirty` limpo; todo passo com frontend termina com `npm run build` limpo.
- Testes: Pest (`php artisan test --compact`); Feature para fluxos HTTP, Unit para Services.
