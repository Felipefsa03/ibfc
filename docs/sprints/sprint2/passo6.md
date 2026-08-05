# Implementar a edição de jogador (edit/update + página Edit)

Permite corrigir dados e reavaliar atributos, preservando a evolução conquistada em campo.

## Objetivo

Criar `UpdatePlayerRequest`, implementar `PlayerController@edit` e `@update`, e criar `Players/Edit.tsx` reutilizando o `PlayerForm`.

## Contexto

A edição tem uma sutileza central (RN02): ao alterar os atributos táticos, o `overall_base` é **recalculado**, mas o `current_overall` é **preservado** — a evolução em campo não se perde com uma reavaliação manual. O `UpdatePlayerRequest` é quase idêntico ao Store, com a diferença clássica: a regra de unicidade do apelido deve **ignorar o próprio jogador** sendo editado.

## Pré-requisitos

- [passo5.md](passo5.md) concluído (PlayerForm e padrão de store estabelecidos).

## Arquivos que serão criados

- `app/Http/Requests/UpdatePlayerRequest.php`
- `resources/js/pages/Players/Edit.tsx`

## Arquivos que serão modificados

- `app/Http/Controllers/PlayerController.php` — actions `edit` e `update`.

## O que implementar

1. **`UpdatePlayerRequest`**: mesmas regras do Store, com `unique` de `nickname` ignorando o id do jogador em edição (route model binding disponível no request).
2. **`edit(Player $player)`**: `Inertia::render('Players/Edit', ['player' => ...])` com os campos editáveis.
3. **`update`**: se algum dos 6 atributos mudou, recalcular `overall_base` via `OverallCalculatorService`; **não tocar** em `current_overall`; atualizar e redirecionar com flash.
4. **`Edit.tsx`**: `PlayerForm` pré-preenchido; submit via PUT para `players.update` (Wayfinder).
5. Exibir na tela de edição, como leitura, o `current_overall` atual (informativo — o usuário entende que ele não é editável, RN02).

## Regras de negócio envolvidas

- RN02 — edição: recalcula base, preserva current; `current_overall` nunca editável diretamente.
- RN04 — unicidade de apelido (ignorando o próprio registro).

## Fluxo

```
Usuário
    ↓
GET /players/{player}/edit → Players/Edit.tsx (form pré-preenchido)
    ↓
PUT /players/{player}
    ↓
UpdatePlayerRequest valida
    ↓
PlayerController@update
    ├── atributos mudaram? → recalcula overall_base
    └── current_overall intocado
    ↓
Redirect players.index + flash
```

## Critérios de aceite

- ☐ Edição de nome/apelido funciona.
- ☐ Alterar atributos recalcula `overall_base` corretamente.
- ☐ `current_overall` permanece inalterado após qualquer edição.
- ☐ Apelido pode ser mantido igual ao próprio (unique ignora o registro).
- ☐ `current_overall` exibido como somente leitura na tela.
- ☐ Pint/Larastan/build sem erros.

## Observações

- **Armadilha**: implementar o `unique` sem o `ignore` do próprio id fará toda edição falhar quando o apelido não muda.
- **Boas práticas**: comparar atributos antigos vs novos antes de recalcular é opcional (recalcular sempre produz o mesmo resultado quando nada mudou) — escolher a forma mais simples e documentar no PHPDoc.
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) (RN02), [../../05-FluxoDaAplicacao.md](../../05-FluxoDaAplicacao.md) (fluxo 2).

## Dependências

**Depende de:**
- [passo5.md](passo5.md)

**Desbloqueia:**
- [passo7.md](passo7.md)
