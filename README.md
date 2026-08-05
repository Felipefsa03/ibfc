# IBFC — Liga de Futebol (Laravel + React)

Aplicação Laravel 13 (PHP 8.4) com Inertia.js + React 19, totalmente conteinerizada
para rodar em qualquer máquina com Docker, pronta para desenvolvimento e produção.

- **Backend:** Laravel 13, PHP 8.4 (FPM/Alpine)
- **Frontend:** Inertia v3, React 19, Vite 8, Tailwind v4
- **Banco:** MySQL 8.4
- **Proxy:** Nginx

---

## 1. Arquitetura

```
ibfc/
├── Dockerfile                    # Imagem single-container (nginx+fpm+supervisord) p/ PaaS
├── docker/
│   ├── php/
│   │   ├── Dockerfile            # Multi-stage (build node+php -> runtime alpine)
│   │   ├── entrypoint.sh         # Bootstrap automático (env, key, migrate, storage, optimize)
│   │   ├── php.ini               # OPcache, limites de upload, timezone, logs
│   │   └── healthcheck.php       # Healthcheck do app via PDO (MySQL)
│   ├── nginx/
│   │   ├── default.conf          # Config do nginx (docker-compose)
│   │   └── platform.conf         # Config do nginx (container único / PaaS)
│   └── supervisord/
│       └── supervisord.conf      # Gerencia nginx + php-fpm no container único
├── docker-compose.yml            # Dev local (padrão)
└── docker-compose.prod.yml       # Override de produção
```

**Serviços (docker-compose):**

| Serviço | Imagem | Porta | Função |
|---|---|---|---|
| `app` | `ibfc-app` | 9000 (interno) | PHP-FPM + entrypoint |
| `nginx` | `nginx:stable-alpine` | **8080** (host) | Web server |
| `db` | `mysql:8.4` | 3306 (interno) | Banco de dados |
| `phpmyadmin` | `phpmyadmin` | **8081** (opcional) | Admin do banco |

O `entrypoint.sh` automatiza, em toda subida:
`key:generate` → `storage:link` → `migrate --force` → (em produção) `optimize`, `config:cache`, `route:cache`, `view:cache`, `event:cache`.

---

## 2. Pré-requisitos

- Docker Engine **24+** e Docker Compose **v2+**
  ```bash
  docker --version && docker compose version
  ```
- Git

---

## 3. Instalação

```bash
git clone <seu-repositorio> ibfc
cd ibfc

cp .env.example .env   # obrigatório (o container monta o .env)

docker compose up -d --build
```

Aguarde o primeiro start (build + migrações). Acesse:

- **http://localhost:8080** → aplicação
- **http://localhost:8080/up** → health check (deve retornar `200 OK`)

> Para usar o phpMyAdmin (opcional):
> ```bash
> docker compose --profile tools up -d
> ```
> Acesse **http://localhost:8081** (host `db`, usuário/senha do `.env`).

---

## 4. Primeiro acesso

As migrações rodam sozinhas. Para popular dados de desenvolvimento:

```bash
docker compose exec app php artisan db:seed --force
```

Se preferir os comandos manuais (equivalentes ao que o entrypoint faz):

```bash
docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate
docker compose exec app php artisan storage:link
```

---

## 5. Comandos úteis

| Ação | Comando |
|---|---|
| Ver status | `docker compose ps` |
| Ver logs do app | `docker compose logs -f app` |
| Ver logs do nginx | `docker compose logs -f nginx` |
| Ver logs do banco | `docker compose logs -f db` |
| Parar | `docker compose down` |
| Parar e apagar dados do banco/uploads | `docker compose down -v` |
| Reiniciar | `docker compose restart` |
| Rebuild com novas dependências | `docker compose up -d --build` |
| Tinker | `docker compose exec app php artisan tinker` |
| Artisan | `docker compose exec app php artisan <comando>` |

### Acessar o banco de dados

Pelo phpMyAdmin (porta 8081) ou pela CLI dentro do container `db`:

```bash
docker compose exec db mysql -u ibfc -p ibfc
# senha: a mesma de DB_PASSWORD no .env (padrão: ibfc_secret)
```

O MySQL **não é exposto** para a máquina host por padrão (apenas na rede interna do Docker).

---

## 6. Como atualizar a aplicação

```bash
git pull
docker compose up -d --build
```

O entrypoint aplica as migrações novas e recompila caches automaticamente.

---

## 7. Produção (VPS / Docker)

O override de produção builda sem dependências de dev (`--no-dev`) e liga as otimizações:

```bash
# edite o .env no servidor (APP_ENV=production, APP_DEBUG=false, APP_KEY gerada,
# DB_PASSWORD forte, APP_URL=https://seu-dominio)
cp .env.example .env
php artisan key:generate   # ou gere uma APP_KEY=base64:... válida

docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

O que muda em produção:

| Item | Valor |
|---|---|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `LOG_CHANNEL` | `daily` |
| `LOG_LEVEL` | `warning` |
| Vendor | sem `pest/pint/phpunit` |
| Caches | `optimize`, `config`, `route`, `view`, `event` |

**Dica:** coloque um reverse proxy (Caddy/Nginx/Cloudflare) na frente da porta 8080 para obter HTTPS automático.

---

## 8. Deploy em plataforma gratuita (PaaS)

O projeto inclui um **`Dockerfile` na raiz** para plataformas que constroem um único
container (nginx + php-fpm + supervisord, porta **80**). Nessas plataformas:

1. Crie um repositório Git e envie este projeto (o `.env` e `vendor/` **não** são commitados).
2. Na plataforma, aponte o build para o **Dockerfile** (raiz).
3. Configure as variáveis de ambiente (abaixo).
4. Deploy — o entrypoint cria `.env`, gera `APP_KEY`, roda `migrate` e otimiza sozinho.

**Variáveis de ambiente mínimas na plataforma:**

```
APP_ENV=production
APP_DEBUG=false
APP_KEY=<gerada>
APP_URL=https://<sua-url>
DB_CONNECTION=mysql
DB_HOST=<host do banco da plataforma>
DB_PORT=3306
DB_DATABASE=<nome>
DB_USERNAME=<usuario>
DB_PASSWORD=<senha>
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
RUN_MIGRATIONS=true
```

> **Atenção aos uploads:** em PaaS o disco é efêmero. Para arquivos persistirem,
> use um **volume persistente** (Railway Volume, Render Disk, Fly Volume) montado em
> `/var/www/html/storage` **ou** armazenamento em nuvem (S3/R2 — defina
> `FILESYSTEM_DISK=s3` e as credenciais AWS).

### Comparativo das plataformas

| Plataforma | Grátis | Banco MySQL grátis | Sleep/suspensão | Observações |
|---|---|---|---|---|
| **Railway** | ~US$5 de crédito/mês | Sim (via plugin, com custo) | Não | Sem limitação de instâncias; cobra por uso além do crédito |
| **Render** | 1 web service + 1 Postgres (usos limitados) | Não MySQL free (há Postgres free) | **Sim** (suspende após inatividade ~15min) | Mais simples p/ Laravel; cold start ~50s |
| **Fly.io** | crédito mensal (limite de máquinas) | Não (use Volume p/ dados) | Não (mas conta vence o limite) | Requer cartão; preços por uso |
| **Koyeb** | 1 app free + 1 Postgres free | Não (Postgres free) | **Sim** (com economia de energia) | Dockerfile direto; bom para testes |
| **Oracle Cloud Always Free** | VM/instância 24/7 **permanente** | **Sim** (MySQL/PostgreSQL Autonômico) | **Não** | O mais robusto "grátis para sempre", porém setup manual |

**Recomendações:**
- **Melhor custo zero real:** Oracle Cloud Always Free (VM 24/7 + MySQL autônomo). Setup manual (VM + Docker Compose + reverse proxy).
- **Mais simples para começar:** Render ou Koyeb (git push → pronto), mas suspendem o serviço em inatividade.
- **Uploads/arquivos:** em qualquer uma, monte um volume persistente ou use S3/R2.

---

## 9. Logs

- **Laravel:** `storage/logs/laravel.log` (acesse com `docker compose exec app tail -f storage/logs/laravel.log`)
- **PHP-FPM:** `docker compose logs -f app`
- **Nginx:** `docker compose logs -f nginx`

---

## 10. Segurança

- `.env` e credenciais **não** são commitados (`.gitignore`).
- Nginx bloqueia arquivos ocultos (`/.env`, `/.git*` → 403).
- Produção usa `APP_DEBUG=false` e `LOG_LEVEL=warning`.
- MySQL não é exposto ao host.
- **Troque as senhas padrão** (`DB_PASSWORD`, `MYSQL_ROOT_PASSWORD`) no `.env` antes de publicar.
- **Não utilize o `DatabaseSeeder` com credenciais hardcoded em produção** — prefira usuários criados por formulário de registro ou via `env()`.

---

## 11. Solução de problemas

| Sintoma | Correção |
|---|---|
| `Unable to locate file in Vite manifest` | Rebuild: `docker compose up -d --build` |
| Porta 8080 ocupada | Altere `APP_PORT` no `.env` |
| Banco não conecta | Confira `DB_HOST=db` e credenciais no `.env`; veja `docker compose logs app` |
| Mudanças de código não aparecem | `docker compose up -d --build` (assets são compilados na imagem) |
| `docker compose up` falha no `.env` | Rode `cp .env.example .env` antes |
