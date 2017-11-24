<?php

class Utils
{

    /**
     * Check if a value is an integer
     * @param $value
     * @return bool
     */
    public static function isInteger($value): bool
    {
        return (is_numeric($value) && (int)(+$value) === +$value);
    }
}
