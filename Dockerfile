# syntax=docker/dockerfile:1

# ==============================================================================
# IBFC — Dockerfile DE PLATAFORMA (single-container)
#
# Para deploys em PaaS que constroem um único Dockerfile e exigem HTTP no
# container (Railway, Render, Koyeb, Fly.io, Oracle Cloud Container...).
#
# Neste container rodam juntos: nginx (porta 80) + php-fpm + supervisord,
# com o frontend compilado e o vendor sem dependências de desenvolvimento.
# O entrypoint (docker/php/entrypoint.sh) já trata .env, chave, migrações,
# storage:link e otimizações de produção.
#
# Use localmente:   docker compose up -d  (usa docker/php/Dockerfile)
# Use no PaaS:      apontar o build para o "Dockerfile" na raiz deste repositório
# ==============================================================================

# ------------------------------------------------------------------------------
# STAGE 1 — Dependências + build do frontend
# ------------------------------------------------------------------------------
# php:8.4-cli é Debian (glibc) — necessário para os binários nativos do
# Rollup/Tailwind/LightningCSS (variantes "-gnu") e compatível com o PHP 8.4.
FROM php:8.4-cli AS build

RUN set -eux; \
    apt-get update; \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -; \
    apt-get install -y --no-install-recommends nodejs unzip; \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN composer install --no-interaction --prefer-dist --no-ansi --no-dev --optimize-autoloader \
    && npm ci --no-audit --no-fund \
    && npm run build

# ------------------------------------------------------------------------------
# STAGE 2 — Runtime: nginx + php-fpm + supervisord (porta 80)
# ------------------------------------------------------------------------------
FROM php:8.4-fpm-alpine AS runtime

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
        nginx \
        supervisor \
        $PHPIZE_DEPS \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql \
        mbstring \
        zip \
        bcmath \
        intl \
        gd \
        exif \
        opcache \
    && docker-php-source delete \
    && apk del $PHPIZE_DEPS \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

COPY --from=build /usr/local/bin/composer /usr/local/bin/composer

COPY docker/php/php.ini /usr/local/etc/php/conf.d/zz-laravel.ini
COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/php/healthcheck.php /usr/local/bin/healthcheck.php
COPY docker/nginx/platform.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord/supervisord.conf /etc/supervisord.conf

RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /var/www/html

COPY --from=build /app/vendor vendor
COPY --from=build /app/public/build public/build

COPY . .

# Espelho do public/ para o entrypoint sincronizar a cada start.
RUN cp -a /var/www/html/public /opt/ibfc-public \
    && php artisan package:discover --ansi \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwX storage bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
