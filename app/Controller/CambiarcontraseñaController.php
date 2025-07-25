<?php
session_start();
require_once __DIR__ . '/../Model/loginModel.php';

$loginModel = new loginModel();

// Obtener el token de la URL
$token = $_GET['token'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newPassword = trim($_POST['newPassword'] ?? '');
    $confirmPassword = trim($_POST['confirmPassword'] ?? '');

    if (empty($token) || empty($newPassword) || empty($confirmPassword)) {
        $_SESSION['mensaje'] = 'Por favor, complete todos los campos.';
        $_SESSION['tipo_mensaje'] = 'error';
        header('Location: index.php?pagina=cambiarContraseña&token=' . $token);
        exit;
    }

    if ($newPassword !== $confirmPassword) {
        $_SESSION['mensaje'] = 'Las contraseñas no coinciden.';
        $_SESSION['tipo_mensaje'] = 'error';
        header('Location: index.php?pagina=cambiarContraseña&token=' . $token);
        exit;
    }

    if ($loginModel->cambiarContraseña($token, $newPassword)) {
        $_SESSION['mensaje'] = 'Su contraseña ha sido cambiada con éxito.';
        $_SESSION['tipo_mensaje'] = 'success';
    } else {
        $_SESSION['mensaje'] = 'El enlace de recuperación es inválido o ha expirado.';
        $_SESSION['tipo_mensaje'] = 'error';
    }

    header('Location: index.php?pagina=login');
    exit;
}

// Verificar si el token es válido antes de mostrar el formulario
if (empty($token)) {
    $_SESSION['mensaje'] = 'Enlace de recuperación inválido.';
    $_SESSION['tipo_mensaje'] = 'error';
    header('Location: index.php?pagina=login');
    exit;
}

// Verificar si el token existe y no ha expirado
$usuario = $loginModel->obtenerUsuarioPorToken($token);
if (!$usuario || $usuario['token_expiration'] < date('Y-m-d H:i:s')) {
    $_SESSION['mensaje'] = 'El enlace de recuperación ha expirado o es inválido.';
    $_SESSION['tipo_mensaje'] = 'error';
    header('Location: index.php?pagina=login');
    exit;
}

require_once __DIR__ . '/../View/CambiarContraseña.php';