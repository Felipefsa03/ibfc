# Criar a PlayerFactory

Factories geram dados falsos realistas para testes e seeders. A `PlayerFactory` é a mais importante do projeto — quase todos os testes das próximas sprints dependem dela.

## Objetivo

Criar `database/factories/PlayerFactory.php`, capaz de gerar jogadores válidos com atributos táticos coerentes.

## Contexto

O Model `Player` já existe (`app/Models/Player.php`) com `$fillable` definido, mas não possui factory. Testes de Feature (Sprint 2 em diante) e o seeder de demonstração ([passo7.md](passo7.md)) precisam criar jogadores de forma rápida e variada. A factory deve produzir dados que respeitem as regras de cadastro (RN01): atributos 0–99, `overall_base` coerente com os atributos, `current_overall` inicial igual ao base.

## Pré-requisitos

- [passo2.md](passo2.md) concluído (tabela `players` existe).

## Arquivos que serão criados

- `database/factories/PlayerFactory.php` (gerada com `php artisan make:factory PlayerFactory --model=Player --no-interaction`).

## Arquivos que serão modificados

- `app/Models/Player.php` — adicionar a trait `HasFactory` caso não esteja presente.

## O que implementar

1. Definição base (`definition()`): nome fake, apelido fake opcional (nem todo jogador tem), os 6 atributos (`gol`, `sho`, `pas`, `dri`, `def`, `phy`) sorteados em faixa realista (ex.: 30–90), `overall_base` calculado como a média dos 6 atributos gerados (coerência com [../../15-CalculoOverall.md](../../15-CalculoOverall.md), seção 2), `current_overall` igual ao `overall_base`, `active` true.
2. Estado nomeado `inactive()`: `active` false — usado nos testes de filtro da Sprint 2.
3. Estado nomeado `goalkeeper()`: atributo `gol` alto (ex.: 70–99) e demais medianos — usado nos testes de balanceamento da Sprint 4.

## Regras de negócio envolvidas

- RN01 (faixas de atributos, `overall_base` derivado, `current_overall` inicial igual ao base) — a factory deve gerar dados que obedeçam a essas regras para que os testes reflitam cenários válidos.

## Fluxo

```
Teste/Seeder
    ↓
Player::factory()->create()  (ou ->goalkeeper(), ->inactive())
    ↓
Factory gera atributos coerentes
    ↓
Banco (registro válido segundo RN01)
```

## Critérios de aceite

- ☐ `Player::factory()->create()` funciona no Tinker/teste sem erro.
- ☐ `overall_base` gerado é a média (arredondada) dos 6 atributos gerados.
- ☐ `current_overall` gerado é igual ao `overall_base`.
- ☐ Estados `inactive()` e `goalkeeper()` funcionam.
- ☐ Nenhum atributo gerado fora de 0–99.

## Observações

- **Boas práticas**: usar `fake()` (helper do Laravel) seguindo a convenção do `UserFactory` existente; estados nomeados em vez de sobrescrever atributos manualmente nos testes ([CLAUDE.md](../../../CLAUDE.md) — usar estados custom de factory quando existirem).
- **Armadilha**: não sortear `overall_base` de forma independente dos atributos — isso criaria jogadores incoerentes e mascararia bugs no cálculo real.
- Referências: [../../10-Models.md](../../10-Models.md), [../../15-CalculoOverall.md](../../15-CalculoOverall.md) (seção 2).

## Dependências

**Depende de:**
- [passo2.md](passo2.md)

**Desbloqueia:**
- [passo6.md](passo6.md)
- [passo7.md](passo7.md)
- [../sprint2/passo8.md](../sprint2/passo8.md)
- [../sprint4/passo4.md](../sprint4/passo4.md)
