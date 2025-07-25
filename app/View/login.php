<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login | Berilion</title>
    <?php include_once __DIR__ . '/layouts/head.php'; ?>
    <!-- Incluimos nuestro archivo de estilos personalizados para el login -->
    <link rel="stylesheet" href="public/css/login.css">
</head>
<body>

    <!-- LOGIN CENTRADO -->
    <div class="login-card">
        <!-- Logo de la aplicación -->
        <img src="public/img/logo.svg" alt="Berilion Logo" class="login-logo">

        <h2 class="login-title">Iniciar Sesión</h2>
        <h5 class="login-subtitle">Coloca tus credenciales de usuario</h5>

        <!-- Mensaje de logout desde $mensaje (controlador lo envía) -->
        <?php if (!empty($mensaje)): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <?= htmlspecialchars($mensaje) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <!-- Mensajes de error desde JS -->
        <div id="message" class="alert d-none"></div>

        <!-- FORMULARIO LOGIN -->
        <form id="loginForm" autocomplete="off">
            <!-- Usuario -->
            <div class="mb-3">
                <label for="username" class="form-label">Usuario</label>
                <div class="input-group">
                    <span class="input-group-text">
                        <i class="bi bi-person-fill"></i>
                    </span>
                    <input type="text" class="form-control" id="username" name="username" placeholder="Ingrese su usuario" required />
                </div>
            </div>

            <!-- Contraseña -->
            <div class="mb-4">
                <label for="password" class="form-label">Contraseña</label>
                <div class="input-group">
                    <span class="input-group-text">
                        <i class="bi bi-lock-fill"></i>
                    </span>
                    <input type="password" class="form-control" id="password" name="password" placeholder="********" required />
                    <span class="input-group-text toggle-password" onclick="togglePassword()">
                        <i class="bi bi-eye-fill" id="toggleIcon"></i>
                    </span>
                </div>
            </div>

            <!-- Botón -->
            <div class="d-grid">
                <button type="submit" class="btn btn-login-primary">
                    Ingresar <i class="bi bi-box-arrow-in-right ms-1"></i>
                </button>
            </div>
        </form>

        <!-- Enlace para recuperar la contraseña -->
             <p class="recover-card">
              <a href="RecuperarContraseña.php">¿Olvidaste tu contraseña?</a>
            </p>
    </div>

    <?php include_once __DIR__ . '/layouts/scripts.php'; ?>
    <script src="public/js/login.js"></script>

    <script>
        // Función para mostrar/ocultar la contraseña
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleIcon = document.getElementById('toggleIcon');

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
