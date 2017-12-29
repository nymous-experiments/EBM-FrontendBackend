<?php

namespace EBM\Routes;

class Error
{

    public static function wrongQuery()
    {
        http_response_code(400);

        $error = [
            "error" => "Wrong query"
        ];

        return json_encode($error);
    }

    public static function badBody()
    {
        http_response_code(400);

        $error = [
            "error" => "Bad body"
        ];

        return json_encode($error);
    }
}
