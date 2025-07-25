<?php

namespace App\Interfaces;

use PDO; 
use PDOStatement; 

interface IDatabase
{
    
    public function connect(): PDO;

    
    public function prepare(string $sql): PDOStatement;

    public function query(string $sql): array;

    public function execute(string $sql, array $params = []): array;
    
    
    public function rowCount(): int;

    public function lastInsertId(): string|false;
}

