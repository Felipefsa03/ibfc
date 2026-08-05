# Passe de qualidade: Pint, Larastan e caça a N+1

Higiene final de código antes de considerar o sistema entregue.

## Objetivo

Zerar pendências de formatação (Pint), análise estática (Larastan) e problemas de performance de query (N+1) em todo o código produzido.

## Contexto

Cada sprint exigiu Pint/Larastan limpos nos arquivos tocados, mas um passe integrado pega o que escapou e o que regrediu. A caça a N+1 é o item mais valioso: as telas de Match Day e rankings carregam grafos de relacionamentos ([../../08-Relacionamentos.md](../../08-Relacionamentos.md)) e são as candidatas naturais a queries acidentais em loop.

## Pré-requisitos

- [../sprint7/passo7.md](../sprint7/passo7.md) concluído.

## Arquivos que serão criados

- Nenhum.

## Arquivos que serão modificados

- Qualquer arquivo PHP com apontamentos do Pint/Larastan; Controllers com eager loading faltante.

## O que implementar

1. `vendor/bin/pint` na base inteira; commit das correções de estilo isoladamente (diff de estilo separado de diff de lógica).
2. `vendor/bin/phpstan analyse` (Larastan): zerar erros; onde houver falso positivo real, documentar a exceção no `phpstan.neon` com justificativa.
3. N+1: habilitar `Model::shouldBeStrict()` (ou `preventLazyLoading`) em ambiente local/testes; rodar a suíte e navegar as telas; corrigir cada lazy load acidental com eager loading no Controller.
4. Revisar os índices usados nas consultas de ranking/histórico (EXPLAIN nas queries principais) — volume é baixo, mas a verificação documenta a saúde.

## Regras de negócio envolvidas

- Nenhuma; RNF03 (tempo de resposta) e RNF05 (manutenibilidade).

## Fluxo

```
Pint → Larastan → strict mode + suíte/navegação → correções de eager loading
```

## Critérios de aceite

- ☐ Pint sem alterações pendentes.
- ☐ Larastan zero erros (exceções justificadas por escrito).
- ☐ Suíte completa verde com `preventLazyLoading` ativo.
- ☐ Nenhum N+1 nas telas principais (verificado).

## Observações

- **Boas práticas**: manter `shouldBeStrict()` ativo permanentemente em não-produção após este passe — impede regressões futuras de N+1.
- Referências: [../../03-ArquiteturaMVC.md](../../03-ArquiteturaMVC.md) (seção 11), [../../01-Requisitos.md](../../01-Requisitos.md).

## Dependências

**Depende de:**
- [../sprint7/passo7.md](../sprint7/passo7.md)

**Desbloqueia:**
- [passo4.md](passo4.md)
