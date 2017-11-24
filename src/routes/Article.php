<?php

class Article
{

    public static function getArticles(Database $db)
    {
        $articles = $db->query("SELECT * FROM np_articles");
        return json_encode($articles);
    }

    public static function getArticleById(Database $db, int $id)
    {
        $article = $db->prepare("SELECT * FROM np_articles WHERE id=?", [$id], true);

        // $article is false if the query returned nothing
        if ($article) {
            return json_encode($article);
        } else {
            http_response_code(404);
            $error = ["error" => "Article not found"];
            return json_encode($error);
        }
    }
}
