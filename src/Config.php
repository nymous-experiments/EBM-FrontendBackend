<?php

namespace EBM;

class Config
{

    private $settings = [];
    private static $instance;

    /**
     * Get config instance
     * @param string $file Path to the configuration file to load
     * @return Config
     */
    public static function getInstance(string $file): self
    {
        if (is_null(self::$instance)) {
            self::$instance = new self($file);
        }
        return self::$instance;
    }

    /**
     * Get config param
     * @param string $key Param name
     * @return mixed|null Null if param does not exist
     */
    public function get(string $key)
    {
        if (!isset($this->settings[$key])) {
            return null;
        }
        return $this->settings[$key];
    }

    /**
     * Config constructor.
     * @param string $file Path to the configuration file to load
     */
    private function __construct(string $file)
    {
        $this->settings = include $file;
    }
}
