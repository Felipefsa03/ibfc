# Criar o StoreMatchDayRequest

Validação do cadastro de um dia de jogo.

## Objetivo

Criar `app/Http/Requests/StoreMatchDayRequest.php` com as regras de validação de um Match Day (RN05).

## Contexto

O Match Day é a configuração de um evento: data, quantas partidas, quantos times e jogadores por time. A regra central é `number_of_teams >= 2` — não faz sentido "gerar times" com um só time. Como no cadastro de jogador, a validação vive em um Form Request dedicado, criado antes do Controller.

## Pré-requisitos

- [../sprint2/passo8.md](../sprint2/passo8.md) concluído (Sprint 2 fechada e testada).

## Arquivos que serão criados

- `app/Http/Requests/StoreMatchDayRequest.php` (`php artisan make:request StoreMatchDayRequest --no-interaction`).

## Arquivos que serão modificados

- Nenhum.

## O que implementar

Regras (`rules()`):
- `date`: obrigatória, data válida. Datas passadas são **permitidas** (registro retroativo de um dia que já aconteceu é caso de uso legítimo).
- `number_of_matches`: obrigatório, inteiro, mínimo 1.
- `number_of_teams`: obrigatório, inteiro, **mínimo 2** (RN05).
- `players_per_team`: obrigatório, inteiro, mínimo 1 (com mensagem sugerindo o formato típico de futsal, 5).

`authorize()`: `true` (ator único). Mensagens em português.

## Regras de negócio envolvidas

- RN05 — criação de Match Day (mínimo de 2 times; múltiplos Match Days na mesma data são permitidos — **não** validar unicidade de data).

## Fluxo

```
Formulário MatchDays/Create
    ↓
POST /match-days
    ↓
StoreMatchDayRequest valida
    ↓
Inválido → erros no formulário
Válido   → MatchDayController@store
```

## Critérios de aceite

- ☐ Request criado com todas as regras acima.
- ☐ `number_of_teams = 1` é rejeitado com mensagem clara.
- ☐ Duas criações na mesma data são permitidas.
- ☐ Mensagens em português; Pint limpo.

## Observações

- **Armadilha**: não validar "data futura obrigatória" — o organizador frequentemente registra o dia depois de jogado.
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) (RN05), [../../07-BancoDeDados.md](../../07-BancoDeDados.md) (tabela `match_days`).

## Dependências

**Depende de:**
- [../sprint2/passo8.md](../sprint2/passo8.md)

**Desbloqueia:**
- [passo2.md](passo2.md)
