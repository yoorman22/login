<?php
use App\Config\Database;
require_once __DIR__ . '/../Config/Database.php';

class loginModel
{
    private $pdo;

    public function __construct()
    {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function obtenerUsuarioPorUsername($username)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM usuarios WHERE usuario = :usuario LIMIT 1");
        $stmt->execute(['usuario' => $username]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    private function obtenerUsuarioPorEmail($email)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM usuarios WHERE correo = :correo LIMIT 1");
        $stmt->execute(['correo' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    private function actualizarToken($id, $token, $token_expiration)
    {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET token = :token, token_expiration = :token_expiration WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'token' => $token,
            'token_expiration' => $token_expiration
        ]);
    }

    private function obtenerUsuarioPorToken($token)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM usuarios WHERE token = :token LIMIT 1");
        $stmt->execute(['token' => $token]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    private function actualizarContraseña($id, $contrasena)
    {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET contrasena = :contrasena WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'contrasena' => $contrasena
        ]);
    }

    private function limpiarToken($id)
    {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET token = NULL, token_expiration = NULL WHERE id = :id");
        $stmt->execute(['id' => $id]);
    }

    public function recuperarContraseña($email)
    {
        $usuario = $this->obtenerUsuarioPorEmail($email);
        if (!$usuario) {
            return false; // Usuario no encontrado
        }

        $token = bin2hex(random_bytes(16));
        $token_expiration = date('Y-m-d H:i:s', strtotime('+1 hour'));

        $this->actualizarToken($usuario['id'], $token, $token_expiration);

        return $token;
    }

    public function cambiarContraseña($token, $nuevaContraseña)
    {
        $usuario = $this->obtenerUsuarioPorToken($token);
        if (!$usuario || $usuario['token_expiration'] < date('Y-m-d H:i:s')) {
            return false; // Token inválido o expirado
        }

        $hashedPassword = password_hash($nuevaContraseña, PASSWORD_DEFAULT);
        $this->actualizarContraseña($usuario['id'], $hashedPassword);
        $this->limpiarToken($usuario['id']);

        return true;
    }
}