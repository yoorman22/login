$(document).ready(function () {
    // Tabla principal de Solicitudes
    const tablaSolicitudes = $('#tablaSolicitudes').DataTable({
        ajax: {
            url: 'index.php?pagina=solicitudes',
            type: 'POST',
            data: { accion: 'listar' },
            dataSrc: ''
        },
        columns: [
            { data: 'id_solicitud', visible: false },
            { data: 'cedula_cliente' },
            { data: 'empresa_rif' },
            { data: 'descripcion' },
            { data: 'fecha' },
            { data: 'estado_ticket' },
            { data: 'prioridad' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-success me-1" onclick='editarSolicitud(${JSON.stringify(row)})'>
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="confirmarEliminacionSolicitud(${row.id_solicitud})">
                            <i class="bi bi-trash-fill"></i>
                        </button>`;
                },
                orderable: false
            }
        ],
        language: {
            url: 'public/libraries/DataTables/es-MX.json'
        },
        responsive: true
    });

    // Función para limpiar y configurar el modal de Cliente Particular
    function inicializarClienteSolicitudModal() {
        $('#formClienteSolicitud')[0].reset();
        $('#accionCliente').val('crear');
        $('#id_solicitud_cliente').val('');
        $('#clienteSolicitudModalLabel').html('<i class="bi bi-person-fill me-2"></i>Registrar Solicitud Cliente Particular');
        
        // Limpiar campos de auto-relleno y el campo de cedula_cliente
        $('#cedula_cliente').val('').prop('readonly', false).removeClass('is-invalid'); // Hacer editable temporalmente para simulación
        $('#cliente_nombre').val('');
        $('#cliente_apellido').val('');
        $('#cliente_telefono').val('');
        $('#cliente_organizacion').val('');
        $('#cliente_direccion').val('');

        // Establecer fecha actual por defecto
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        $('#fecha_cliente').val(`${yyyy}-${mm}-${dd}`);
    }

    // Función para limpiar y configurar el modal de Empresa
    function inicializarEmpresaSolicitudModal() {
        $('#formEmpresaSolicitud')[0].reset();
        $('#accionEmpresa').val('crear');
        $('#id_solicitud_empresa').val('');
        $('#empresaSolicitudModalLabel').html('<i class="bi bi-building-fill me-2"></i>Registrar Solicitud Empresa');
        
        // Limpiar campos de auto-relleno y el campo de empresa_rif
        $('#empresa_rif').val('').prop('readonly', false).removeClass('is-invalid'); // Hacer editable temporalmente para simulación
        $('#empresa_nombre').val('');
        $('#empresa_telefono').val('');
        $('#empresa_direccion_fiscal').val('');

        // Establecer fecha actual por defecto
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        $('#fecha_empresa').val(`${yyyy}-${mm}-${dd}`);
    }

    // Eventos para abrir los modales de creación
    $('#btnNuevaSolicitudCliente').on('click', function() {
        inicializarClienteSolicitudModal();
        $('#clienteSolicitudModal').modal('show');
    });

    $('#btnNuevaSolicitudEmpresa').on('click', function() {
        inicializarEmpresaSolicitudModal();
        $('#empresaSolicitudModal').modal('show');
    });

    // Enviar formulario de Solicitud de CLIENTE
    $('#formClienteSolicitud').on('submit', function (e) {
        e.preventDefault();
        const datos = $(this).serialize();

        $.ajax({
            url: 'index.php?pagina=solicitudes',
            type: 'POST',
            data: datos,
            success: function (respuesta) {
                const res = respuesta;
                if (res.estado === 'ok') {
                    $('#clienteSolicitudModal').modal('hide');
                    tablaSolicitudes.ajax.reload(null, false);
                    mostrarAlerta('Solicitud de cliente guardada correctamente.', 'success');
                } else {
                    mostrarAlerta(res.mensaje || 'Error al guardar la solicitud de cliente.', 'danger');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error en la solicitud AJAX (cliente):', textStatus, errorThrown, jqXHR);
                console.error('Respuesta del servidor (texto crudo):', jqXHR.responseText);
                mostrarAlerta('No se pudo conectar al servidor o hubo un error en la solicitud de cliente. Verifique la consola para detalles.', 'danger');
            }
        });
    });

    // Enviar formulario de Solicitud de EMPRESA
    $('#formEmpresaSolicitud').on('submit', function (e) {
        e.preventDefault();
        const datos = $(this).serialize();

        $.ajax({
            url: 'index.php?pagina=solicitudes',
            type: 'POST',
            data: datos,
            success: function (respuesta) {
                const res = respuesta;
                if (res.estado === 'ok') {
                    $('#empresaSolicitudModal').modal('hide');
                    tablaSolicitudes.ajax.reload(null, false);
                    mostrarAlerta('Solicitud de empresa guardada correctamente.', 'success');
                } else {
                    mostrarAlerta(res.mensaje || 'Error al guardar la solicitud de empresa.', 'danger');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error en la solicitud AJAX (empresa):', textStatus, errorThrown, jqXHR);
                console.error('Respuesta del servidor (texto crudo):', jqXHR.responseText);
                mostrarAlerta('No se pudo conectar al servidor o hubo un error en la solicitud de empresa. Verifique la consola para detalles.', 'danger');
            }
        });
    });

    // Manejar el clic en el botón "Eliminar" del modal de confirmación
    $('#confirmDeleteBtn').on('click', function() {
        const id_solicitud = $('#confirmIdToDelete').val();
        
        $('#confirmModal').modal('hide'); 
        $(this).blur(); 

        eliminarSolicitudConfirmado(id_solicitud); 
    });
});

// Función para editar solicitud (rellena el formulario y abre el modal correcto)
function editarSolicitud(solicitud) {
    // Limpiar todos los campos de auto-relleno y campos de ID/accion en ambos formularios
    $('#formClienteSolicitud')[0].reset();
    $('#formEmpresaSolicitud')[0].reset();
    $('#id_solicitud_cliente').val('');
    $('#id_solicitud_empresa').val('');
    

    if (solicitud.cedula_cliente && solicitud.cedula_cliente !== '') {
        // Es una solicitud de cliente
        $('#accionCliente').val('modificar');
        $('#id_solicitud_cliente').val(solicitud.id_solicitud);
        $('#cedula_cliente').val(solicitud.cedula_cliente).prop('readonly', true); // Mantener readonly al editar
        $('#fecha_cliente').val(solicitud.fecha);
        $('#prioridad_cliente').val(solicitud.prioridad);
        $('#estado_ticket_cliente').val(solicitud.estado_ticket);
        $('#descripcion_cliente').val(solicitud.descripcion);
        $('#clienteSolicitudModalLabel').html('<i class="bi bi-pencil-fill me-2"></i>Modificar Solicitud Cliente Particular');

        $('#cliente_nombre').val('');
        $('#cliente_apellido').val('');
        $('#cliente_telefono').val('');
        $('#cliente_organizacion').val('');
        $('#cliente_direccion').val('');

        const modal = new bootstrap.Modal(document.getElementById('clienteSolicitudModal'));
        modal.show();

    } else if (solicitud.empresa_rif && solicitud.empresa_rif !== '') {
        // Es una solicitud de empresa
        $('#accionEmpresa').val('modificar');
        $('#id_solicitud_empresa').val(solicitud.id_solicitud);
        $('#empresa_rif').val(solicitud.empresa_rif).prop('readonly', true); // Mantener readonly al editar
        $('#fecha_empresa').val(solicitud.fecha);
        $('#prioridad_empresa').val(solicitud.prioridad);
        $('#estado_ticket_empresa').val(solicitud.estado_ticket);
        $('#descripcion_empresa').val(solicitud.descripcion);
        $('#empresaSolicitudModalLabel').html('<i class="bi bi-pencil-fill me-2"></i>Modificar Solicitud Empresa');

        // Los campos de auto-relleno se quedan vacíos
        $('#empresa_nombre').val('');
        $('#empresa_telefono').val('');
        $('#empresa_direccion_fiscal').val('');

        const modal = new bootstrap.Modal(document.getElementById('empresaSolicitudModal'));
        modal.show();

    } else {
        // En caso de que no tenga ni cédula ni RIF (error de datos o caso no previsto)
        mostrarAlerta('No se pudo determinar el tipo de solicitud para editar.', 'danger');
    }
}

// Función para mostrar el modal de confirmación
function confirmarEliminacionSolicitud(id_solicitud) {
    $('#confirmIdToDelete').val(id_solicitud);
    const confirmModalInstance = new bootstrap.Modal(document.getElementById('confirmModal'));
    confirmModalInstance.show();
}

// Función que realiza la eliminación real (llamada desde el modal de confirmación)
function eliminarSolicitudConfirmado(id_solicitud) {
    $.ajax({
        url: 'index.php?pagina=solicitudes',
        type: 'POST',
        data: { accion: 'eliminar', id_solicitud: id_solicitud },
        success: function (respuesta) {
            const res = respuesta;
            if (res.estado === 'ok') {
                $('#tablaSolicitudes').DataTable().ajax.reload(null, false);
                mostrarAlerta('Solicitud eliminada correctamente.', 'success');
            } else {
                mostrarAlerta(res.mensaje || 'No se pudo eliminar la solicitud.', 'danger');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error al eliminar solicitud:', textStatus, errorThrown, jqXHR);
            console.error('Respuesta del servidor (texto crudo):', jqXHR.responseText);
            mostrarAlerta('No se pudo conectar al servidor o hubo un error en la solicitud. Verifique la consola para detalles.', 'danger');
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
