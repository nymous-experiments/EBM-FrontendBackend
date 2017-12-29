<?php

namespace EBM;

use \PDO;

class Database
{

    /**
     * @var PDO
     */
    private $pdo;

    public function __construct(string $db_name, string $db_host, string $db_user, string $db_password)
    {
        $this->pdo = new PDO("mysql:dbname=$db_name;host=$db_host", $db_user, $db_password);
    }

    /**
     * Run a query against the database
     * @param string $query SQL query to run
     * @param bool $onlyOne Return a single result if true
     * @return array|mixed
     */
    public function query(string $query, bool $onlyOne = false)
    {
        $req = $this->pdo->query($query);
        // No need to fetch for these operations
        if (strpos($query, 'UPDATE') === 0
            || strpos($query, 'INSERT') === 0
            || strpos($query, 'DELETE') === 0
        ) {
            return $req;
        }
        $req->setFetchMode(PDO::FETCH_OBJ);
        if ($onlyOne) {
            $res = $req->fetch();
        } else {
            $res = $req->fetchAll();
        }
        return $res;
    }

    /**
     * Run a prepared statement against the database
     * @param string $query SQL query to run, variable parts are replaced with `?`
     * @param array $attributes Variables array, to replace the `?` with
     * @param bool $onlyOne Return a single result if true
     * @return array|mixed
     */
    public function prepare(string $query, array $attributes, bool $onlyOne = false)
    {
        $req = $this->pdo->prepare($query);
        $req->setFetchMode(PDO::FETCH_OBJ);
        $res = $req->execute($attributes);
        // No need to fetch for these operations
        if (strpos($query, 'UPDATE') === 0
            || strpos($query, 'INSERT') === 0
            || strpos($query, 'DELETE') === 0
        ) {
            return $res;
        }

        if ($onlyOne) {
            $res = $req->fetch();
        } else {
            $res = $req->fetchAll();
        }

        return $res;
    }

    /**
     * Get last inserted id
     * @return string
     */
    public function lastInsertId()
    {
        return $this->pdo->lastInsertId();
    }
}
