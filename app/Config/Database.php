<?php

namespace App\Config;

use PDO;
use PDOException;
use PDOStatement; // Importa PDOStatement
use App\Interfaces\IDatabase; // Importa la interfaz IDatabase

class Database implements IDatabase // La clase Database ahora implementa IDatabase
{
    private $host = 'localhost';
    private $db = 'berilion';
    private $user = 'root'; 
    private $pass = '';       
    private $charset = 'utf8mb4'; // Usar utf8mb4 para mejor compatibilidad con emojis y caracteres especiales
    private ?PDO $pdo = null;     // La conexión PDO se almacena aquí. Inicialmente null.
    private ?PDOStatement $stmt = null; // Para almacenar la última sentencia preparada/ejecutada

    /**
     * Constructor de la clase Database.
     * Intenta establecer la conexión al ser instanciada.
     */
    public function __construct() {
        $this->connect(); // Conecta automáticamente al construir la instancia
    }

    /**
     * Establece la conexión a la base de datos PDO.
     * Implementa el método de la interfaz IDatabase.
     * @return PDO Retorna la instancia de PDO.
     */
    public function connect(): PDO {
        if ($this->pdo === null) { // Solo conecta si no hay una conexión activa
            try {
                $dsn = "mysql:host=$this->host;dbname=$this->db;charset=$this->charset";
                $this->pdo = new PDO($dsn, $this->user, $this->pass);
                $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC); // Configurar modo de fetch por defecto
            } catch (PDOException $e) {
                error_log("Error de conexión a la base de datos: " . $e->getMessage());
                // En un entorno de producción, es mejor lanzar una excepción personalizada
                // o redirigir a una página de error, en lugar de 'die()'.
                die("Error de conexión a la base de datos: " . $e->getMessage());
            }
        }
        return $this->pdo;
    }

    /**
     * Prepara una sentencia SQL.
     * Implementa el método de la interfaz IDatabase.
     * @param string $sql La sentencia SQL a preparar.
     * @return PDOStatement Retorna un objeto PDOStatement.
     */
    public function prepare(string $sql): PDOStatement {
        if ($this->pdo === null) {
            $this->connect(); // Asegura que la conexión esté activa
        }
        $this->stmt = $this->pdo->prepare($sql);
        return $this->stmt;
    }

    /**
     * Ejecuta una consulta SQL directamente y devuelve los resultados.
     * Implementa el método de la interfaz IDatabase.
     * @param string $sql La sentencia SQL a ejecutar.
     * @return array Retorna un array de filas como resultados.
     */
    public function query(string $sql): array {
        if ($this->pdo === null) {
            $this->connect();
        }
        $this->stmt = $this->pdo->query($sql);
        return $this->stmt->fetchAll();
    }

    /**
     * Ejecuta una sentencia SQL preparada con parámetros y devuelve los resultados.
     * Implementa el método de la interfaz IDatabase.
     * @param string $sql La sentencia SQL a ejecutar.
     * @param array $params Un array asociativo de parámetros para la sentencia preparada.
     * @return array Retorna un array de filas como resultados (para SELECT) o un array vacío.
     */
    public function execute(string $sql, array $params = []): array {
        if ($this->pdo === null) {
            $this->connect();
        }
        $this->stmt = $this->pdo->prepare($sql);
        $this->stmt->execute($params);
        
        // Intentar obtener resultados solo si la consulta no es INSERT/UPDATE/DELETE
        // y si hay resultados disponibles.
        if (strpos(strtoupper($sql), 'SELECT') === 0) {
            return $this->stmt->fetchAll();
        }
        return []; // Retorna un array vacío para operaciones que no devuelven resultados (INSERT, UPDATE, DELETE)
    }

    /**
     * Obtiene el número de filas afectadas por la última operación DML.
     * Implementa el método de la interfaz IDatabase.
     * @return int El número de filas afectadas.
     */
    public function rowCount(): int {
        return $this->stmt ? $this->stmt->rowCount() : 0;
    }

    /**
     * Obtiene el ID de la última fila insertada.
     * Implementa el método de la interfaz IDatabase.
     * @return string|false El ID de la última fila insertada o false en caso de error.
     */
    public function lastInsertId(): string|false {
        return $this->pdo ? $this->pdo->lastInsertId() : false;
    }
}
