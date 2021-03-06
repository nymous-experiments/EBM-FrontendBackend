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

    public static function getArticleById(Database $db, int $article_id)
    {
        $article = $db->prepare("SELECT id, title FROM np_articles WHERE id=?", [$article_id], true);

        // $article is false if the query returned nothing
        if ($article) {
            $paragraphs = $db->prepare(
                "SELECT id, content, `order`
                FROM np_paragraphs
                WHERE article_id=?
                ORDER BY `order`",
                [$article->id]
            );
            $article_with_paragraphs = [
                "id" => $article->id,
                "title" => $article->title,
                "paragraphs" => $paragraphs
            ];
            return json_encode($article_with_paragraphs);
        } else {
            http_response_code(404);
            $error = ["error" => "Article not found"];
            return json_encode($error);
        }
    }

    public static function getParagraphById(Database $db, int $paragraph_id)
    {
        $paragraph = $db->prepare("SELECT id, content, `order` FROM np_paragraphs WHERE id=?", [$paragraph_id], true);

        // $paragraph is false if the query returned nothing
        if ($paragraph) {
            return json_encode($paragraph);
        } else {
            http_response_code(404);
            $error = ["error" => "Paragraph not found"];
            return json_encode($error);
        }
    }

    public static function createArticle(Database $db, string $title)
    {
        $article = $db->prepare("INSERT INTO np_articles SET title=?", [$title]);

        // $article is false if the query failed
        if ($article) {
            $id = $db->lastInsertId();
            http_response_code(201);
            return self::getArticleById($db, $id);
        } else {
            http_response_code(404);
            $error = ["error" => "Article not created"];
            return json_encode($error);
        }
    }

    public static function createParagraph(Database $db, int $article_id, string $content)
    {
        $paragraph = $db->prepare(
            "INSERT INTO np_paragraphs (article_id, content, `order`)
            SELECT ?, ?, max(`order`) + 1
            FROM np_paragraphs
            WHERE article_id=?",
            [$article_id, $content, $article_id]
        );

        // $paragraph is false if the query failed
        if ($paragraph) {
            $id = $db->lastInsertId();
            http_response_code(201);
            return self::getParagraphById($db, $id);
        } else {
            http_response_code(404);
            $error = ["error" => "Paragraph not created"];
            return json_encode($error);
        }
    }

    public static function updateArticleTitle(Database $db, int $article_id, string $title)
    {
        $article = $db->prepare("UPDATE np_articles SET title=? WHERE id=?", [$title, $article_id]);

        // $article is false if the query failed
        if ($article) {
            return self::getArticleById($db, $article_id);
        } else {
            http_response_code(404);
            $error = ["error" => "Article not updated"];
            return json_encode($error);
        }
    }

    public static function updateParagraphContent(Database $db, int $paragraph_id, string $content)
    {
        $paragraph = $db->prepare(
            "UPDATE np_paragraphs SET content=? WHERE id=?",
            [$content, $paragraph_id]
        );

        // $paragraph is false if the query failed
        if ($paragraph) {
            return self::getParagraphById($db, $paragraph_id);
        } else {
            http_response_code(404);
            $error = ["error" => "Paragraph not updated"];
            return json_encode($error);
        }
    }

    public static function updateParagraphOrder(Database $db, int $paragraph_id, int $new_order)
    {

        //TODO Requêtes à simplifier (deux en une) ?
        $old_order = $db->prepare("SELECT `order` FROM np_paragraphs WHERE id=?", [$paragraph_id], true);
        $article_id = $db->prepare("SELECT article_id FROM np_paragraphs WHERE id=?", [$paragraph_id], true);

        //$old_order and $article_id are false if the query failed
        if ($old_order && $article_id) {
            $old_order = (int)$old_order->order;
            $article_id = (int)$article_id->article_id;
            if ($new_order > $old_order) {
                $paragraphs_to_move = $db->prepare(
                    "UPDATE np_paragraphs
                    SET `order` = `order`-1
                    WHERE article_id=? AND `order`>? AND `order`<=?",
                    [$article_id, $old_order, $new_order]
                );
            } elseif ($new_order < $old_order) {
                $paragraphs_to_move = $db->prepare(
                    "UPDATE np_paragraphs
                    SET `order` = `order`+1
                    WHERE article_id=? AND `order`>=? AND `order`<?",
                    [$article_id, $new_order, $old_order]
                );
            } else {
                http_response_code(200);
                $message = ["message" => "Paragraph already at the correct order"];
                return json_encode($message);
            }

            $paragraph = $db->prepare(
                "UPDATE np_paragraphs SET `order`=? WHERE id=?",
                [$new_order, $paragraph_id]
            );

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

    public static function deleteParagraph(Database $db, int $paragraph_id)
    {
        $paragraph = $db->prepare("DELETE FROM np_paragraphs WHERE id=?", [$paragraph_id]);

        // $paragraph is false if the query failed
        if ($paragraph) {
            http_response_code(204);
            return "";
        } else {
            http_response_code(404);
            $error = ["error" => "Paragraph not deleted"];
            return json_encode($error);
        }
    }

    public static function deleteArticle(Database $db, int $article_id)
    {
        $paragraphs = $db->prepare("DELETE FROM np_paragraphs WHERE article_id=?", [$article_id]);
        $article = $db->prepare("DELETE FROM np_articles WHERE id=?", [$article_id]);

        // $paragraphs and $article are false if the queries failed
        if ($paragraphs && $article) {
            http_response_code(204);
            return "";
        } else {
            http_response_code(404);
            $error = ["error" => "Article not deleted"];
            return json_encode($error);
        }
    }
}
