# Checklist final: cobertura de testes e conformidade com as regras de negócio

O último passo do projeto: verificação sistemática de que tudo o que foi documentado foi implementado e está protegido por teste.

## Objetivo

Percorrer todas as RNs (RN01–RN15) e RFs (RF01–RF14) da documentação, confirmando implementação e cobertura de teste de cada uma; preencher lacunas encontradas.

## Contexto

Os documentos [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md) e [../../01-Requisitos.md](../../01-Requisitos.md) são o contrato do sistema. Este passo transforma o contrato em checklist auditável: cada regra → onde está implementada → qual teste a protege. Lacunas de teste são preenchidas aqui; lacunas de implementação (se houver) voltam ao passo da sprint correspondente antes do aceite final.

## Pré-requisitos

- [passo1.md](passo1.md), [passo2.md](passo2.md) e [passo3.md](passo3.md) concluídos.

## Arquivos que serão criados

- Possíveis testes complementares para lacunas encontradas.

## Arquivos que serão modificados

- Possíveis correções pontuais apontadas pela auditoria.

## O que implementar

1. Montar a matriz de rastreabilidade (no PR ou em comentário de revisão — **não** criar novo documento sem solicitação): RN/RF → arquivo(s) de implementação → teste(s) que cobrem.
2. Rodar a suíte completa (`php artisan test --compact`) e o build (`npm run build`).
3. Executar manualmente o fluxo completo de [../../18-FluxoCompleto.md](../../18-FluxoCompleto.md), do cadastro ao ranking, como teste de aceitação final.
4. Preencher lacunas de teste identificadas.

## Regras de negócio envolvidas

- Todas (RN01–RN15) — este passo é a auditoria delas.

## Fluxo

```
Matriz RN/RF × implementação × teste
    ↓
Lacunas? → preencher/corrigir
    ↓
Suíte + build + fluxo manual completo
    ↓
Sistema aceito
```

## Critérios de aceite

- ☐ Cada RN01–RN15 mapeada a implementação e teste.
- ☐ Cada RF01–RF14 verificado funcionalmente.
- ☐ Suíte completa verde; build limpo.
- ☐ Fluxo manual de ponta a ponta executado com sucesso.
- ☐ Nenhuma inconsistência conhecida em aberto (a lista da doc 07 foi toda tratada nas sprints).

## Observações

- **Boas práticas**: a matriz de rastreabilidade é o melhor artefato de handover — se o projeto trocar de mãos, ela diz exatamente onde cada regra vive.
- Referências: [../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md), [../../01-Requisitos.md](../../01-Requisitos.md), [../../18-FluxoCompleto.md](../../18-FluxoCompleto.md), [../../19-Roadmap.md](../../19-Roadmap.md).

## Dependências

**Depende de:**
- [passo1.md](passo1.md)
- [passo2.md](passo2.md)
- [passo3.md](passo3.md)

**Desbloqueia:**
- Nada — é o passo final do roteiro. 🎉
