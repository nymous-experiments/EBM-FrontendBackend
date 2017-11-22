<?php

require("./Database.php");

$db = new Database();

$articles = $db->query("SELECT * FROM np_articles");

echo(json_encode($articles));
