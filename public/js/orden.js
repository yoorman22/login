$(document).ready(function() {
    // Inicialización de DataTables para la tabla principal de órdenes de trabajo
    const tablaOrdenes = $('#tablaOrdenes').DataTable({
        ajax: {
            url: 'index.php?pagina=OrdenTrabajo',
            type: 'POST',
            data: { accion: 'listar' },
            dataSrc: "" // Indica que la respuesta JSON es directamente un array de datos
        },
        columns: [
            { data: "id_orden" },
            { data: "solicitud_id" },
            { data: "tecnico_cedula" },
            { data: "codigo_herramienta_asignada" },
            { data: "fecha_visita" },
            { data: "direccion_visita" },
            { data: "estado_planificacion" },
            { data: "tipo_de_trabajo" },
            { data: "observaciones" },
            {
                data: null,
                render: function(data, type, row) {
                    return `
                        <button class="btn btn-success btn-sm editar mb-1" onclick='editarOrden(${JSON.stringify(row)})'>
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-sm eliminar mb-1" onclick="confirmarEliminacionOrden(${row.id_orden})">
                            <i class="bi bi-trash"></i>
                        </button>
                    `;
                },
                orderable: false
            }
        ],
        language: {
            url: 'public/libraries/DataTables/es-MX.json'
        },
        responsive: true
    });

    // Inicialización de DataTables para la tabla de selección de Solicitudes
    const tablaSolicitudes = $('#solicitudSelectionModal table').DataTable({
        columns: [
            { data: "id_solicitud" },
            { data: "tipo_cliente" },
            { data: "cliente_nombre_empresa" },
            { data: "descripcion_problema" },
            { data: "direccion_servicio" },
            { data: "fecha_creacion" },
            {
                data: null,
                defaultContent: '<button class="btn btn-primary btn-sm seleccionar-solicitud"><i class="bi bi-check-circle"></i> Seleccionar</button>'
            }
        ],
        language: {
            url: 'public/libraries/DataTables/es-MX.json'
        },
        responsive: true
    });

    // Inicialización de DataTables para la tabla de selección de Técnicos
    const tablaTecnicos = $('#tecnicoSelectionModal table').DataTable({
        columns: [
            { data: "cedula_tecnico" },
            { data: "nombre_completo" },
            { data: "especialidad" },
            { data: "telefono" },
            { data: "disponibilidad" },
            {
                data: null,
                defaultContent: '<button class="btn btn-primary btn-sm seleccionar-tecnico"><i class="bi bi-check-circle"></i> Seleccionar</button>'
            }
        ],
        language: {
            url: 'public/libraries/DataTables/es-MX.json'
        },
        responsive: true
    });

    // Inicialización de DataTables para la tabla de selección de Herramientas
    const tablaHerramientas = $('#herramientaSelectionModal table').DataTable({
        columns: [
            { data: "codigo_herramienta" },
            { data: "nombre_herramienta" },
            { data: "descripcion" },
            {
                data: null,
                defaultContent: '<button class="btn btn-primary btn-sm seleccionar-herramienta"><i class="bi bi-check-circle"></i> Seleccionar</button>'
            }
        ],
        language: {
            url: 'public/libraries/DataTables/es-MX.json'
        },
        responsive: true
    });

    // Evento al mostrar el modal principal de Orden de Trabajo
    $('#ordenTrabajoModal').on('show.bs.modal', function(event) {
        // Si el evento no viene de un botón "editar", inicializa el modal para creación
        if (!$(event.relatedTarget).hasClass('editar')) {
            inicializarOrdenTrabajoModal();
        }
    });

    // Envío del formulario de Orden de Trabajo
    $('#formOrdenTrabajo').on('submit', function(e) {
        e.preventDefault();
        const formData = $(this).serialize();

        $.ajax({
            type: "POST",
            url: 'index.php?pagina=OrdenTrabajo',
            data: formData,
            dataType: "json",
            success: function(response) {
                if (response.estado === "ok") {
                    $('#ordenTrabajoModal').modal('hide');
                    tablaOrdenes.ajax.reload(null, false);
                    mostrarAlerta(response.mensaje, 'success');
                } else {
                    mostrarAlerta(response.mensaje || 'Error al procesar la orden.', 'danger');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error AJAX:", status, error);
                console.log("Respuesta del servidor:", xhr.responseText);
                mostrarAlerta("Error en la comunicación con el servidor: " + error, 'danger');
            }
        });
    });

    // Manejar la selección de una Solicitud
    $('#solicitudSelectionModal table tbody').on('click', '.seleccionar-solicitud', function() {
        const data = tablaSolicitudes.row($(this).parents('tr')).data();
        $('#solicitud_id').val(data.id_solicitud);
        $('#cliente_nombre').val(data.cliente_nombre_empresa);
        $('#cliente_identificacion').val(data.cliente_identificacion);
        $('#solicitud_descripcion').val(data.descripcion_problema);
        $('#direccion_visita').val(data.direccion_servicio);
        $('#solicitudSelectionModal').modal('hide');
    });

    // Manejar la selección de un Técnico
    $('#tecnicoSelectionModal table tbody').on('click', '.seleccionar-tecnico', function() {
        const data = tablaTecnicos.row($(this).parents('tr')).data();
        $('#tecnico_cedula').val(data.cedula_tecnico);
        $('#tecnico_nombre').val(data.nombre_completo);
        $('#tecnico_telefono').val(data.telefono);
        $('#tecnicoSelectionModal').modal('hide');
    });

    // Manejar la selección de una Herramienta
    $('#herramientaSelectionModal table tbody').on('click', '.seleccionar-herramienta', function() {
        const data = tablaHerramientas.row($(this).parents('tr')).data();
        $('#codigo_herramienta_asignada').val(data.codigo_herramienta);
        $('#herramienta_nombre').val(data.nombre_herramienta);
        $('#herramienta_descripcion').val(data.descripcion);
        $('#herramientaSelectionModal').modal('hide');
    });

    // Manejar el clic en el botón "Eliminar" del modal de confirmación
    $('#confirmDeleteBtn').on('click', function() {
        const id_orden = $('#confirmIdToDelete').val();
        $('#confirmModal').modal('hide');
        $(this).blur(); // Quita el foco del botón después de hacer clic
        eliminarOrdenConfirmado(id_orden);
    });
});

// Función para limpiar y configurar el modal de Orden de Trabajo para creación
function inicializarOrdenTrabajoModal() {
    $('#formOrdenTrabajo')[0].reset();
    $('#accion').val('crear');
    $('#ordenTrabajoModalLabel').text('Registrar Orden de Trabajo');
    // Asegura que los campos auto-rellenados estén readonly
    $('#solicitud_id, #cliente_nombre, #cliente_identificacion, #solicitud_descripcion, #direccion_visita, ' +
      '#tecnico_cedula, #tecnico_nombre, #tecnico_telefono, #codigo_herramienta_asignada, #herramienta_nombre, ' +
      '#herramienta_descripcion').prop('readonly', true);
}

// Función para editar orden de trabajo (rellena el formulario y abre el modal)
function editarOrden(orden) {
    inicializarOrdenTrabajoModal();
    $('#accion').val('editar');
    $('#ordenTrabajoModalLabel').text('Editar Orden de Trabajo');

    $('#id_orden').val(orden.id_orden);
    $('#solicitud_id').val(orden.solicitud_id);

    // Rellena los campos relacionados con la solicitud/cliente
    $('#cliente_nombre').val(orden.cliente_nombre || '');
    $('#cliente_identificacion').val(orden.cliente_identificacion || '');
    $('#solicitud_descripcion').val(orden.descripcion_problema || '');
    $('#direccion_visita').val(orden.direccion_servicio);

    // Rellena los campos relacionados con el técnico
    $('#tecnico_cedula').val(orden.tecnico_cedula);
    $('#tecnico_nombre').val(orden.tecnico_nombre || '');
    $('#tecnico_telefono').val(orden.telefono || '');

    // Rellena los campos relacionados con la herramienta
    $('#codigo_herramienta_asignada').val(orden.codigo_herramienta_asignada);
    $('#herramienta_nombre').val(orden.herramienta_nombre || '');
    $('#herramienta_descripcion').val(orden.descripcion || '');

    $('#fecha_visita').val(orden.fecha_visita);
    $('#estado_planificacion').val(orden.estado_planificacion);
    $('#tipo_de_trabajo').val(orden.tipo_de_trabajo);
    $('#observaciones').val(orden.observaciones);

    // Muestra el modal de edición
    const ordenTrabajoModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('ordenTrabajoModal'));
    ordenTrabajoModalInstance.show();
}

// Función para mostrar el modal de confirmación de eliminación
function confirmarEliminacionOrden(id_orden) {
    $('#confirmIdToDelete').val(id_orden);
    const confirmModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('confirmModal'));
    confirmModalInstance.show();
}

// Función que realiza la eliminación real (llamada desde el modal de confirmación)
function eliminarOrdenConfirmado(id_orden) {
    $.ajax({
        type: "POST",
        url: 'index.php?pagina=OrdenTrabajo',
        data: { accion: "eliminar", id_orden: id_orden },
        dataType: "json", // Aseguramos que jQuery espere JSON
        success: function(response) {
            console.log("Respuesta del servidor al eliminar (parseada):", response);
            if (response.estado === "ok") {
                $('#tablaOrdenes').DataTable().ajax.reload(null, false);
                mostrarAlerta(response.mensaje || 'Orden eliminada correctamente.', 'success');
            } else {
                mostrarAlerta(response.mensaje || 'No se pudo eliminar la orden.', 'danger');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al eliminar el registro (AJAX):', status, error, xhr);
            console.log("Respuesta del servidor (texto crudo):", xhr.responseText);
            mostrarAlerta("Error al eliminar el registro: " + (xhr.responseText || error), 'danger');
        }
    });
}

// Función auxiliar para mostrar alertas
function mostrarAlerta(mensaje, tipo = 'success') {
    const alerta = $(`
        <div class="alert alert-${tipo} alert-dismissible fade show mt-3" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `);

    $('.container').prepend(alerta);
    setTimeout(() => alerta.alert('close'), 4000);
}
