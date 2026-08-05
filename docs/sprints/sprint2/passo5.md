# Implementar o cadastro de jogador (create/store + página Create)

Fecha o ciclo de criação: formulário React, validação e persistência com overall calculado.

## Objetivo

Implementar `PlayerController@create` e `@store`, criar a página `Players/Create.tsx` e o componente reutilizável `PlayerForm.tsx`.

## Contexto

O formulário de jogador será usado em duas telas (criar e editar), então os campos vivem em um componente compartilhado `PlayerForm` desde o início ([../../13-Views.md](../../13-Views.md), seção 4). No `store`, o Controller usa o `StorePlayerRequest` ([passo1.md](passo1.md)) e o `OverallCalculatorService` ([passo2.md](passo2.md)) para derivar `overall_base`, gravando `current_overall` igual ao base (RN01).

## Pré-requisitos

- [passo1.md](passo1.md), [passo2.md](passo2.md), [passo3.md](passo3.md), [passo4.md](passo4.md) concluídos.

## Arquivos que serão criados

- `resources/js/pages/Players/Create.tsx`
- `resources/js/components/PlayerForm.tsx`

## Arquivos que serão modificados

- `app/Http/Controllers/PlayerController.php` — actions `create` e `store`.

## O que implementar

1. **`create`**: retornar `Inertia::render('Players/Create')` (sem props além do necessário).
2. **`store`**: receber `StorePlayerRequest`; injetar `OverallCalculatorService` no construtor (property promotion); calcular `overall_base`; criar o `Player` com `current_overall = overall_base` e `active = true`; redirecionar para `players.index` com flash de sucesso.
3. **`PlayerForm.tsx`**: campos nome, apelido e os 6 atributos (inputs numéricos 0–99, com rótulos por extenso: Goleiro, Chute, Passe, Drible, Defesa, Físico); exibição de erros de validação por campo; recebe valores iniciais e callback de submit (para servir a Create e Edit); pode exibir uma prévia do overall calculado no cliente **apenas como conveniência visual**, deixando claro que o valor oficial é o do backend.
4. **`Create.tsx`**: usa `useForm` do Inertia + `PlayerForm`, submete via função do Wayfinder para `players.store`.
5. Exibir a mensagem flash de sucesso na listagem após o redirect.

## Regras de negócio envolvidas

- RN01 (cadastro, cálculo do base, current = base, active = true).
- RN04 (apelido duplicado bloqueado pela validação).

## Fluxo

```
Usuário
    ↓
GET /players/create → Players/Create.tsx (PlayerForm)
    ↓
POST /players (useForm)
    ↓
StorePlayerRequest valida → PlayerController@store
    ↓
OverallCalculatorService::calculateBase
    ↓
Player::create (current_overall = base)
    ↓
Redirect players.index + flash de sucesso
```

## Critérios de aceite

- ☐ Jogador criado via interface aparece na listagem.
- ☐ `overall_base` e `current_overall` idênticos e coerentes com os atributos digitados.
- ☐ Erros de validação exibidos campo a campo sem perder o que foi digitado.
- ☐ Tentativa de apelido duplicado (entre ativos) é bloqueada com mensagem clara.
- ☐ Flash de sucesso visível após o redirect.
- ☐ Pint/Larastan/`npm run build` sem erros.

## Observações

- **Armadilha**: nunca aceitar `overall_base`/`current_overall` vindos do request — mesmo que alguém injete os campos no POST, eles não devem chegar ao `create()` do Model (o Form Request já não os valida; o Controller monta o array final explicitamente).
- **Boas práticas**: injeção do Service via construtor (Dependency Inversion — [../../03-ArquiteturaMVC.md](../../03-ArquiteturaMVC.md), seção 10).
- Referências: [../../11-Controllers.md](../../11-Controllers.md), [../../13-Views.md](../../13-Views.md), [../../15-CalculoOverall.md](../../15-CalculoOverall.md).

## Dependências

**Depende de:**
- [passo1.md](passo1.md)
- [passo2.md](passo2.md)
- [passo3.md](passo3.md)
- [passo4.md](passo4.md)

**Desbloqueia:**
- [passo6.md](passo6.md)
