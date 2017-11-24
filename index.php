<?php

if (!defined('ROOT')) {
    define('ROOT', __DIR__);
}

// Require Composer autoloader
require_once ROOT . '/vendor/autoload.php';

$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
if (!file_exists($path)) {
    require_once ROOT . "/src/api.php";
} else {
    return false;
}
