# Implementar a regeneração de times com bloqueio pós-estatísticas

O organizador pode "sortear de novo" — mas só enquanto o dia ainda não tem estatísticas lançadas.

## Objetivo

Implementar `TeamController@update` (regenerar times) e a trava da RN07: com qualquer `PlayerDayStat` lançado para o dia, os times ficam imutáveis.

## Contexto

A regeneração descarta os times atuais e refaz a distribuição. Como o algoritmo é determinístico, o resultado seria idêntico — por isso este passo introduz a variação documentada ([../../14-AlgoritmoDeBalanceamento.md](../../14-AlgoritmoDeBalanceamento.md), seção 6): embaralhar jogadores com overall empatado antes da ordenação. A trava existe porque mudar a escalação de um dia com estatísticas registradas corromperia o histórico (a estatística referencia o dia em que o jogador jogou por aquele time).

## Pré-requisitos

- [passo5.md](passo5.md) concluído.

## Arquivos que serão criados

- Nenhum.

## Arquivos que serão modificados

- `app/Http/Controllers/TeamController.php` — action `update`.
- `app/Services/TeamBalancerService.php` — embaralhamento de empates antes da ordenação (mantendo os testes unitários válidos — eles asserem propriedades, não partições exatas).
- `routes/web.php` — `PUT match-days/{matchDay}/teams` → `match-days.teams.update`.
- `resources/js/pages/MatchDays/Show.tsx` — botão "Gerar novamente" com confirmação simples.

## O que implementar

1. **`update`**: verificar `playerDayStats()->exists()` no dia → se sim, rejeitar com mensagem clara (422/redirect com erro); se não, em transação: excluir os times atuais (cascata remove escalações) e recriar via Service com a mesma lista de jogadores (reconstruída a partir das escalações atuais, ou reenviada pela UI — decidir pela **reenviada**, mantendo o contrato igual ao `store`).
2. Embaralhamento de empates no Service (aleatoriedade **apenas** entre jogadores de mesmo overall).
3. Botão na UI visível apenas quando há times e nenhuma estatística.

## Regras de negócio envolvidas

- RN07 — regeneração livre até a primeira estatística; travada depois.

## Fluxo

```
Usuário clica "Gerar novamente" (confirmação)
    ↓
PUT /match-days/{id}/teams { players: [ids] }
    ↓
Controller: dia tem estatística? → SIM: rejeita | NÃO: prossegue
    ↓
Transação: apaga times antigos → Service gera novos → persiste
    ↓
Redirect show + flash
```

## Critérios de aceite

- ☐ Regeneração funciona e produz variação entre tentativas (com empates presentes).
- ☐ Dia com 1 estatística lançada rejeita a regeneração (backend, não só UI).
- ☐ Botão some da UI quando há estatísticas.
- ☐ Operação atômica (transação).
- ☐ Testes unitários do Service continuam verdes após o embaralhamento.

## Observações

- **Armadilha**: a trava deve estar no **Controller** (backend) — esconder o botão não é proteção.
- **Boas práticas**: a exclusão dos times antigos dentro da mesma transação da recriação garante que o dia nunca fique sem times "pela metade".
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) (RN07), [../../14-AlgoritmoDeBalanceamento.md](../../14-AlgoritmoDeBalanceamento.md) (seção 6).

## Dependências

**Depende de:**
- [passo5.md](passo5.md)

**Desbloqueia:**
- [passo8.md](passo8.md)
