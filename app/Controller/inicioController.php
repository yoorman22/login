<?php
session_start();

// Verificar si el usuario está logueado
if (!isset($_SESSION['logueado']) || $_SESSION['logueado'] !== true) {
    header("Location: index.php?pagina=login");
    exit;
}

// Cargar la vista de inicio
require_once __DIR__ . '/../View/inicio.php';
