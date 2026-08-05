<?php

$wait = in_array('--wait', $argv, true);

$driver = getenv('DB_CONNECTION') ?: 'mysql';
$host = getenv('DB_HOST') ?: 'db';
$port = getenv('DB_PORT') ?: ($driver === 'pgsql' ? '5432' : '3306');
$database = getenv('DB_DATABASE') ?: 'ibfc';
$username = getenv('DB_USERNAME') ?: 'ibfc';
$password = getenv('DB_PASSWORD') ?: '';

$dsn = match ($driver) {
    'pgsql' => sprintf('pgsql:host=%s;port=%s;dbname=%s', $host, $port, $database),
    default => sprintf('mysql:host=%s;port=%s;dbname=%s', $host, $port, $database),
};

$attempts = $wait ? 60 : 1;

for ($i = 0; $i < $attempts; $i++) {
    try {
        new PDO($dsn, $username, $password);

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
