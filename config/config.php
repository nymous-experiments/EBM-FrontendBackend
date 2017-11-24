<?php

use Dotenv\Dotenv;

if (getenv('ENVIRONMENT' !== 'production')) {
    $dotenv = new Dotenv(ROOT);
    $dotenv->load();
}

return [
    "db_name" => getenv('DB_NAME'),
    "db_host" => getenv('DB_HOST'),
    "db_user" => getenv('DB_USER'),
    "db_password" => getenv('DB_PASSWORD')
];
