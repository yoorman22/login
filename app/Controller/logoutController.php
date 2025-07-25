<?php


// Destruir todas las variables de sesión
session_unset();
session_destroy();

// Iniciar una nueva sesión para el mensaje de logout
session_start();
$_SESSION['mensaje_logout'] = "Has cerrado sesión exitosamente.";

// Redirigir al login
header("Location: index.php?pagina=login");
exit;
