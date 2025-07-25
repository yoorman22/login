<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inicio | Berilion</title>
    <?php include_once __DIR__ . '/layouts/head.php'; ?>
    <link rel="stylesheet" href="public/css/inicio.css">
</head>
<body class="d-flex flex-column min-vh-100">

    <?php include_once __DIR__ . '/layouts/navbar.php'; ?>

    <main class="container my-5 flex-grow-1">
        <div class="jumbotron-custom text-center">
            <img src="public/img/logo.svg" alt="Logo de Berilion" class="logo-small">
            <h1 class="display-4 fw-bold">
                Bienvenido a <span class="text-primary">Berilion</span>
            </h1>
            <p class="lead mt-3">
                Soluciones técnicas eficientes para empresas y particulares. Tu aliado en soporte tecnológico.
            </p>
        </div>

        <section class="row g-4 mb-5">
            <!-- Tarjeta para Solicitudes Pendientes -->
            <div class="col-sm-6 col-md-4">
                <div class="card-dashboard">
                    <span class="dashboard-icon icon-yellow"><i class="bi bi-bell-fill"></i></span>
                    <div class="dashboard-metric" id="solicitudes-pendientes-count">0</div>
                    <div class="dashboard-label">Solicitudes Pendientes</div>
                </div>
            </div>

            <!-- Tarjeta para Órdenes de Trabajo Asignadas/En Curso -->
            <div class="col-sm-6 col-md-4">
                <div class="card-dashboard">
                    <span class="dashboard-icon icon-blue"><i class="bi bi-briefcase-fill"></i></span>
                    <div class="dashboard-metric" id="ordenes-trabajo-pendientes-count">0</div>
                    <div class="dashboard-label">Órdenes de Trabajo Activas</div>
                </div>
            </div>

            <!-- Tarjeta opcional: Servicios Completados -->
            <div class="col-sm-12 col-md-4">
                <div class="card-dashboard">
                    <span class="dashboard-icon icon-green"><i class="bi bi-check-circle-fill"></i></span>
                    <div class="dashboard-metric" id="total-servicios-completados">0</div>
                    <div class="dashboard-label">Servicios Completados (ej. último mes)</div>
                </div>
            </div>
        </section>

        <!-- Sección de Resumen o Widgets Adicionales -->
        <section class="p-4 card-dashboard">
            <h3 class="h4 fw-bold text-center mb-4">Resumen General de Operaciones</h3>
            <p class="text-muted text-center">
                Monitorea el estado de tus operaciones diarias, la carga de trabajo de tu equipo técnico y la satisfacción de tus clientes.
                Accede rápidamente a los módulos para una gestión integral.
            </p>
        </section>
    </main>

    <?php include_once __DIR__ . '/layouts/scripts.php'; ?>
    <script src="public/js/inicio.js"></script>
</body>
</html>
