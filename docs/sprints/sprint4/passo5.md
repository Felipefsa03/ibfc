# Criar o endpoint de geração de times (GenerateTeamsRequest + TeamController@store)

Expõe o algoritmo via HTTP e persiste o resultado em transação.

## Objetivo

Criar `app/Http/Requests/GenerateTeamsRequest.php` e `app/Http/Controllers/TeamController.php` com a action `store`, que recebe os jogadores selecionados, executa o `TeamBalancerService` e grava `Team` + `TeamPlayer`.

## Contexto

A seleção de presentes feita na tela do Match Day ([../sprint3/passo5.md](../sprint3/passo5.md)) é enviada como uma lista de ids de jogadores para `POST /match-days/{matchDay}/teams`. O Controller valida, roda o Service (puro, em memória) e persiste o resultado dentro de `DB::transaction` — se qualquer gravação falhar, nada fica pela metade (RNF04). Os times recebem nomes padrão ("Time A", "Time B", ...).

## Pré-requisitos

- [passo3.md](passo3.md) e [passo4.md](passo4.md) concluídos (algoritmo pronto e testado).
- [../sprint3/passo5.md](../sprint3/passo5.md) concluído (UI de seleção).
- [../sprint1/passo3.md](../sprint1/passo3.md) concluído (tabela `team_players` consistente).

## Arquivos que serão criados

- `app/Http/Requests/GenerateTeamsRequest.php`
- `app/Http/Controllers/TeamController.php`

## Arquivos que serão modificados

- `routes/web.php` — `POST match-days/{matchDay}/teams` → `TeamController@store`, nome `match-days.teams.store` ([../../12-Routes.md](../../12-Routes.md)).
- `resources/js/pages/MatchDays/Show.tsx` — habilitar o botão "Gerar times", submetendo os ids selecionados via Wayfinder.

## O que implementar

1. **`GenerateTeamsRequest`**: `players` obrigatório, array de ids, mínimo `number_of_teams` itens; cada id deve existir em `players` e estar ativo; sem ids duplicados.
2. **`TeamController@store`**: bloquear se o dia já tem times (regeneração é a action `update`, [passo7.md](passo7.md)); carregar os jogadores; executar o Service; em transação, criar os `Team` (nomes "Time A/B/C...", `score` 0, `won` false) e os `TeamPlayer` de cada escalação; redirect de volta ao `show` com flash.
3. Injeção do `TeamBalancerService` via construtor.

## Regras de negócio envolvidas

- RN06 (seleção validada: só ativos), RN07 (geração via algoritmo, persistência atômica), RN10 (times nascem zerados).

## Fluxo

```
MatchDays/Show → seleção de presentes
    ↓
POST /match-days/{id}/teams { players: [ids] }
    ↓
GenerateTeamsRequest valida (ativos, sem duplicatas, quantidade mínima)
    ↓
TeamBalancerService::generate (memória)
    ↓
DB::transaction: cria teams + team_players
    ↓
Redirect show + flash "Times gerados"
```

## Critérios de aceite

- ☐ Endpoint registrado e protegido por `auth`.
- ☐ Ids inativos/inexistentes/duplicados rejeitados na validação.
- ☐ Persistência atômica (transação).
- ☐ Segundo POST no mesmo dia é rejeitado com mensagem (regeneração é outra action).
- ☐ Times criados com nomes padrão e placares zerados.
- ☐ Pint/Larastan limpos.

## Observações

- **Armadilha**: validar jogadores ativos **no Request**, não confiar na UI — o POST pode ser forjado.
- **Boas práticas**: inserir os `team_players` em lote (uma operação por time), reduzindo round-trips dentro da transação.
- Referências: [../../11-Controllers.md](../../11-Controllers.md) (seção 4), [../../05-FluxoDaAplicacao.md](../../05-FluxoDaAplicacao.md) (fluxo 3).

## Dependências

**Depende de:**
- [passo3.md](passo3.md)
- [passo4.md](passo4.md)
- [../sprint3/passo5.md](../sprint3/passo5.md)
- [../sprint1/passo3.md](../sprint1/passo3.md)

**Desbloqueia:**
- [passo6.md](passo6.md)
- [passo7.md](passo7.md)
- [../sprint5/passo2.md](../sprint5/passo2.md)
- [../sprint5/passo4.md](../sprint5/passo4.md)
