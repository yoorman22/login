<?php
session_start();
require_once __DIR__ . '/../Model/loginModel.php';

$loginModel = new loginModel();

// petición POST de login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'login') {
    header('Content-Type: application/json');

    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Complete todos los campos.']);
        exit;
    }

    $usuario = $loginModel->obtenerUsuarioPorUsername($username);

    if ($usuario) {
        if ($password === $usuario['contrasena']) { 
            $_SESSION['usuario'] = [
                'nombre' => $usuario['nombre'],
                'usuario' => $usuario['usuario'],
                'cargo' => $usuario['cargo']
            ];
            $_SESSION['logueado'] = true;
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
    }

    exit;
}


// Capturar mensaje de logout si existe
$mensaje = '';
if (isset($_SESSION['mensaje_logout'])) {
    $mensaje = $_SESSION['mensaje_logout'];
    unset($_SESSION['mensaje_logout']);
}

// Mostrar la vista
require_once __DIR__ . '/../View/login.php';
