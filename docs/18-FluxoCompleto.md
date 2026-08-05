# 18 — Fluxo Completo (Passo a Passo Operacional)

Este documento descreve o caminho fim-a-fim, desde o setup do ambiente até a consulta de rankings, unindo instalação, banco de dados e uso funcional.

## 1. Setup do ambiente (já realizado neste projeto, descrito para referência)

```
1. Instalar Laravel 13 (scaffold laravel/blank-react-starter-kit com Breeze + Inertia + React)
2. composer install
3. npm install
4. Configurar .env (DB_CONNECTION=mysql, DB_DATABASE, DB_USERNAME, DB_PASSWORD)
5. php artisan key:generate
```

## 2. Criar o banco de dados

```
6. Criar o schema MySQL vazio (ex.: CREATE DATABASE ibfc;)
7. php artisan migrate
   → cria: users, cache, jobs, players, match_days, teams, team_players,
     player_day_stats (e, quando implementada, player_season_stats)
```

## 3. Subir a aplicação em desenvolvimento

```
8. composer run dev
   (roda em paralelo: servidor Laravel, fila, logs via Pail, e o Vite dev server)
```

## 4. Cadastro inicial de jogadores

```
9.  Administrador faz login (Breeze)
10. Acessa "Jogadores" → "Novo Jogador"
11. Cadastra cada jogador da associação (nome, apelido, atributos táticos)
    → overall_base calculado automaticamente (15-CalculoOverall.md)
```

## 5. Criar um Match Day

```
12. Administrador acessa "Dias de Jogo" → "Novo Dia de Jogo"
13. Informa data, número de partidas, número de times, jogadores por time
14. Seleciona, dentre os jogadores ativos, quem está presente naquele dia
```

## 6. Gerar os times

```
15. Administrador confirma a seleção de presentes
16. Sistema executa o algoritmo de balanceamento (14-AlgoritmoDeBalanceamento.md)
17. Times são exibidos na tela — pronto para a partida acontecer em campo
```

## 7. Registrar estatísticas

```
18. Durante ou logo após a partida, Administrador abre o Match Day
19. Lança gols e assistências de cada jogador participante
20. Encerra o Match Day
```

## 8. Atualização automática

```
21. Sistema recalcula current_overall de cada participante (15-CalculoOverall.md)
22. Sistema atualiza player_season_stats de cada participante (16-Estatisticas.md)
```

## 9. Consultar resultados

```
23. Administrador acessa "Estatísticas" para ver rankings atualizados
24. Administrador pode revisitar o histórico de Match Days a qualquer momento
```

## 10. Diagrama consolidado

```
Instalar Laravel + dependências
        │
        ▼
Configurar .env (MySQL) + gerar APP_KEY
        │
        ▼
php artisan migrate
        │
        ▼
composer run dev (sobe app)
        │
        ▼
Login (Breeze)
        │
        ▼
Cadastrar jogadores
        │
        ▼
Criar Match Day + selecionar presentes
        │
        ▼
Gerar times (balanceamento automático)
        │
        ▼
   [partida ocorre em campo]
        │
        ▼
Registrar gols/assistências
        │
        ▼
Encerrar Match Day
        │
        ├──► Recalcular overall
        └──► Atualizar player_season_stats
        │
        ▼
Consultar rankings/histórico
```
