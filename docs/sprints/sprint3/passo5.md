# Implementar a seleção de jogadores presentes

Antes de gerar times, o organizador marca quem compareceu. Esta seleção é a entrada do algoritmo de balanceamento.

## Objetivo

Adicionar à tela de detalhe do Match Day a interface de seleção de jogadores presentes (checklist dos ativos), com validação de quantidade contra o formato do dia.

## Contexto

A seleção de presentes (RN06) não é persistida como entidade própria: ela é o **input** enviado ao endpoint de geração de times (Sprint 4), que a transforma em `Team` + `TeamPlayer`. Por isso a UI vive na tela `Show` do Match Day (onde o botão "Gerar times" ficará), guardando a seleção em estado local do React até o submit. O backend precisa apenas fornecer a lista de jogadores ativos nessa tela.

## Pré-requisitos

- [passo3.md](passo3.md) e [passo4.md](passo4.md) concluídos.

## Arquivos que serão criados

- `resources/js/components/PlayerSelectionList.tsx` — checklist reutilizável de jogadores.

## Arquivos que serão modificados

- `app/Http/Controllers/MatchDayController.php` — `show` passa a incluir `activePlayers` nas props quando o dia ainda não tem times gerados.
- `resources/js/pages/MatchDays/Show.tsx` — integrar o componente na seção "Times" (substituindo o estado vazio quando aplicável).

## O que implementar

1. **`PlayerSelectionList`**: lista de jogadores ativos com checkbox, exibindo nome/apelido, `current_overall` e um indicador visual para prováveis goleiros (atributo `gol` alto); contador de selecionados.
2. Validação visual de quantidade: comparar selecionados vs `number_of_teams × players_per_team` — igual (ideal), acima (aviso de sobras, tolerado — o algoritmo distribui), muito abaixo (aviso forte). A UI **avisa**, não bloqueia; a decisão final é do organizador ([../../14-AlgoritmoDeBalanceamento.md](../../14-AlgoritmoDeBalanceamento.md), seção 4).
3. Botão "Gerar times" que ficará **desabilitado nesta sprint** (com tooltip "disponível em breve") — a action que o recebe nasce na Sprint 4. Alternativa: ocultá-lo até a Sprint 4; decidir e registrar no PR.
4. A seleção some quando o dia já tem times gerados (a seção passa a exibir os times — Sprint 4).

## Regras de negócio envolvidas

- RN06 — seleção dentre ativos; compatibilidade de quantidade com o formato do dia.

## Fluxo

```
MatchDays/Show (dia sem times)
    ↓
PlayerSelectionList (checkboxes + contador + avisos)
    ↓
[Sprint 4] POST match-days/{id}/teams com os ids selecionados
```

## Critérios de aceite

- ☐ Apenas jogadores ativos listados.
- ☐ Contador e avisos de quantidade funcionando conforme o formato do dia.
- ☐ Goleiros sinalizados visualmente.
- ☐ Componente reutilizável e tipado.
- ☐ Usável em mobile (uso típico: campo, celular).

## Observações

- **Armadilha**: não persistir a seleção no banco nesta sprint — ela é efêmera por design; persistência aconteceria via `team_players` na geração.
- **Boas práticas**: manter a lista ordenada por overall desc ou nome (escolher e ser consistente); seleção em massa ("marcar todos") ajuda no caso comum de a maioria comparecer.
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) (RN06), [../../14-AlgoritmoDeBalanceamento.md](../../14-AlgoritmoDeBalanceamento.md) (seções 1 e 4).

## Dependências

**Depende de:**
- [passo3.md](passo3.md)
- [passo4.md](passo4.md)

**Desbloqueia:**
- [../sprint4/passo5.md](../sprint4/passo5.md)
