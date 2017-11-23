<?php

require_once __DIR__ . '/vendor/autoload.php';

$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
if (!file_exists($path)) {
    require_once __DIR__ . "/src/api.php";
} else {
    return false;
}
