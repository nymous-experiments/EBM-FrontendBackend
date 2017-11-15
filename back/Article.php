<?php

require("./Database.php");

$db = new Database();

$articles = $db->query("SELECT * FROM np_articles");

$articles2 = $db->prepare("SELECT * FROM np_articles WHERE title=?", ["C"]);

echo(json_encode($articles[0]));
echo('<br>');
echo(json_encode($articles2));
