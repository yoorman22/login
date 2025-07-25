<?php
// visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Carga automática de dependencias de Composer
require 'vendor/autoload.php';

// Usa la clase FrontController desde el namespace App\Controller
use App\Controller\FrontController;

// Instancia el FrontController.

$frontController = new FrontController();

?>
