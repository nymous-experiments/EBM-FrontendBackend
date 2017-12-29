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

$route = explode("/", trim($path, '/')); // Trim the trailing slash
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

        if (!empty($real_route)) {
            $articleId = $real_route[0];
            if (Utils::isInteger($articleId)) { // Check if id is an integer
                array_shift($real_route);
                if (!empty($real_route)) {
                    if ($real_route[0] === "paragraphs") {
                        // /articles/1/paragraphs
                        switch ($_SERVER["REQUEST_METHOD"]) {
                            // POST /articles/1/paragraphs
                            case "POST":
                                $body = Utils::parseRequestBody();
                                if (is_null($body) || !property_exists($body, "content")) {
                                    $response = Error::badBody();
                                    break 2; // Break from outer switch/case (2 levels)
                                }
                                $response = Article::createParagraph($db, $articleId, $body->content);
                                break 2;
                        }
                    }
                } else {
                    // /articles/1
                    switch ($_SERVER["REQUEST_METHOD"]) {
                        // GET /articles/1
                        case "GET":
                            $response = Article::getArticleById($db, $articleId);
                            break 2;
                        // PATCH /articles/1
                        case "PATCH":
                            $body = Utils::parseRequestBody();
                            if (is_null($body) || !property_exists($body, "title")) {
                                $response = Error::badBody();
                                break 2;
                            }
                            $response = Article::updateArticleTitle($db, $articleId, $body->title);
                            break 2;
                    }
                }
            } else {
                $response = Error::wrongQuery();
                break;
            }
        } else {
            // /articles
            switch ($_SERVER["REQUEST_METHOD"]) {
                case "GET":
                    // GET /articles
                    $response = Article::getArticles($db);
                    break 2;
                case "POST":
                    // POST /articles
                    $body = Utils::parseRequestBody();
                    if (is_null($body) || !property_exists($body, "title")) {
                        $response = Error::badBody();
                        break 2;
                    }
                    $response = Article::createArticle($db, $body->title);
                    break 2;
            }
        }
    // no break
    case "paragraphs":
        // Remove matched part of the route
        array_shift($real_route);

        if (!empty($real_route)) {
            $paragraphId = $real_route[0];
            if (Utils::isInteger($paragraphId)) { // Check if id is an integer
                // /paragraphs/1
                switch ($_SERVER["REQUEST_METHOD"]) {
                    // GET /paragraphs/1
                    case "GET":
                        $response = Article::getParagraphById($db, $paragraphId);
                        break 2;
                    // PATCH /paragraphs/1
                    case "PATCH":
                        $body = Utils::parseRequestBody();
                        if (is_null($body) || (property_exists($body, "content") && property_exists($body, "order"))) {
                            $response = Error::badBody();
                            break 2;
                        } elseif (property_exists($body, "content")) {
                            $response = Article::updateParagraphContent($db, $paragraphId, $body->content);
                            break 2;
                        } elseif (property_exists($body, "order")) {
                            $response = Article::updateParagraphOrder($db, $paragraphId, $body->order);
                            break 2;
                        }
                        else {
                            $response = Error::badBody();
                            break 2;
                        }
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
