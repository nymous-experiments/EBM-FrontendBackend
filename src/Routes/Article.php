<?php

namespace EBM\Routes;

use EBM\Database;

class Article
{

    public static function getArticles(Database $db)
    {
        $articles = $db->query("SELECT id, title FROM np_articles");
        return json_encode($articles);
    }

    public static function getArticleById(Database $db, int $id)
    {
        $article = $db->prepare("SELECT id, title FROM np_articles WHERE id=?", [$id], true);

        // $article is false if the query returned nothing
        if ($article) {
            $paragraphs = $db->prepare("SELECT id, content FROM np_paragraphs WHERE article_id=? ORDER BY `order`", [$article->id]);
            $article_with_paragraphs = ["id" => $article->id,
                                        "title" => $article->title,
                                        "paragraphs" => $paragraphs];
            return json_encode($article_with_paragraphs);
        } else {
            http_response_code(404);
            $error = ["error" => "Article not found"];
            return json_encode($error);
        }
    }

    public static function getParagraphById(Database $db, int $id)
    {
        $paragraph = $db->prepare("SELECT id, content FROM np_paragraphs WHERE id=?", [$id], true);

        // $paragraph is false if the query returned nothing
        if ($paragraph) {
            return json_encode($paragraph);
        } else {
            http_response_code(404);
            $error = ["error" => "Paragraph not found"];
            return json_encode($error);
        }
    }

    public static function createArticle($db, $title)
    {
        $article = $db->prepare("INSERT INTO np_articles SET title=?", [$title]);

        // $article is false if the query failed
        if ($article) {
            $id=$db->lastInsertId();
            return self::getArticleById($db, $id);
        } else {
            http_response_code(404);
            $error = ["error" => "Article not created"];
            return json_encode($error);
        }
    }

    public static function createParagraph($db, $article_id, $content)
    {
        $paragraph = $db->prepare("INSERT INTO np_paragraphs SET article_id=? content=?", [$article_id, $content]);

        // $paragraph is false if the query failed
        if ($paragraph) {
            $id=$db->lastInsertId();
            return self::getParagraphById($db, $id);
        } else {
            http_response_code(404);
            $error = ["error" => "Paragraph not created"];
            return json_encode($error);
        }
    }

    public static function updateArticleTitle($db, $title, $id)
    {
        $article = $db->prepare("UPDATE np_articles SET title=? WHERE id=?", [$title, $id]);

        // $article is false if the query failed
        if ($article) {
            $id=$db->lastInsertId();
            return self::getArticleById($db, $id);
        } else {
            http_response_code(404);
            $error = ["error" => "Article not updated"];
            return json_encode($error);
        }
    }

    public static function updateParagraphContent($db, $content, $id)
{
    $paragraph = $db->prepare("UPDATE np_paragraphs SET content=? WHERE id=?", [$content, $id]);

    // $paragraph is false if the query failed
    if ($paragraph) {
        $id=$db->lastInsertId();
        return self::getParagraphById($db, $id);
    } else {
        http_response_code(404);
        $error = ["error" => "Paragraph not updated"];
        return json_encode($error);
    }
}

    public static function updateParagraphOrder($db, $new_order, $id){

        //Requêtes à simplifier (deux en une) ?
        $old_order = $db->prepare("SELECT `order` FROM np_paragraphs WHERE id=?", [$id]);
        $article_id = $db->prepare("SELECT article_id FROM np_paragraphs WHERE id=?", [$id]);

        //$old_order and $article_id are false if the query failed
        if ($old_order && $article_id) {

                if ($new_order > $old_order) {
                    $paragraphs_to_move = $db->prepare("UPDATE np_paragraphs SET `order` = `order`-1 WHERE article_id=?
                                                AND `order`>? AND `order`<=?", [$article_id, $old_order, $new_order]);
                }

                if ($new_order < $old_order) {
                    $paragraphs_to_move = $db->prepare("UPDATE np_paragraphs SET `order` = `order`-1 WHERE article_id=?
                                                AND `order`>=? AND `order`<?", [$article_id, $new_order, $old_order]);
                }

                else $paragraphs_to_move = false;

                $paragraph = $db->prepare("UPDATE np_paragraphs SET `order`=? WHERE id=?", [$new_order, $id]);

                //$paragraph and $paragraphs_to_move are false if the query failed
                if ($paragraph && $paragraphs_to_move) {
                    return self::getArticleById($db, $article_id);
                } else {
                    http_response_code(404);
                    $error = ["error" => "Paragraph not updated"];
                    return json_encode($error);
                }

        } else {
            http_response_code(404);
            $error = ["error" => "Paragraph not updated"];
            return json_encode($error);
        }

    }
}
