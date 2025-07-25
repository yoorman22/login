$(document).ready(function () {
    // Inicializar DataTable con AJAX
    const tabla = $('#tablaTecnicos').DataTable({
        ajax: {
            url: 'index.php?pagina=tecnicos',
            type: 'POST',
            data: { accion: 'listar' },
            dataSrc: '' 
        },
        columns: [
            { data: 'cedula' },
            { data: 'nombre' },
            { data: 'apellido' },
            { data: 'cargo' },
            { data: 'correo' },
            { data: 'telefono' },
            { data: 'direccion' },
            { data: 'especializacion' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-success me-1" onclick='editarTecnico(${JSON.stringify(row)})'>
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="confirmarEliminacion('${row.cedula}')">
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
    $('#formTecnico').on('submit', function (e) {
        e.preventDefault();
        const datos = $(this).serialize();

        $.ajax({
            url: 'index.php?pagina=tecnicos',
            type: 'POST',
            data: datos,
            success: function (respuesta) {
                const res = respuesta;
                if (res.estado === 'ok') {
                    $('#tecnicoModal').modal('hide');
                    $('#formTecnico')[0].reset();
                    $('#accion').val('crear');
                    $('#cedula').prop('readOnly', false); // Hacer la cédula editable de nuevo para nuevos registros (solo para crear)
                    tabla.ajax.reload(null, false);
                    mostrarAlerta(res.mensaje || 'Técnico guardado correctamente.', 'success');
                } else {
                    let mensaje = res.mensaje || 'Error al guardar técnico.';
                    if (res.mensaje && res.mensaje.includes('cédula ya existe')) {
                        mensaje = 'La cédula ingresada ya existe para otro técnico.';
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

    // Evento para limpiar el formulario
    $('#tecnicoModal').on('show.bs.modal', function (event) {
        const accion = $('#accion').val();

        if (accion === 'crear') {
            $('#formTecnico')[0].reset();
            $('#cedula').prop('readOnly', false);
            $('#tecnicoModalLabel').html('<i class="bi bi-person-lines-fill me-2"></i>Registrar Técnico');
        }
    });

    // Manejar el clic en el botón "Eliminar" del modal de confirmación
    $('#confirmDeleteBtn').on('click', function() {
        const cedula = $('#confirmIdToDelete').val();
        eliminarTecnicoConfirmado(cedula);
        const confirmModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('confirmModal'));
        confirmModalInstance.hide(); // Oculta el modal de confirmación correctamente
    });
});

// Función para editar técnico (rellena el formulario y abre el modal)
function editarTecnico(tecnico) {
    $('#accion').val('modificar');
    $('#cedula').val(tecnico.cedula).prop('readOnly', true); // Al modificar, la cédula se vuelve de solo lectura
    $('#nombre').val(tecnico.nombre);
    $('#apellido').val(tecnico.apellido);
    $('#cargo').val(tecnico.cargo);
    $('#direccion').val(tecnico.direccion);
    $('#correo').val(tecnico.correo);
    $('#telefono').val(tecnico.telefono);
    $('#especializacion').val(tecnico.especializacion);
    $('#tecnicoModalLabel').html('<i class="bi bi-pencil-fill me-2"></i>Modificar Técnico');

    // Usa getOrCreateInstance para gestionar el modal
    const tecnicoModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('tecnicoModal'));
    tecnicoModalInstance.show();
}

// Función para mostrar el modal de confirmación
function confirmarEliminacion(cedula) {
    $('#confirmIdToDelete').val(cedula); // Guarda la cédula del técnico a eliminar en el campo oculto
    // Usa getOrCreateInstance para gestionar el modal
    const confirmModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('confirmModal'));
    confirmModalInstance.show(); 
}

// Función que realiza la eliminación real (llamada desde el modal de confirmación)
function eliminarTecnicoConfirmado(cedula) {
    $.ajax({
        url: 'index.php?pagina=tecnicos',
        type: 'POST',
        data: { accion: 'eliminar', cedula: cedula },
        success: function (respuesta) {
            const res = respuesta;
            if (res.estado === 'ok') {
                $('#tablaTecnicos').DataTable().ajax.reload(null, false);
                mostrarAlerta(res.mensaje || 'Técnico eliminado correctamente.', 'success');
            } else {
                mostrarAlerta(res.mensaje || 'No se pudo eliminar el técnico.', 'danger');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error al eliminar técnico:', textStatus, errorThrown, jqXHR);
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
