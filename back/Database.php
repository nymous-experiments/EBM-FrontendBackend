<?php

require_once "./config.php";

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

    public function query(string $query)
    {
        $req = $this->pdo->query($query);
        $req->setFetchMode(PDO::FETCH_OBJ);
        return $req->fetchAll();
    }

    public function prepare(string $query, array $attributes)
    {
        $req = $this->pdo->prepare($query);
        $req->setFetchMode(PDO::FETCH_OBJ);
        $req->execute($attributes);

        return $req->fetchAll();
    }

}
