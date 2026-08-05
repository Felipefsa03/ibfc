# 01 — Requisitos

## 1. Requisitos Funcionais (RF)

| ID | Requisito | Descrição |
|---|---|---|
| RF01 | Cadastrar jogador | O sistema deve permitir cadastrar um jogador com nome, apelido (opcional), atributos táticos (Goleiro, Chute, Passe, Drible, Defesa, Físico) e status ativo/inativo. |
| RF02 | Editar jogador | O sistema deve permitir editar os dados cadastrais e atributos de um jogador existente. |
| RF03 | Inativar jogador | O sistema deve permitir marcar um jogador como inativo (`active = false`) em vez de excluí-lo fisicamente, preservando o histórico. |
| RF04 | Listar/consultar jogadores | O sistema deve exibir a lista de jogadores, com filtro por ativo/inativo e busca por nome/apelido. |
| RF05 | Criar Match Day | O sistema deve permitir cadastrar um dia de jogo com data, número de partidas, número de times e número de jogadores por time. |
| RF06 | Selecionar jogadores do dia | O sistema deve permitir escolher, dentre os jogadores ativos, quais estarão presentes em um Match Day. |
| RF07 | Gerar times equilibrados | O sistema deve gerar automaticamente os times de um Match Day, distribuindo os jogadores selecionados de forma balanceada por overall (ver [14-AlgoritmoDeBalanceamento.md](14-AlgoritmoDeBalanceamento.md)). |
| RF08 | Regenerar times | O sistema deve permitir gerar novamente os times de um Match Day (nova tentativa de sorteio/balanceamento), enquanto o dia não tiver estatísticas lançadas. |
| RF09 | Registrar gols e assistências | O sistema deve permitir registrar, por jogador e por Match Day, a quantidade de gols e assistências. |
| RF10 | Recalcular overall automaticamente | Ao registrar/fechar as estatísticas de um Match Day, o sistema deve recalcular o `current_overall` de cada jogador participante (ver [15-CalculoOverall.md](15-CalculoOverall.md)). |
| RF11 | Atualizar estatísticas de temporada | O sistema deve manter um resumo agregado por jogador (`player_season_stats`): jogos, vitórias, empates, derrotas, gols, assistências. |
| RF12 | Consultar histórico de partidas | O sistema deve permitir consultar Match Days passados, os times formados e o resultado. |
| RF13 | Consultar rankings | O sistema deve exibir rankings de artilharia, assistências e vitórias, ordenados de forma decrescente. |
| RF14 | Autenticação | O sistema deve exigir login para acessar as telas de gestão (via Laravel Breeze). |

## 2. Requisitos Não Funcionais (RNF)

| ID | Requisito | Descrição |
|---|---|---|
| RNF01 | Usabilidade | Interface simples, utilizável por um organizador não-técnico, em poucos cliques. |
| RNF02 | Responsividade | A interface deve funcionar bem em celular (uso comum: cadastrar estatísticas em campo, no dia do jogo), via TailwindCSS. |
| RNF03 | Tempo de resposta | Operações de CRUD e geração de times devem responder em menos de 1s sob carga normal (baixo volume de dados). |
| RNF04 | Consistência de dados | Operações que envolvem múltiplas tabelas (ex.: gerar times, fechar estatísticas de um dia) devem ser transacionais (uso de `DB::transaction`). |
| RNF05 | Manutenibilidade | Código deve seguir as convenções do Laravel e os princípios SOLID/Clean Code descritos em [03-ArquiteturaMVC.md](03-ArquiteturaMVC.md). |
| RNF06 | Testabilidade | Regras de negócio críticas (balanceamento, cálculo de overall) devem ser cobertas por testes automatizados (Pest). |

## 3. Regras Técnicas

- **Backend**: PHP 8.4, Laravel 13.
- **Frontend**: Inertia.js v3 + React 19, TailwindCSS v4, roteamento tipado via Laravel Wayfinder.
- **Banco de dados**: MySQL (ambiente de desenvolvimento/produção). SQLite em memória é utilizado apenas na suíte de testes (Pest/PHPUnit), conforme padrão do Laravel.
- **Autenticação**: Laravel Breeze (stack React/Inertia).
- **Testes**: Pest v5 / PHPUnit v13.
- **Qualidade estática**: Larastan (PHPStan para Laravel) e Laravel Pint para formatação.
- **Arquitetura**: MVC tradicional do Laravel, com Inertia substituindo o Blade como camada de renderização (ver [03-ArquiteturaMVC.md](03-ArquiteturaMVC.md)).

> **Nota sobre o stack de frontend**: esta documentação assume Inertia + React porque é o que já está instalado e configurado no projeto (scaffold `laravel/blank-react-starter-kit`, ver `composer.json`, `package.json` e `CLAUDE.md`). Não é utilizado Blade+Bootstrap como camada de views das telas de negócio.

## 4. Dependências principais (já instaladas no projeto)

| Pacote | Versão | Uso |
|---|---|---|
| `laravel/framework` | ^13 | Framework base |
| `inertiajs/inertia-laravel` | ^3.0 | Ponte entre Controllers e páginas React |
| `laravel/breeze` | ^2.4 | Scaffold de autenticação |
| `laravel/wayfinder` | ^0.1 | Geração de funções TS tipadas para rotas/controllers |
| `laravel/pail` | ^1 | Visualização de logs em tempo real |
| `larastan/larastan` | ^3 | Análise estática (PHPStan) |
| `laravel/pint` | ^1 | Formatação de código PHP |
| `pestphp/pest` | ^5 | Framework de testes |
| `@inertiajs/react` | ^3.0.0 | Cliente Inertia para React |
| `react` / `react-dom` | ^19.2.0 | Biblioteca de UI |
| `tailwindcss` | ^4 | Estilização utilitária |

## 5. Escalabilidade

O volume de dados esperado é **baixo**: dezenas de jogadores, alguns Match Days por mês, poucas centenas de registros de estatísticas por temporada. Não há necessidade de filas, cache distribuído ou sharding de banco. As decisões de arquitetura priorizam **simplicidade** sobre escalabilidade horizontal (ver justificativa de não uso de Repository Pattern em [03-ArquiteturaMVC.md](03-ArquiteturaMVC.md)).

## 6. Performance

- Índices já definidos nas migrations existentes: `players.name`, `players.nickname`, `players.active`, `match_days.date` (ver [07-BancoDeDados.md](07-BancoDeDados.md)).
- Uniques compostos evitam dados duplicados sem necessidade de validação adicional em código: `team_players(team_id, player_id)`, `player_day_stats(match_day_id, player_id)`.
- Consultas de ranking devem usar a tabela agregada `player_season_stats` em vez de recalcular somas sobre `player_day_stats` a cada requisição (ver [16-Estatisticas.md](16-Estatisticas.md)).

## 7. Segurança

- Autenticação obrigatória via Breeze para todas as rotas de gestão (`middleware('auth')`).
- Validação de entrada via **Form Requests** dedicados (nunca validar diretamente no Controller com array solto).
- Autorização de ações sensíveis (editar/excluir jogador, gerar times) pode evoluir para **Policies** do Laravel caso surjam múltiplos perfis de usuário no futuro (hoje há apenas o perfil Administrador, ver [17-CasosDeUso.md](17-CasosDeUso.md)).
- Nenhum dado sensível (senha, CPF, dados financeiros) é armazenado além do necessário para autenticação padrão do Breeze (`users.email`, `users.password` com hash).
- Proteção CSRF nativa do Laravel/Inertia em todos os formulários.
