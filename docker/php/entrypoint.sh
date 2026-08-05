#!/bin/sh
set -e

cd /var/www/html

# ------------------------------------------------------------------
# Ambiente
# ------------------------------------------------------------------
if [ ! -f .env ]; then
    echo "[entrypoint] .env nao encontrado, criando a partir de .env.example"
    cp .env.example .env
fi

# ------------------------------------------------------------------
# Sincroniza o public/ (com assets de build) para o volume compartilhado
# com o nginx. Garante que rebuilds com assets novos atualizem o volume.
# ------------------------------------------------------------------
if [ -d /opt/ibfc-public ]; then
    cp -a /opt/ibfc-public/. /var/www/html/public/
fi

# ------------------------------------------------------------------
# Permissoes (storage/ e bootstrap/cache graváveis por www-data)
# ------------------------------------------------------------------
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R ug+rwX storage bootstrap/cache 2>/dev/null || true

# ------------------------------------------------------------------
# Aguardar o banco de dados (somente quando DB_HOST é um serviço)
# ------------------------------------------------------------------
if [ -n "${DB_HOST:-}" ] && [ "${DB_HOST}" != "127.0.0.1" ] && [ "${DB_HOST}" != "localhost" ]; then
    echo "[entrypoint] Aguardando banco de dados em ${DB_HOST}:${DB_PORT:-3306}..."
    php /usr/local/bin/healthcheck.php --wait
fi

# ------------------------------------------------------------------
# Dependências PHP (dev / primeiro start fora do build)
# ------------------------------------------------------------------
if [ ! -d vendor ]; then
    echo "[entrypoint] Instalando dependências do Composer..."
    COMPOSER_ARGS="--no-interaction --prefer-dist --no-ansi --optimize-autoloader"
    if [ "${APP_ENV:-local}" = "production" ]; then
        COMPOSER_ARGS="${COMPOSER_ARGS} --no-dev"
    fi
    # shellcheck disable=SC2086
    composer install ${COMPOSER_ARGS}
fi

# ------------------------------------------------------------------
# Chave da aplicação
# ------------------------------------------------------------------
if ! grep -qE '^APP_KEY=.+' .env && [ -z "${APP_KEY:-}" ]; then
    echo "[entrypoint] Gerando APP_KEY..."
    php artisan key:generate --force --no-interaction
fi

# ------------------------------------------------------------------
# Link do storage (uploads públicos)
# ------------------------------------------------------------------
php artisan storage:link --force --no-interaction 2>/dev/null || true

# ------------------------------------------------------------------
# Migrações
# ------------------------------------------------------------------
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "[entrypoint] Executando migrações..."
    php artisan migrate --force --no-interaction
fi

# ------------------------------------------------------------------
# Otimizações por ambiente
# ------------------------------------------------------------------
if [ "${APP_ENV:-local}" = "production" ]; then
    echo "[entrypoint] Aplicando otimizações de produção..."
    php artisan optimize
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan event:cache
else
    php artisan config:clear --no-interaction
    php artisan route:clear --no-interaction
    php artisan view:clear --no-interaction
    php artisan event:clear --no-interaction
fi

exec "$@"
