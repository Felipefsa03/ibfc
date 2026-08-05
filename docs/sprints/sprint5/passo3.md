# Criar a UI de lançamento de gols e assistências

A tela usada em campo, no celular, durante/depois das partidas.

## Objetivo

Adicionar à seção "Estatísticas" de `MatchDays/Show.tsx` a interface de lançamento por jogador.

## Contexto

Com os times exibidos ([../sprint4/passo6.md](../sprint4/passo6.md)) e o endpoint pronto ([passo2.md](passo2.md)), a tela do Match Day ganha o lançamento: para cada jogador escalado, contadores de gols e assistências com os valores atuais (vindos de `playerDayStats` nas props). Este é o caso de uso mais "de campo" do sistema — a ergonomia mobile é requisito, não detalhe (RNF02).

## Pré-requisitos

- [passo2.md](passo2.md) concluído.
- [../sprint4/passo6.md](../sprint4/passo6.md) concluído (TeamCard/PlayerCard).

## Arquivos que serão criados

- `resources/js/components/StatCounter.tsx` — contador +/− acessível (botões grandes, valor central), reutilizado para gols e assistências.

## Arquivos que serão modificados

- `resources/js/pages/MatchDays/Show.tsx` — seção de estatísticas: jogadores agrupados por time, cada um com dois `StatCounter` e ação de salvar.

## O que implementar

1. **`StatCounter`**: valor atual, botões − / + (não desce de 0), rótulo (Gols/Assistências), alvo de toque ≥ 44px.
2. Lista de lançamento agrupada por time (reuso visual do `PlayerCard`), com os valores atuais pré-carregados.
3. Salvamento por jogador via `useForm`/`router.put` (Wayfinder), enviando os **totais** do jogador; indicador de salvamento (estado pendente/salvo) por linha.
4. Feedback de erro em caso de validação recusada (ex.: dia sem participação do jogador — cenário raro via UI, mas o backend pode recusar).

## Regras de negócio envolvidas

- RN09 — lançamento por jogador/dia; a UI reflete o modelo de totais absolutos do endpoint.

## Fluxo

```
Show (times + stats atuais)
    ↓
Organizador ajusta contadores (+/−)
    ↓
Salvar jogador → PUT stats (totais)
    ↓
Flash/indicador de salvo → props atualizadas
```

## Critérios de aceite

- ☐ Valores atuais pré-carregados por jogador.
- ☐ Contadores não permitem negativo.
- ☐ Salvamento por jogador funciona e persiste.
- ☐ Ergonomia mobile: contadores utilizáveis com o polegar em 375px.
- ☐ Build limpo.

## Observações

- **Boas práticas**: salvar por jogador (não um formulário gigante do dia inteiro) — menos perda de dados em campo com conexão instável.
- **Armadilha**: não implementar auto-incremento otimista sem confirmação do backend — o valor exibido deve refletir o que foi salvo.
- Referências: [../../13-Views.md](../../13-Views.md), [../../17-CasosDeUso.md](../../17-CasosDeUso.md) (UC06).

## Dependências

**Depende de:**
- [passo2.md](passo2.md)
- [../sprint4/passo6.md](../sprint4/passo6.md)

**Desbloqueia:**
- [passo5.md](passo5.md)
