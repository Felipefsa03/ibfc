# 00 — Visão Geral

## 1. O que é o IBFC Team Builder

O **IBFC Team Builder** é um sistema web para gestão de jogadores de futsal da associação **IBFC**. Ele centraliza o cadastro dos jogadores, organiza os dias de jogo ("Match Days"), monta times equilibrados automaticamente, registra o desempenho de cada jogador partida a partida e mantém um histórico estatístico completo (gols, assistências, vitórias, evolução de habilidade).

Em outras palavras: é uma ferramenta de gestão esportiva amadora, focada em **justiça na formação dos times** e em **acompanhamento de evolução dos jogadores ao longo do tempo**.

## 2. Problema que o sistema resolve

Hoje, associações de futsal amador como a IBFC costumam montar os times "no olho" no dia do jogo. Isso gera problemas recorrentes:

| Problema | Consequência |
|---|---|
| Times montados sem critério | Partidas desequilibradas, um time sempre mais forte que o outro |
| Ausência de registro histórico | Ninguém sabe quem é o artilheiro do ano, quantos jogos cada um disputou |
| Habilidade avaliada "de memória" | Jogadores que evoluem (ou pioram) não têm isso refletido em nada |
| Falta de critério de convocação | Jogadores inativos continuam aparecendo nas listas |
| Nenhuma fonte única de verdade | Cada organizador tem sua própria planilha ou anotação |

O IBFC Team Builder resolve isso substituindo o processo manual por um fluxo estruturado: **cadastro → seleção de participantes do dia → geração automática de times equilibrados → registro de estatísticas → atualização automática de habilidade (overall) → rankings**.

## 3. Benefícios

- **Times mais equilibrados**: o algoritmo de balanceamento (ver [14-AlgoritmoDeBalanceamento.md](14-AlgoritmoDeBalanceamento.md)) distribui os jogadores considerando a força (overall) de cada um, minimizando a diferença entre os times.
- **Evolução justa e automática**: o overall de cada jogador muda com base no desempenho real em campo (gols e assistências), sem depender de opinião subjetiva (ver [15-CalculoOverall.md](15-CalculoOverall.md)).
- **Histórico confiável**: cada dia de jogo (Match Day) fica registrado, junto com quem jogou, por quem times e quantos gols/assistências cada um fez.
- **Estatísticas e rankings**: artilharia, assistências, número de jogos, vitórias — tudo consultável a qualquer momento (ver [16-Estatisticas.md](16-Estatisticas.md)).
- **Menos trabalho manual**: o organizador não precisa mais montar times ou atualizar planilhas manualmente.

## 4. Funcionalidades principais

1. **Cadastro de jogadores** — nome, apelido, atributos táticos (Goleiro, Chute, Passe, Drible, Defesa, Físico) e overall inicial.
2. **Atualização de atributos** — edição dos dados cadastrais e dos atributos de um jogador.
3. **Geração automática de times equilibrados** — a partir da lista de jogadores presentes em um dia de jogo.
4. **Cadastro dos dias de jogo (Match Day)** — data, quantidade de partidas, quantidade de times, jogadores por time.
5. **Registro de gols e assistências** — por jogador, por dia de jogo.
6. **Evolução automática do Overall** — recálculo do `current_overall` do jogador com base no desempenho.
7. **Histórico de partidas** — consulta de dias de jogo passados, times formados e resultados.
8. **Estatísticas** — rankings de artilharia, assistências, jogos disputados, vitórias, etc.

## 5. Visão de produto

O sistema é pensado para uso **interno da associação**, operado por um administrador/organizador (não há, por ora, múltiplos perfis de usuário — ver [17-CasosDeUso.md](17-CasosDeUso.md)). A interface é web, responsiva (para uso em celular no dia do jogo), construída com Laravel 13 no backend e Inertia.js + React no frontend (ver [03-ArquiteturaMVC.md](03-ArquiteturaMVC.md)).

## 6. Fluxo geral (visão macro)

```
┌─────────────────┐
│ Cadastrar        │
│ Jogadores        │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│ Criar Match Day  │
│ (data, formato)  │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│ Selecionar       │
│ jogadores        │
│ presentes        │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│ Gerar Times      │
│ (balanceamento)  │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│ Jogar a partida  │
│ (fora do sistema)│
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│ Registrar gols e │
│ assistências     │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│ Recalcular       │
│ Overall          │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│ Atualizar        │
│ estatísticas de  │
│ temporada        │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│ Consultar        │
│ Rankings         │
└─────────────────┘
```

Esse fluxo completo é detalhado em [05-FluxoDaAplicacao.md](05-FluxoDaAplicacao.md) e [18-FluxoCompleto.md](18-FluxoCompleto.md).

## 7. Público-alvo desta documentação

Esta documentação foi escrita para ser lida por qualquer desenvolvedor(a) — inclusive júnior — que precise implementar, manter ou evoluir o sistema **sem depender de conhecimento prévio do projeto**. Cada decisão técnica é acompanhada do "porquê", não apenas do "como".
