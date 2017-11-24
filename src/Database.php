<?php

namespace EBM;

require_once __DIR__ . "/../config.php";

class Database
{

    /**
     * @var PDO
     */
    private $pdo;

    public function __construct()
    {
        global $db_name;
        global $db_host;
        global $db_user;
        global $db_password;
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
        $req->execute($attributes);

        if ($onlyOne) {
            $res = $req->fetch();
        } else {
            $res = $req->fetchAll();
        }

        return $res;
    }
}
