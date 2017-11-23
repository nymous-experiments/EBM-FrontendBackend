<?php

use Dotenv\Dotenv;

$dotenv = new Dotenv(__DIR__);
$dotenv->load();

$db_name = getenv('DB_NAME');
$db_host = getenv('DB_HOST');
$db_user = getenv('DB_USER');
$db_password = getenv('DB_PASSWORD');
