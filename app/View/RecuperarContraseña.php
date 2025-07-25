<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recuperar Contraseña | Berilion</title>
    <?php include_once __DIR__ . '/layouts/head.php'; ?>
    <!-- Incluimos nuestro archivo de estilos personalizados para el login -->
    <link rel="stylesheet" href="public/css/login.css">
</head>
<body>

    <!-- RECUPERACIÓN CENTRADA -->
    <div class="login-card">
        <!-- Logo de la aplicación -->
        <img src="public/img/logo.svg" alt="Berilion Logo" class="login-logo">

        <h2 class="login-title">Recuperar Contraseña</h2>
        <h5 class="login-subtitle">Ingrese su correo electrónico</h5>

        <!-- Mensajes de éxito/error -->
        <?php if (!empty($_SESSION['mensaje'])): ?>
            <div class="alert alert-<?= $_SESSION['tipo_mensaje'] === 'error' ? 'danger' : 'success' ?> alert-dismissible fade show" role="alert">
                <?= htmlspecialchars($_SESSION['mensaje']) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            <?php 
            unset($_SESSION['mensaje']); 
            unset($_SESSION['tipo_mensaje']);
            ?>
        <?php endif; ?>

        <!-- FORMULARIO RECUPERACIÓN -->
        <form id="recoverForm" autocomplete="off" method="POST" action="index.php?pagina=recuperarContraseña">
            <!-- Email -->
            <div class="mb-4">
                <label for="email" class="form-label">Correo Electrónico</label>
                <div class="input-group">
                    <span class="input-group-text">
                        <i class="bi bi-envelope-fill"></i>
                    </span>
                    <input type="email" class="form-control" id="email" name="email" placeholder="Ingrese su correo electrónico" required />
                </div>
            </div>

            <!-- Botón -->
            <div class="d-grid">
                <button type="submit" class="btn btn-login-primary">
                    Recuperar <i class="bi bi-arrow-right ms-1"></i>
                </button>
            </div>
        </form>

        <!-- Enlace para volver al login -->
        <div class="text-center mt-3">
            <a href="index.php?pagina=login" class="text-decoration-none">
                ← Volver al login
            </a>
        </div>
    </div>

    <?php include_once __DIR__ . '/layouts/scripts.php'; ?>
</body>
</html>