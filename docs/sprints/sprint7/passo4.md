# Criar o comando stats:rebuild

Rede de segurança: reprocessar as estatísticas de temporada do zero a partir da fonte primária.

## Objetivo

Criar o comando Artisan `stats:rebuild`, que recalcula toda a tabela `player_season_stats` a partir de `player_day_stats` e dos resultados dos times.

## Contexto

Se um bug de agregação for corrigido, ou um Match Day for excluído (a exclusão não reverte agregados — limitação documentada na Sprint 3), a tabela agregada fica errada. A correção nunca é manual no banco: é o rebuild ([../../16-Estatisticas.md](../../16-Estatisticas.md), seção 9). O comando considera **apenas Match Days encerrados** (`closed_at` preenchido) — dias abertos ainda não foram consolidados.

## Pré-requisitos

- [passo3.md](passo3.md) concluído (a lógica de derivação W/D/L existe e deve ser reutilizada).

## Arquivos que serão criados

- `app/Console/Commands/RebuildSeasonStats.php` (`php artisan make:command RebuildSeasonStats --no-interaction`, signature `stats:rebuild`).

## Arquivos que serão modificados

- Possivelmente `app/Services/MatchDayCloserService.php` — extrair a derivação de W/D/L para método reutilizável pelo comando (uma única fonte da regra).

## O que implementar

1. Comando com signature `stats:rebuild`, descrição clara e confirmação interativa antes de executar (é destrutivo sobre a tabela agregada) — com opção `--force` para uso não interativo.
2. Em transação: zerar/truncar `player_season_stats` e reprocessar todos os Match Days **encerrados** em ordem cronológica, aplicando exatamente a mesma agregação do fechamento (reuso do Service — nunca duplicar a regra).
3. Saída informativa: quantos dias processados, quantos jogadores atualizados.

## Regras de negócio envolvidas

- RN13 — o rebuild é a mesma agregação, reaplicada do zero; a fonte primária (`player_day_stats` + `teams.won`) é imutável e suficiente.

## Fluxo

```
php artisan stats:rebuild
    ↓
confirmação (ou --force)
    ↓
DB::transaction:
    limpa player_season_stats
    para cada MatchDay encerrado (ordem cronológica):
        reaplica agregação (Service compartilhado)
    ↓
Relatório no terminal
```

## Critérios de aceite

- ☐ Comando registrado (`php artisan list` mostra `stats:rebuild`).
- ☐ Rebuild reproduz exatamente o estado que os fechamentos produziram (verificável por teste).
- ☐ Dias abertos ignorados.
- ☐ Confirmação exigida sem `--force`.
- ☐ Operação atômica.

## Observações

- **Armadilha**: o rebuild **não** recalcula `current_overall` (o overall evolui com histórico dependente de trajetória e reavaliações manuais de base — não é reconstituível com fidelidade). Escopo: apenas a tabela agregada. Deixar isso explícito na descrição do comando.
- Referências: [../../16-Estatisticas.md](../../16-Estatisticas.md) (seção 9).

## Dependências

**Depende de:**
- [passo3.md](passo3.md)

**Desbloqueia:**
- [passo7.md](passo7.md)
