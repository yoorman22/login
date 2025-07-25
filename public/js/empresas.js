$(document).ready(function () {
    // Inicializar DataTable con AJAX
    const tabla = $('#tablaEmpresas').DataTable({
        ajax: {
            url: 'index.php?pagina=empresas', 
            type: 'POST',
            data: { accion: 'listar' },
            dataSrc: '' 
        },
        columns: [
            { data: 'RIF' },
            { data: 'nombre' },
            { data: 'direccion_fiscal' },
            { data: 'numero_telefono' },
            { data: 'email' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-success me-1" onclick='editarEmpresa(${JSON.stringify(row)})'>
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="confirmarEliminacionEmpresa('${row.RIF}')">
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
    $('#formEmpresa').on('submit', function (e) {
        e.preventDefault();
        const datos = $(this).serialize();

        $.ajax({
            url: 'index.php?pagina=empresas', 
            type: 'POST',
            data: datos,
            success: function (respuesta) { 
                const res = respuesta; 
                if (res.estado === 'ok') {
                    $('#empresaModal').modal('hide');
                    $('#formEmpresa')[0].reset();
                    $('#RIF').prop('readOnly', false); 
                    $('#accion').val('crear'); 
                    tabla.ajax.reload(null, false);
                    mostrarAlerta('Empresa guardada correctamente.', 'success');
                } else {
                    let mensaje = res.mensaje || 'Error al guardar empresa.';
                    if (res.mensaje && (res.mensaje.includes('RIF ya existen') || res.mensaje.includes('Email ya existen') || res.mensaje.includes('RIF o Email ya existen'))) {
                        mensaje = 'El RIF o Email ingresado ya existe para otra empresa.';
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

    // Evento para limpiar el formulario y hacer el RIF editable al abrir el modal para crear
    $('#empresaModal').on('show.bs.modal', function (event) {
        const accion = $('#accion').val();

        if (accion === 'crear') {
            $('#formEmpresa')[0].reset();
            $('#RIF').prop('readOnly', false);
            $('#empresaModalLabel').html('<i class="bi bi-building-add me-2"></i>Registrar Empresa');
        }
    });

    // Manejar el clic en el botón "Eliminar" del modal de confirmación
    $('#confirmDeleteBtn').on('click', function() {
        const rif_empresa = $('#confirmIdToDelete').val();
        
    
        $('#confirmModal').modal('hide'); 
        $(this).blur(); 

        eliminarEmpresaConfirmado(rif_empresa); 
    });
});

// Función para editar empresa (rellena el formulario y abre el modal)
function editarEmpresa(empresa) {
    $('#accion').val('modificar');
    $('#RIF').val(empresa.RIF).prop('readOnly', true); // RIF de solo lectura al editar
    $('#nombre').val(empresa.nombre);
    $('#direccion_fiscal').val(empresa.direccion_fiscal);
    $('#numero_telefono').val(empresa.numero_telefono);
    $('#email').val(empresa.email);
    $('#empresaModalLabel').html('<i class="bi bi-pencil-fill me-2"></i>Modificar Empresa');

    // Se obtiene la instancia del modal para mostrarla
    const empresaModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('empresaModal'));
    empresaModalInstance.show();
}

// Función para mostrar el modal de confirmación (reutilizada de clientes)
function confirmarEliminacionEmpresa(rif_empresa) { // Recibe el RIF
    $('#confirmIdToDelete').val(rif_empresa); // Guarda el RIF de la empresa a eliminar
    const confirmModalInstance = new bootstrap.Modal(document.getElementById('confirmModal'));
    confirmModalInstance.show(); // Muestra el modal de confirmación
}

// Función que realiza la eliminación real (llamada desde el modal de confirmación)
function eliminarEmpresaConfirmado(rif_empresa) { // Recibe el RIF
    $.ajax({
        url: 'index.php?pagina=empresas',
        type: 'POST',
        data: { accion: 'eliminar', RIF: rif_empresa }, // Envía el RIF para eliminar
        success: function (respuesta) { 
            const res = respuesta; 
            if (res.estado === 'ok') {
                $('#tablaEmpresas').DataTable().ajax.reload(null, false);
                mostrarAlerta('Empresa eliminada correctamente.', 'success');
            } else {
                mostrarAlerta(res.mensaje || 'No se pudo eliminar la empresa.', 'danger');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error al eliminar empresa:', textStatus, errorThrown, jqXHR);
            console.error('Respuesta del servidor (texto crudo):', jqXHR.responseText);
            mostrarAlerta('No se pudo conectar al servidor o hubo un error en la solicitud. Verifique la consola para detalles.', 'danger');
        }
    });
}

// Función auxiliar para mostrar alertas (reutilizada de clientes)
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
