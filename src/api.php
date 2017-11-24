<?php

require_once __DIR__ . "/Database.php";
require_once __DIR__ . "/Utils.php";

$db = new Database();

$route = explode("/", $path);
// TODO Check if case when index.php isn't at the root URL is handled correctly
// (eg. for Wamp installation, project is at http://localhost/folder_name/index.php
// and route is then "folder_name/index.php")

$script_name = explode("/", $_SERVER['SCRIPT_NAME']);
$real_route = array_values(array_diff($route, $script_name));

switch ($real_route[0]) {
    case "articles":
        // Remove matched part of the route
        array_shift($real_route);

        require "routes/Article.php";

        // GET /articles/1
        // If route ends with a trailing slash, $real_route[0] ends with ""
        if (!empty($real_route) && $real_route[0] !== "") {
            $id = $real_route[0];
            if (Utils::isInteger($id)) { // Check if id is an integer
                $response = Article::getArticleById($db, $id);
                break;
            } else {
                // Fall through to default case
            }
        } else {
            // GET /articles/
            $response = Article::getArticles($db);
            break;
        }
    // no break
    default:
        require "routes/EbmError.php";
        $response = EbmError::error400();
        break;
}

header("Content-Type: application/json");

echo($response);
