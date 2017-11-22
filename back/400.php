<?php

http_response_code(400);

$error = [
    "error" => "Wrong query"
];

echo(json_encode($error));
