<?php

namespace EBM;

/**
 * Utils functions (mostly static)
 *
 * @package EBM
 */
class Utils
{

    /**
     * Check if a value is an integer
     *
     * @param $value
     * @return bool
     */
    public static function isInteger($value): bool
    {
        return (is_numeric($value) && (int)(+$value) === +$value);
    }

    /**
     * Get HTTP request body, and parse it as JSON
     * @return mixed the body parsed as JSON, or <b>NULL</b> if it cannot be decoded
     */
    public static function parseRequestBody()
    {
        return json_decode(file_get_contents("php://input"));
    }
}
