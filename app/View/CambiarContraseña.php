<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cambiar Contraseña | Berilion</title>
    <?php include_once __DIR__ . '/layouts/head.php'; ?>
    <link rel="stylesheet" href="public/css/cambiar.css">
</head>
<body>

    <div class="change-card">
        <img src="public/img/logo.svg" alt="Berilion Logo" class="change-logo">
        <h2 class="change-title">Cambiar Contraseña</h2>

        <?php if (!empty($_SESSION['mensaje'])): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <?= htmlspecialchars($_SESSION['mensaje']) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            <?php unset($_SESSION['mensaje']); ?>
        <?php endif; ?>

        <form id="changeForm" autocomplete="off" method="POST" action="cambiarController.php">
            <input type="hidden" name="token" value="<?php echo $_GET['token'] ?? ''; ?>">
            <div class="mb-3">
                <label for="newPassword" class="form-label">Nueva Contraseña</label>
                <div class="input-group">
                    <span class="input-group-text">
                        <i class="bi bi-lock-fill"></i>
                    </span>
                    <input type="password" class="form-control" id="newPassword" name="newPassword" placeholder="********" required />
                </div>
            </div>
            <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
                <div class="input-group">
                    <span class="input-group-text">
                        <i class="bi bi-lock-fill"></i>
                    </span>
                    <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" placeholder="********" required />
                </div>
            </div>
            <div class="d-grid">
                <button type="submit" class="btn btn-change-primary">
                    Cambiar Contraseña <i class="bi bi-check ms-1"></i>
                </button>
            </div>
        </form>
    </div>

    <?php include_once __DIR__ . '/layouts/scripts.php'; ?>
</body>
</html>