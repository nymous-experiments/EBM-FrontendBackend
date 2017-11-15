<?php

header("Content-Type: application/json");

$route = explode("/", $path);

while ($route[0] !== "back") {
    echo $route[0];
    unset($route[0]);
}
unset($route[0]);

echo json_encode($route);
