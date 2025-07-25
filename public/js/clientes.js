$(document).ready(function () {
    // Inicializar DataTable con AJAX
    const tabla = $('#tablaClientes').DataTable({
        ajax: {
            url: 'index.php?pagina=Clientes',
            type: 'POST',
            data: { accion: 'listar' },
            dataSrc: '' // El controlador devuelve un array directamente
        },
        columns: [
            { data: 'cedula' },
            { data: 'nombre' },
            { data: 'apellido' },
            { data: 'correo' },
            { data: 'telefono' },
            { data: 'direccion' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-success me-1" onclick='editarCliente(${JSON.stringify(row)})'>
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="confirmarEliminacionCliente('${row.cedula}')">
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

    // Envío del formulario (crear/modificar)
    $('#formCliente').on('submit', function (e) {
        e.preventDefault();
        const datos = $(this).serialize();

        $.ajax({
            url: 'index.php?pagina=clientes',
            type: 'POST',
            data: datos,
            success: function (respuesta) { 
                const res = respuesta; 
                if (res.estado === 'ok') {
                    $('#clienteModal').modal('hide');
                    $('#formCliente')[0].reset();
                    $('#cedula').prop('readOnly', false);
                    $('#accion').val('crear');
                    tabla.ajax.reload(null, false);
                    mostrarAlerta('Cliente guardado correctamente.', 'success');
                } else {
                    let mensaje = res.mensaje || 'Error al guardar cliente.';
                    if (res.mensaje && res.mensaje.includes('cédula ya existe')) {
                        mensaje = 'La cédula ingresada ya existe para otro cliente.';
                    }
                    mostrarAlerta(mensaje, 'danger');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error en la solicitud AJAX:', textStatus, errorThrown, jqXHR);
                console.error('Respuesta del servidor (texto crudo):', jqXHR.responseText);
                mostrarAlerta('No se pudo conectar al servidor o hubo un error en la solicitud. Verifique la consola para detalles.', 'danger');
            }
        });
    });

    // Evento para limpiar el formulario y hacer la cédula editable al abrir el modal para crear
    $('#clienteModal').on('show.bs.modal', function (event) {
        const accion = $('#accion').val();

        if (accion === 'crear') {
            $('#formCliente')[0].reset();
            $('#cedula').prop('readOnly', false);
            $('#clienteModalLabel').html('<i class="bi bi-person-plus-fill me-2"></i>Registrar Cliente');
        }
    });

    // Manejar el clic en el botón "Eliminar" del modal de confirmación
    $('#confirmDeleteBtn').on('click', function() {
        const cedula_cliente = $('#confirmIdToDelete').val();
        eliminarClienteConfirmado(cedula_cliente);
        $('#confirmModal').modal('hide');
    });
});

// Función para editar cliente (rellena el formulario y abre el modal)
function editarCliente(cliente) {
    $('#accion').val('modificar');
    $('#cedula').val(cliente.cedula).prop('readOnly', true);
    $('#nombre').val(cliente.nombre);
    $('#apellido').val(cliente.apellido);
    $('#correo').val(cliente.correo);
    $('#telefono').val(cliente.telefono);
    $('#direccion').val(cliente.direccion);
    $('#clienteModalLabel').html('<i class="bi bi-pencil-fill me-2"></i>Modificar Cliente');

    const clienteModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('clienteModal'));
    clienteModalInstance.show();
}

// Función para mostrar el modal de confirmación
function confirmarEliminacionCliente(cedula_cliente) {
    $('#confirmIdToDelete').val(cedula_cliente);
    const confirmModalInstance = new bootstrap.Modal(document.getElementById('confirmModal'));
    confirmModalInstance.show();
}

// Función que realiza la eliminación real (llamada desde el modal de confirmación)
function eliminarClienteConfirmado(cedula_cliente) {
    $.ajax({
        url: 'index.php?pagina=clientes',
        type: 'POST',
        data: { accion: 'eliminar', cedula: cedula_cliente },
        
        success: function (respuesta) { 
            const res = respuesta; 
            if (res.estado === 'ok') {
                $('#tablaClientes').DataTable().ajax.reload(null, false);
                mostrarAlerta('Cliente eliminado correctamente.', 'success');
            } else {
                mostrarAlerta(res.mensaje || 'No se pudo eliminar el cliente.', 'danger');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error al eliminar cliente:', textStatus, errorThrown, jqXHR);
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
