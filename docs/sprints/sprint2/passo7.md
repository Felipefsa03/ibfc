# Implementar a remoção de jogador (inativação vs exclusão física)

"Excluir" um jogador quase nunca é excluir de verdade: o histórico de partidas precisa ser preservado.

## Objetivo

Implementar `PlayerController@destroy` com a regra automática: inativa (`active = false`) quando o jogador tem histórico; exclui fisicamente apenas quando nunca participou de nada.

## Contexto

RN03 define que jogadores com qualquer vínculo em `team_players` ou `player_day_stats` não podem ser apagados — a exclusão apagaria em cascata o histórico de dias já ocorridos. A ação de "remover" na interface é única; a decisão inativar-vs-excluir é do backend, baseada na existência de vínculos. Um jogador inativado sai das listas de convocação, mas permanece no histórico e pode ser reativado por edição.

## Pré-requisitos

- [passo6.md](passo6.md) concluído.

## Arquivos que serão criados

- Nenhum.

## Arquivos que serão modificados

- `app/Http/Controllers/PlayerController.php` — action `destroy`.
- `resources/js/pages/Players/Index.tsx` — botão de remoção com diálogo de confirmação, e ação de "Reativar" para inativos.

## O que implementar

1. **`destroy(Player $player)`**: verificar existência de vínculos (`teamPlayers()->exists()` ou `dayStats()->exists()`); com vínculos → `active = false` e mensagem "Jogador inativado (histórico preservado)"; sem vínculos → `delete()` físico e mensagem "Jogador excluído".
2. Confirmação obrigatória na UI antes do DELETE (diálogo explicando a diferença entre os dois desfechos).
3. Ação "Reativar" para jogadores inativos na listagem (reuso do `update` setando `active = true` — decidir e documentar: pode ser um endpoint dedicado leve ou parte do update).

## Regras de negócio envolvidas

- RN03 — inativação preferida; exclusão física só sem histórico.
- RN15 — a exclusão física, quando permitida, não dispara cascata relevante (por definição o jogador não tem vínculos).

## Fluxo

```
Usuário clica "Remover" → confirma no diálogo
    ↓
DELETE /players/{player}
    ↓
PlayerController@destroy
    ├── tem vínculos?  → update active = false
    └── sem vínculos?  → delete físico
    ↓
Redirect players.index + flash explicando o que ocorreu
```

## Critérios de aceite

- ☐ Jogador com histórico é inativado, nunca apagado.
- ☐ Jogador sem histórico é apagado fisicamente.
- ☐ Mensagem flash diferencia os dois desfechos.
- ☐ Jogador inativo some do filtro "ativos" e pode ser reativado.
- ☐ Confirmação exigida antes da ação.

## Observações

- **Armadilha**: as FKs têm `cascadeOnDelete` — um `delete()` num jogador com histórico **funcionaria** silenciosamente e apagaria estatísticas. A checagem de vínculos no Controller é a única barreira; testá-la é obrigatório ([passo8.md](passo8.md)).
- **Boas práticas**: usar `exists()` (não `count()`) para a checagem — mais eficiente.
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) (RN03/RN15), [../../17-CasosDeUso.md](../../17-CasosDeUso.md) (UC03).

## Dependências

**Depende de:**
- [passo6.md](passo6.md)

**Desbloqueia:**
- [passo8.md](passo8.md)
