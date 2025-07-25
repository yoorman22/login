<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cambiar Contraseña | Berilion</title>
    <?php include_once __DIR__ . '/layouts/head.php'; ?>
    <link rel="stylesheet" href="public/css/login.css">
</head>
<body>

    <!-- CAMBIAR CONTRASEÑA CENTRADO -->
    <div class="login-card">
        <!-- Logo de la aplicación -->
        <img src="public/img/logo.svg" alt="Berilion Logo" class="login-logo">

        <h2 class="login-title">Cambiar Contraseña</h2>
        <h5 class="login-subtitle">Ingrese su nueva contraseña</h5>

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

        <!-- FORMULARIO CAMBIAR CONTRASEÑA -->
        <form id="changeForm" autocomplete="off" method="POST" action="index.php?pagina=cambiarContraseña&token=<?php echo htmlspecialchars($token); ?>">
            <!-- Nueva Contraseña -->
            <div class="mb-3">
                <label for="newPassword" class="form-label">Nueva Contraseña</label>
                <div class="input-group">
                    <span class="input-group-text">
                        <i class="bi bi-lock-fill"></i>
                    </span>
                    <input type="password" class="form-control" id="newPassword" name="newPassword" placeholder="********" required />
                    <span class="input-group-text toggle-password" onclick="togglePassword('newPassword')">
                        <i class="bi bi-eye-fill" id="toggleIcon1"></i>
                    </span>
                </div>
            </div>

            <!-- Confirmar Contraseña -->
            <div class="mb-4">
                <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
                <div class="input-group">
                    <span class="input-group-text">
                        <i class="bi bi-lock-fill"></i>
                    </span>
                    <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" placeholder="********" required />
                    <span class="input-group-text toggle-password" onclick="togglePassword('confirmPassword')">
                        <i class="bi bi-eye-fill" id="toggleIcon2"></i>
                    </span>
                </div>
            </div>

            <!-- Botón -->
            <div class="d-grid">
                <button type="submit" class="btn btn-login-primary">
                    Cambiar Contraseña <i class="bi bi-check ms-1"></i>
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

    <script>
        // Función para mostrar/ocultar la contraseña
        function togglePassword(fieldId) {
            const passwordInput = document.getElementById(fieldId);
            const toggleIcon = fieldId === 'newPassword' ? document.getElementById('toggleIcon1') : document.getElementById('toggleIcon2');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
            } else {
                passwordInput.type = 'password';
                toggleIcon.classList.replace('bi-eye-slash-fill', 'bi-eye-fill');
            }
        }
    </script>
</body>
</html>