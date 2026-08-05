# Criar MatchDayFactory e TeamFactory

Complementa a infraestrutura de testes: factories para dias de jogo e times.

## Objetivo

Criar `database/factories/MatchDayFactory.php` e `database/factories/TeamFactory.php`.

## Contexto

Os testes das Sprints 3 a 7 precisam montar cenários com Match Days e times sem repetir setup manual. Os Models `MatchDay` e `Team` já existem; faltam apenas as factories. `Team` sempre pertence a um `MatchDay` (FK `match_day_id`), então a `TeamFactory` deve criar (ou receber) um Match Day pai automaticamente.

## Pré-requisitos

- [passo2.md](passo2.md) concluído (tabelas existem).
- [passo5.md](passo5.md) concluído (padrão de factory do projeto estabelecido).

## Arquivos que serão criados

- `database/factories/MatchDayFactory.php`
- `database/factories/TeamFactory.php`

## Arquivos que serão modificados

- `app/Models/MatchDay.php` e `app/Models/Team.php` — adicionar `HasFactory` caso ausente.

## O que implementar

1. **MatchDayFactory**: `date` fake (datas próximas, passadas e futuras), `number_of_matches` (1–3), `number_of_teams` (2–4, respeitando RN05: mínimo 2), `players_per_team` (4–6, formato típico de futsal: 5).
2. **TeamFactory**: `match_day_id` via relacionamento com `MatchDay::factory()` (padrão Laravel), `name` fake (ex.: "Time" + letra/cor), `score` 0, `won` false.
3. Estado nomeado em `TeamFactory`: `winner()` (`won` true) — usado nos testes de season stats da Sprint 7.

## Regras de negócio envolvidas

- RN05 (`number_of_teams >= 2`) — a factory nunca deve gerar configuração inválida.
- RN10 (`score`/`won` por time) — valores iniciais zerados/false, como no fluxo real.

## Fluxo

```
Teste
    ↓
MatchDay::factory()->create()  /  Team::factory()->for($matchDay)->create()
    ↓
Registros válidos criados com FKs corretas
```

## Critérios de aceite

- ☐ `MatchDay::factory()->create()` funciona sem erro.
- ☐ `Team::factory()->create()` cria automaticamente o MatchDay pai quando não informado.
- ☐ `number_of_teams` gerado nunca é menor que 2.
- ☐ Estado `winner()` funciona.

## Observações

- **Boas práticas**: nas factories de entidades com FK, usar a convenção de relacionamento do Laravel (atribuir `Model::factory()` à coluna FK) para que `->for()` e `->has()` funcionem naturalmente nos testes.
- **Armadilha**: não criar `TeamPlayerFactory` — escalações são sempre produzidas pelo `TeamBalancerService` (Sprint 4) ou montadas explicitamente nos testes; uma factory de pivô induziria a criar escalações inválidas (jogador duplicado no time).
- Referências: [../../06-Entidades.md](../../06-Entidades.md), [../../08-Relacionamentos.md](../../08-Relacionamentos.md).

## Dependências

**Depende de:**
- [passo2.md](passo2.md)
- [passo5.md](passo5.md)

**Desbloqueia:**
- [../sprint3/passo7.md](../sprint3/passo7.md)
- [../sprint4/passo4.md](../sprint4/passo4.md)
- [../sprint4/passo8.md](../sprint4/passo8.md)
