<?php

$wait = in_array('--wait', $argv, true);

$dsn = sprintf(
    'mysql:host=%s;port=%s;dbname=%s',
    getenv('DB_HOST') ?: 'db',
    getenv('DB_PORT') ?: '3306',
    getenv('DB_DATABASE') ?: 'ibfc',
);

$attempts = $wait ? 60 : 1;

for ($i = 0; $i < $attempts; $i++) {
    try {
        new PDO($dsn, getenv('DB_USERNAME') ?: 'ibfc', getenv('DB_PASSWORD') ?: '');

        echo 'database ok'.PHP_EOL;

        exit(0);
    } catch (Throwable) {
        if (! $wait) {
            exit(1);
        }

        sleep(2);
    }
}

fwrite(STDERR, 'database unavailable'.PHP_EOL);

exit(1);
