<?php

header("Content-Type: application/json");

$route = explode("/", $path);

// Remove first empty cell
array_shift($route);

switch ($route[0]) {
    case "articles":
        // Remove matched part of the route
        array_shift($route);
        include "Article.php";
        break;
    default:
        include "400.php";
        break;
}
