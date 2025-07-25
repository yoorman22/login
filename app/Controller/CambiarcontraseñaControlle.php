<?php
session_start();
require_once __DIR__ . '/../Model/loginModel.php';

$loginModel = new loginModel();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = trim($_POST['token'] ?? '');
    $newPassword = trim($_POST['newPassword'] ?? '');
    $confirmPassword = trim($_POST['confirmPassword'] ?? '');

    if (empty($token) || empty($newPassword) || empty($confirmPassword)) {
        $_SESSION['mensaje'] = 'Por favor, complete todos los campos.';
        header('Location: cambiar.php?token=' . $token);
        exit;
    }

    if ($newPassword !== $confirmPassword) {
        $_SESSION['mensaje'] = 'Las contraseñas no coinciden.';
        header('Location: cambiar.php?token=' . $token);
        exit;
    }

    if ($loginModel->cambiarContraseña($token, $newPassword)) {
        $_SESSION['mensaje'] = 'Su contraseña ha sido cambiada con éxito.';
    } else {
        $_SESSION['mensaje'] = 'El enlace de recuperación es inválido o ha expirado.';
    }

    header('Location: login.php');
    exit;
}

require_once __DIR__ . '/../View/CambiarContraseña.php';
exit;