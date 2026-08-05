# Testes de temporada, rankings e rebuild

Fecha a Sprint 7 — e com ela, o sistema funcional completo.

## Objetivo

Criar `tests/Feature/SeasonStatsTest.php` (Pest) cobrindo a agregação no fechamento, os rankings e o comando `stats:rebuild`.

## Contexto

Última bateria de testes de funcionalidade: garante que a cadeia dia-a-dia → agregado → ranking funciona ao longo de múltiplos Match Days, e que o rebuild reproduz fielmente o estado consolidado.

## Pré-requisitos

- [passo4.md](passo4.md) e [passo6.md](passo6.md) concluídos.

## Arquivos que serão criados

- `tests/Feature/SeasonStatsTest.php`

## Arquivos que serão modificados

- Nenhum.

## O que implementar

Cenários mínimos:
1. Fechar um dia cria os resumos: `games` 1, gols/assistências corretos, W/D/L conforme o time do jogador.
2. Fechar um **segundo** dia acumula (games 2, somas corretas) — não sobrescreve.
3. Empate do dia (nenhum time `won`) → `draws` incrementado para todos os escalados.
4. Escalado sem estatística: `games` +1, zeros nos demais.
5. Ranking: `stats.index` retorna ordenação correta por gols, com desempate por menos jogos (montar empate proposital).
6. `stats:rebuild --force`: bagunçar a tabela agregada manualmente no teste, rodar o comando, asserir que o estado volta a ser idêntico ao produzido pelos fechamentos.
7. Rebuild ignora dias não encerrados.
8. Rota de stats exige autenticação.

## Regras de negócio envolvidas

- RN13, RN14, RN10.

## Fluxo

```
Helper: 2+ dias completos com resultados variados
    ↓
closes sucessivos → asserções de acumulação
    ↓
GET /stats → asserções de ordem
    ↓
artisan stats:rebuild → asserção de equivalência
```

## Critérios de aceite

- ☐ Os 8 cenários implementados e passando.
- ☐ Cenário 6 assere igualdade campo a campo pós-rebuild.
- ☐ Suíte completa do projeto verde.

## Observações

- **Boas práticas**: o cenário multi-dia é o mais próximo do uso real do sistema — investir em um helper legível que monte "uma temporada em miniatura".
- Referências: [../../16-Estatisticas.md](../../16-Estatisticas.md), [../../17-CasosDeUso.md](../../17-CasosDeUso.md) (UC09).

## Dependências

**Depende de:**
- [passo4.md](passo4.md)
- [passo6.md](passo6.md)

**Desbloqueia:**
- [../sprint8/passo1.md](../sprint8/passo1.md)
- [../sprint8/passo2.md](../sprint8/passo2.md)
- [../sprint8/passo3.md](../sprint8/passo3.md)
