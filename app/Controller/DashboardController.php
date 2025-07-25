<?php

namespace App\Controller;

use App\Model\SolicitudesModel;
use App\Model\OrdenTrabajoModel;
use App\Config\Database;

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json'); 

try {
    $dbConnection = new Database();

    $solicitudesModel = new SolicitudesModel($dbConnection);
    $ordenTrabajoModel = new OrdenTrabajoModel($dbConnection);

    // Obtiene los conteos usando los métodos del modelo
    $solicitudesPendientes = $solicitudesModel->contarSolicitudesPendientes();
    $ordenesTrabajoPendientes = $ordenTrabajoModel->contarOrdenesPendientes();
    // Obtiene el conteo de servicios completados en el último mes
    $totalServiciosCompletados = $ordenTrabajoModel->contarServiciosCompletadosUltimoMes();

    $data = [
        'solicitudes_pendientes' => $solicitudesPendientes,
        'ordenes_trabajo_pendientes' => $ordenesTrabajoPendientes,
        'total_servicios_completados' => $totalServiciosCompletados
    ];

    echo json_encode($data);

} catch (\Exception $e) {
    // Captura cualquier excepción que ocurra durante la instanciación o ejecución
    error_log("Error en DashboardController: " . $e->getMessage());
    echo json_encode(['estado' => 'error', 'mensaje' => 'Error interno del servidor al cargar los datos del dashboard.']);
}

exit;
