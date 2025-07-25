<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recuperar Contraseña | Berilion</title>
    <?php include_once __DIR__ . '/layouts/head.php'; ?>
    <link rel="stylesheet" href="public/css/recuperar.css">
</head>
<body>

    <div class="recover-card">
        <img src="public/img/logo.svg" alt="Berilion Logo" class="recover-logo">
        <h2 class="recover-title">Recuperar Contraseña</h2>
        <h5 class="recover-subtitle">Ingrese su correo electrónico</h5>

        <?php if (!empty($_SESSION['mensaje'])): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <?= htmlspecialchars($_SESSION['mensaje']) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            <?php unset($_SESSION['mensaje']); ?>
        <?php endif; ?>

        <form id="recoverForm" autocomplete="off" method="POST" action="index.php?pagina=recuperarContraseña">
            <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <div class="input-group">
                    <span class="input-group-text">
                        <i class="bi bi-envelope-fill"></i>
                    </span>
                    <input type="email" class="form-control" id="email" name="email" placeholder="Ingrese su correo electrónico" required />
                </div>
            </div>
            <div class="d-grid">
                <button type="submit" class="btn btn-recover-primary">
                    Recuperar <i class="bi bi-arrow-right ms-1"></i>
                </button>
            </div>
        </form>
    </div>

    <?php include_once __DIR__ . '/layouts/scripts.php'; ?>
</body>
</html>