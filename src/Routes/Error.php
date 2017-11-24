<?php

namespace EBM\Routes;

class Error
{

    public static function error400()
    {
        http_response_code(400);

        $error = [
            "error" => "Wrong query"
        ];

        return json_encode($error);
    }
}
