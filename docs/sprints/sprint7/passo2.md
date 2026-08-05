# Criar o Model PlayerSeasonStat e o relacionamento hasOne

O Model do resumo agregado e sua ligação 1:1 com o jogador.

## Objetivo

Criar `app/Models/PlayerSeasonStat.php` e adicionar `seasonStat()` (HasOne) ao Model `Player`.

## Contexto

Última entidade do domínio ([../../06-Entidades.md](../../06-Entidades.md), seção 6). Segue à risca o padrão dos Models existentes: `$fillable` explícito, relacionamentos tipados. Os campos são sempre escritos pelo sistema (fechamento de dia / rebuild), nunca pelo usuário.

## Pré-requisitos

- [passo1.md](passo1.md) concluído (tabela existe).

## Arquivos que serão criados

- `app/Models/PlayerSeasonStat.php` (`php artisan make:model PlayerSeasonStat --no-interaction` — **sem** flags de migration/factory: a migration veio do passo 1 e factory não é necessária, o dado é sempre derivado).

## Arquivos que serão modificados

- `app/Models/Player.php` — relacionamento `seasonStat(): HasOne`.

## O que implementar

1. Model com `$fillable = ['player_id', 'games', 'wins', 'draws', 'losses', 'goals', 'assists']` e relacionamento `player(): BelongsTo` ([../../10-Models.md](../../10-Models.md), seção 6).
2. `seasonStat(): HasOne` no `Player` ([../../08-Relacionamentos.md](../../08-Relacionamentos.md), seção 2.3).
3. Accessors de médias derivadas (leitura, sem coluna): gols/jogo, assistências/jogo e aproveitamento (%), protegendo divisão por zero quando `games = 0` ([../../16-Estatisticas.md](../../16-Estatisticas.md), seção 6).

## Regras de negócio envolvidas

- RN13 (entidade do resumo), RN14 (as médias derivadas servem os rankings/desempates).

## Fluxo

```
Player 1:1 PlayerSeasonStat
    ↓
$player->seasonStat → totais
    ↓
accessors → médias calculadas na leitura
```

## Critérios de aceite

- ☐ Model criado no padrão do projeto (fillable, tipos, relacionamentos).
- ☐ `Player::seasonStat` funcional (teste rápido via Tinker).
- ☐ Accessors de média com proteção contra `games = 0`.
- ☐ Pint/Larastan limpos.

## Observações

- **Boas práticas**: médias como accessors no Model (não colunas, não cálculo na View) — deriváveis, triviais e sempre consistentes com os totais.
- Referências: [../../10-Models.md](../../10-Models.md), [../../16-Estatisticas.md](../../16-Estatisticas.md) (seção 6).

## Dependências

**Depende de:**
- [passo1.md](passo1.md)

**Desbloqueia:**
- [passo3.md](passo3.md)
- [passo5.md](passo5.md)
