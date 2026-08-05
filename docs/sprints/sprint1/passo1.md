# Configurar o banco de dados MySQL

Este é o primeiro passo de todo o projeto: garantir que a aplicação está conectada a um banco MySQL funcional antes de qualquer outra coisa.

## Objetivo

Configurar o arquivo `.env` para usar MySQL e criar o schema (database) vazio que receberá as tabelas do sistema.

## Contexto

O projeto foi gerado a partir do starter kit do Laravel, que vem configurado por padrão com SQLite (`.env.example` traz `DB_CONNECTION=sqlite`). A decisão de arquitetura do projeto ([../../07-BancoDeDados.md](../../07-BancoDeDados.md), seção 7) é usar **MySQL** em desenvolvimento e produção, mantendo SQLite apenas para a suíte de testes automatizados. Sem este passo, nenhuma migration pode ser executada no banco correto.

## Pré-requisitos

- Nenhum passo anterior (este é o primeiro).
- MySQL Server instalado e rodando na máquina de desenvolvimento.
- PHP 8.4 com a extensão `pdo_mysql` habilitada.

## Arquivos que serão criados

- Nenhum arquivo de projeto (apenas o schema no MySQL, ex.: `ibfc`).

## Arquivos que serão modificados

- `.env` — variáveis `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
- `.env.example` — atualizar para refletir MySQL como padrão do projeto (mantendo os valores sensíveis vazios), para que novos desenvolvedores não subam o ambiente com SQLite por engano.

## O que implementar

1. Criar o schema vazio no MySQL (ex.: `CREATE DATABASE ibfc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`).
2. Ajustar o `.env` apontando `DB_CONNECTION=mysql` e preenchendo host, porta, nome do banco, usuário e senha.
3. Ajustar o `.env.example` para documentar a configuração MySQL esperada.
4. Verificar a conexão executando `php artisan migrate:status` (deve conectar sem erro, mesmo que liste migrations pendentes).

Nenhum código de aplicação é escrito neste passo.

## Regras de negócio envolvidas

- Nenhuma regra de negócio direta — é um passo de infraestrutura. Ele viabiliza todas as RNs que dependem de persistência ([../../02-RegrasDeNegocio.md](../../02-RegrasDeNegocio.md)).

## Fluxo

```
Desenvolvedor
    ↓
Cria schema no MySQL
    ↓
Configura .env
    ↓
php artisan migrate:status
    ↓
Conexão validada
```

## Critérios de aceite

- ☐ Schema MySQL criado com charset `utf8mb4`.
- ☐ `.env` com `DB_CONNECTION=mysql` e credenciais corretas.
- ☐ `.env.example` atualizado para MySQL.
- ☐ `php artisan migrate:status` conecta sem erro.
- ☐ Nenhuma credencial real commitada no `.env.example`.

## Observações

- **Armadilha**: o arquivo `database/database.sqlite` existente no repositório é resquício do starter kit — não o apague ainda; a suíte de testes pode referenciá-lo até o passo de testes ser configurado. A configuração de testes (SQLite em memória via `phpunit.xml`) permanece intocada.
- **Boas práticas**: nunca commitar o `.env`; usar senhas fortes mesmo em desenvolvimento se a máquina for compartilhada.
- Referências: [../../07-BancoDeDados.md](../../07-BancoDeDados.md) (seção 7 — ambientes de banco), [../../18-FluxoCompleto.md](../../18-FluxoCompleto.md) (passos 4–7 do setup).

## Dependências

**Depende de:**
- Nenhum (primeiro passo do projeto).

**Desbloqueia:**
- [passo2.md](passo2.md)
