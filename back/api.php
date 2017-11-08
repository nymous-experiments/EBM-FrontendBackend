<?php

header("Content-Type: application/json");

$toto = explode("/", $path);

echo json_encode($toto);
