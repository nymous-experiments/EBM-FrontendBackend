<?php

require_once __DIR__ . "/Database.php";
$db = new Database();

$route = explode("/", $path);
// TODO Handle case when index.php isn't at the root URL
// (eg. for Wamp installation, project is at http://localhost/folder_name/index.php and route is then "folder_name/index.php")

// Remove first empty cell
array_shift($route);

switch ($route[0]) {
    case "articles":
        // Remove matched part of the route
        array_shift($route);

        require "routes/Article.php";

        // GET /articles/1
        if (!empty($route) && $route[0] !== "") { // If route ends with a trailing slash
            if (is_numeric($route[0]) && (int)(+$route[0]) === +$route[0]) { // Check if id is an integer
                $response = Article::getArticleById($db, $route[0]);
                break;
            } else {
                // Fall through to default case
            }
        } else {
            // GET /articles/
            $response = Article::getArticles($db);
            break;
        }
    default:
        require "routes/EbmError.php";
        $response = EbmError::error400();
        break;
}

header("Content-Type: application/json");

echo($response);
