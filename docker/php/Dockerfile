# syntax=docker/dockerfile:1

# ==============================================================================
# IBFC — Laravel 13 + Inertia + React
# Dockerfile multi-stage otimizado para produção.
#
#   STAGE build  -> composer:2 (Debian/glibc, PHP 8.4) + Node 22
#                   instala dependências PHP e compila o frontend (Vite).
#                   Precisa ser glibc porque o Vite/Rollup usa binários nativos
#                   "-gnu" (rollup, tailwind oxide, lightningcss).
#   STAGE runtime -> php:8.4-fpm-alpine (imagem final enxuta)
# ==============================================================================

ARG APP_ENV=local

# ------------------------------------------------------------------------------
# STAGE 1 — Dependências + build do frontend
# ------------------------------------------------------------------------------
# php:8.4-cli é Debian (glibc) — necessário para os binários nativos do
# Rollup/Tailwind/LightningCSS (variantes "-gnu") e compatível com o PHP 8.4.
FROM php:8.4-cli AS build

ARG APP_ENV=local

# Node.js 22 (via NodeSource) + Composer (instalador oficial).
RUN set -eux; \
    apt-get update; \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -; \
    apt-get install -y --no-install-recommends nodejs unzip; \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Fonte completa (node_modules/vendor são ignorados via .dockerignore).
COPY . .

# Dependências PHP. Sem --no-scripts: package:discover roda com o Laravel presente.
RUN if [ "${APP_ENV}" = "production" ]; then \
        composer install --no-interaction --prefer-dist --no-ansi --no-dev --optimize-autoloader; \
    else \
        composer install --no-interaction --prefer-dist --no-ansi --optimize-autoloader; \
    fi

# Frontend: o plugin do Wayfinder invoca `php artisan wayfinder:generate` no build.
RUN npm ci --no-audit --no-fund && npm run build

# ------------------------------------------------------------------------------
# STAGE 2 — Runtime PHP-FPM
# ------------------------------------------------------------------------------
FROM php:8.4-fpm-alpine AS runtime

ARG APP_ENV=local

# Extensões exigidas pelo Laravel e pelo app.
RUN apk add --no-cache \
        curl \
        git \
        unzip \
        libzip-dev \
        icu-dev \
        oniguruma-dev \
        freetype-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        postgresql-dev \
        $PHPIZE_DEPS \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        zip \
        bcmath \
        intl \
        gd \
        exif \
        opcache \
    && docker-php-source delete \
    && apk del $PHPIZE_DEPS

# Composer (para dev: `docker compose exec app composer install`).
COPY --from=build /usr/local/bin/composer /usr/local/bin/composer

# Configuração do PHP, entrypoint e healthcheck.
COPY docker/php/php.ini /usr/local/etc/php/conf.d/zz-laravel.ini
COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/php/healthcheck.php /usr/local/bin/healthcheck.php
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /var/www/html

# Artefatos gerados no stage de build.
COPY --from=build /app/vendor vendor
COPY --from=build /app/public/build public/build

# Fonte da aplicação (storage/logs, bootstrap/cache etc. regenerados no start).
COPY . .

# Espelho do public/ com os assets compilados. O entrypoint sincroniza este
# espelho para o volume compartilhado com o nginx a cada start, garantindo
# que assets novos apareçam mesmo com o volume persistente.
RUN cp -a /var/www/html/public /opt/ibfc-public \
    && php artisan package:discover --ansi \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwX storage bootstrap/cache

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
