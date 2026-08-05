# 15 — Cálculo do Overall

## 1. Visão geral

Cada jogador tem dois valores de habilidade:

- **`overall_base`**: calculado a partir da avaliação manual dos 6 atributos táticos, no cadastro/edição. Representa "o quão bom o organizador acha que o jogador é".
- **`current_overall`**: começa igual a `overall_base` e evolui automaticamente com o desempenho real em campo (gols e assistências). Representa "o quão bem o jogador tem jogado na prática".

`current_overall` é o valor usado pelo algoritmo de balanceamento ([14-AlgoritmoDeBalanceamento.md](14-AlgoritmoDeBalanceamento.md)), pois reflete a forma atual do jogador, não apenas a avaliação inicial.

## 2. Cálculo do `overall_base`

Média ponderada dos 6 atributos táticos (`gol`, `sho`, `pas`, `dri`, `def`, `phy`), cada um na escala 0–99:

```
overall_base = arredondar(
    (gol * peso_gol + sho * peso_sho + pas * peso_pas +
     dri * peso_dri + def * peso_def + phy * peso_phy)
    / (peso_gol + peso_sho + peso_pas + peso_dri + peso_def + peso_phy)
)
```

Pesos sugeridos (ajustáveis por decisão do organizador/produto, sem impacto estrutural no sistema):

| Atributo | Peso |
|---|---|
| gol | 1 |
| sho | 1 |
| pas | 1 |
| dri | 1 |
| def | 1 |
| phy | 1 |

Com pesos iguais, a fórmula se reduz a uma média aritmética simples dos 6 atributos.

### Exemplo numérico
Jogador com `gol=10, sho=70, pas=65, dri=68, def=40, phy=72`:

```
overall_base = arredondar((10+70+65+68+40+72) / 6)
             = arredondar(325 / 6)
             = arredondar(54,17)
             = 54
```

## 3. Evolução do `current_overall`

### 3.1 Regra geral
A cada Match Day encerrado, o `current_overall` do jogador é ajustado com base no desempenho daquele dia (`goals`, `assists` em `PlayerDayStat`):

```
bônusBruto = (goals * PONTOS_POR_GOL) + (assists * PONTOS_POR_ASSISTENCIA)
```

Valores sugeridos: `PONTOS_POR_GOL = 0.5`, `PONTOS_POR_ASSISTENCIA = 0.3` (assistência vale menos que gol, mas ainda conta).

### 3.2 Crescimento marginal decrescente (diminishing returns)
Para evitar que um dia excepcional (ex.: 8 gols) infle o overall de forma desproporcional, o bônus bruto passa por uma função de retorno decrescente antes de ser aplicado:

```
bônusAplicado = TETO_BONUS_POR_DIA * (1 - e^(-bônusBruto / FATOR_SUAVIZACAO))
```

Onde:
- `TETO_BONUS_POR_DIA` (ex.: `2`) limita o quanto o overall pode subir em um único Match Day, não importa quantos gols o jogador faça.
- `FATOR_SUAVIZACAO` (ex.: `1.5`) controla a "curva" de saturação — quanto menor, mais rápido o bônus satura perto do teto.

> Interpretação intuitiva: os primeiros gols/assistências do dia valem quase seu valor cheio; gols adicionais além de um certo ponto contribuem cada vez menos para o overall, até praticamente não contribuírem mais.

### 3.3 Teto máximo em relação ao `overall_base`
Além do teto por dia, existe um teto estrutural: `current_overall` nunca pode ultrapassar `overall_base + CRESCIMENTO_MAXIMO_TOTAL` (ex.: `CRESCIMENTO_MAXIMO_TOTAL = 15`). Isso impede que um jogador "descole" de forma irrealista da avaliação tática original.

```
current_overall_novo = MIN(
    current_overall_atual + bônusAplicado,
    overall_base + CRESCIMENTO_MAXIMO_TOTAL
)
```

### 3.4 Possibilidade de queda
Jogadores que participam de um Match Day sem marcar gols/assistências **não sofrem penalidade** nesta versão do sistema (bônus = 0 nesse dia, overall permanece igual). Uma eventual regra de "queda por inatividade prolongada" pode ser adicionada no futuro (ver [19-Roadmap.md](19-Roadmap.md)), mas não faz parte do escopo atual.

## 4. Exemplo numérico completo

Jogador com `overall_base = 54`, `current_overall = 54` (recém-cadastrado), `CRESCIMENTO_MAXIMO_TOTAL = 15` (teto em 69).

**Dia 1**: marca 3 gols, 1 assistência.
```
bônusBruto = 3*0.5 + 1*0.3 = 1.8
bônusAplicado = 2 * (1 - e^(-1.8/1.5)) = 2 * (1 - e^(-1.2)) = 2 * (1 - 0.301) = 2 * 0.699 ≈ 1.40
current_overall_novo = MIN(54 + 1.40, 69) = 55.40 → arredondado para 55
```

**Dia 2**: marca 8 gols, 2 assistências (dia excepcional).
```
bônusBruto = 8*0.5 + 2*0.3 = 4.6
bônusAplicado = 2 * (1 - e^(-4.6/1.5)) = 2 * (1 - e^(-3.07)) = 2 * (1 - 0.0464) ≈ 1.91
current_overall_novo = MIN(55 + 1.91, 69) = 56.91 → arredondado para 57
```

Note que, mesmo com quase o triplo de gols do Dia 1, o ganho do Dia 2 (57-55=2) não é proporcionalmente maior que o do Dia 1 (55-54=1) — a curva de retorno decrescente já limita naturalmente o impacto de desempenhos extremos, e o teto por dia (`TETO_BONUS_POR_DIA = 2`) garante que nenhum dia isolado, por melhor que seja, adicione mais que 2 pontos.

## 5. Quando o recálculo roda

O recálculo de `current_overall` é disparado **uma vez, no momento em que o Match Day é encerrado** (RN08/RN12, [02-RegrasDeNegocio.md](02-RegrasDeNegocio.md)), processando todos os `PlayerDayStat` daquele dia em uma única transação — nunca a cada edição individual de gol/assistência, para evitar recomputar múltiplas vezes durante o lançamento incremental dos dados.

## 6. Onde essa lógica deve viver no código

Toda a fórmula acima pertence a `app/Services/OverallCalculatorService.php` (ver [03-ArquiteturaMVC.md](03-ArquiteturaMVC.md)), nunca dentro do Model `Player` ou do Controller — é uma regra de negócio complexa e testável isoladamente (testes unitários com os exemplos numéricos acima como casos de teste).
