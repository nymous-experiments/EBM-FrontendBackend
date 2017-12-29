<?php

namespace EBM;

use EBM\Routes\Article;
use EBM\Routes\Error;

$config = Config::getInstance(ROOT . "/config/config.php");

$db = new Database(
    $config->get("db_name"),
    $config->get("db_host"),
    $config->get("db_user"),
    $config->get("db_password")
);

$route = explode("/", $path);
// TODO Check if case when index.php isn't at the root URL is handled correctly
// (eg. for Wamp installation, project is at http://localhost/folder_name/index.php
// and route is then "folder_name/index.php")

$script_name = explode("/", $_SERVER['SCRIPT_NAME']);
$real_route = array_values(array_diff($route, $script_name));

array_shift($real_route); // Remove "api" from the route

switch ($real_route[0]) {
    case "articles":
        // Remove matched part of the route
        array_shift($real_route);

        // GET /articles/1
        // If route ends with a trailing slash, $real_route[0] ends with ""
        if (!empty($real_route) && $real_route[0] !== "") {
            $id = $real_route[0];
            if (Utils::isInteger($id)) { // Check if id is an integer
                $response = Article::getArticleById($db, $id);
                break;
            } else {
                $response = Error::wrongQuery();
                break;
            }
        } else {
            switch ($_SERVER["REQUEST_METHOD"]) {
                case "GET":
                    // GET /articles
                    $response = Article::getArticles($db);
                    break 2; // Break from outer switch/case
                case "POST":
                    // POST /articles
                    $body = Utils::parseRequestBody();
                    if (is_null($body) || !property_exists($body, "title")) {
                        $response = Error::badBody();
                        break 2;
                    }
                    $response = Article::createArticle($db, $body->title);
                    break 2; // Break from outer switch/case
            }
        }
    // no break
    case "paragraphs":
        // Remove matched part of the route
        array_shift($real_route);

        // If route ends with a trailing slash, $real_route[0] ends with ""
        if (!empty($real_route) && $real_route[0] !== "") {
            $id = $real_route[0];
            if (Utils::isInteger($id)) { // Check if id is an integer
                switch ($_SERVER["REQUEST_METHOD"]) {
                    // GET /paragraphs/1
                    case "GET":
                        $response = Article::getParagraphById($db, $id);
                        break 2;
                    // PATCH /paragraphs/1
                    case "PATCH":
                        $body = Utils::parseRequestBody();
                        if (is_null($body) || !property_exists($body, "content")) {
                            $response = Error::badBody();
                            break 2;
                        }
                        $response = Article::updateParagraphContent($db, $id, $body->content);
                        break 2; // Break from outer switch/case
                }
            }
        }
        // no break
    default:
        $response = Error::wrongQuery();
        break;
}

header("Content-Type: application/json");

echo($response);
