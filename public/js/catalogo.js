$(document).ready(function () {
    // Inicializar DataTable con AJAX
    const tabla = $('#tablaCatalogo').DataTable({
        ajax: {
            url: 'index.php?pagina=catalogo', 
            type: 'POST',
            data: { accion: 'listar' },
            dataSrc: '' // El controlador devuelve un array directamente
        },
        columns: [
            { data: 'codigo_de_herramienta' },
            { data: 'nombre' },
            { data: 'tipo' },
            { data: 'descripcion' },
            { data: 'cantidad_disponible' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-success me-1" onclick='editarCatalogo(${JSON.stringify(row)})'>
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="confirmarEliminacionCatalogo('${row.codigo_de_herramienta}')">
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
    $('#formCatalogo').on('submit', function (e) {
        e.preventDefault();
        const datos = $(this).serialize();

        $.ajax({
            url: 'index.php?pagina=catalogo',
            type: 'POST',
            data: datos,
            success: function (respuesta) {
                const res = respuesta; 
                if (res.estado === 'ok') {
                    $('#catalogoModal').modal('hide');
                    $('#formCatalogo')[0].reset();
                    $('#codigo_de_herramienta').prop('readOnly', false); // Hacer el código editable de nuevo para nuevos registros
                    $('#accion').val('crear'); // Reiniciar acción
                    tabla.ajax.reload(null, false);
                    mostrarAlerta('Ítem del catálogo guardado correctamente.', 'success');
                } else {
                    let mensaje = res.mensaje || 'Error al guardar ítem del catálogo.';
                    if (res.mensaje && res.mensaje.includes('código de herramienta ya existe')) {
                        mensaje = 'El código de herramienta ingresado ya existe para otro ítem.';
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

    // Evento para limpiar el formulario y hacer el código editable al abrir el modal para crear
    $('#catalogoModal').on('show.bs.modal', function (event) {
        const accion = $('#accion').val();

        if (accion === 'crear') {
            $('#formCatalogo')[0].reset();
            $('#codigo_de_herramienta').prop('readOnly', false);
            $('#catalogoModalLabel').html('<i class="bi bi-plus-circle-fill me-2"></i>Registrar Ítem del Catálogo');
        }
    });

    // Manejar el clic en el botón "Eliminar" del modal de confirmación
    $('#confirmDeleteBtn').on('click', function() {
        const codigo_item = $('#confirmIdToDelete').val();
        
        
        $('#confirmModal').modal('hide'); 
        $(this).blur(); 

        eliminarCatalogoConfirmado(codigo_item); 
    });
});

// Función para editar ítem del catálogo (rellena el formulario y abre el modal)
function editarCatalogo(item) {
    $('#accion').val('modificar');
    $('#codigo_de_herramienta').val(item.codigo_de_herramienta).prop('readOnly', true); 
    $('#nombre').val(item.nombre);
    $('#tipo').val(item.tipo);
    $('#descripcion').val(item.descripcion);
    $('#cantidad_disponible').val(item.cantidad_disponible);
    $('#catalogoModalLabel').html('<i class="bi bi-pencil-fill me-2"></i>Modificar Ítem del Catálogo');

    // Se obtiene la instancia del modal para mostrarla
    const catalogoModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('catalogoModal'));
    catalogoModalInstance.show();
}

// Función para mostrar el modal de confirmación
function confirmarEliminacionCatalogo(codigo_item) { // Recibe el código
    $('#confirmIdToDelete').val(codigo_item); // Guarda el código del ítem a eliminar
    const confirmModalInstance = new bootstrap.Modal(document.getElementById('confirmModal'));
    confirmModalInstance.show(); // Muestra el modal de confirmación
}

// Función que realiza la eliminación
function eliminarCatalogoConfirmado(codigo_item) { // Recibe el código
    $.ajax({
        url: 'index.php?pagina=catalogo',
        type: 'POST',
        data: { accion: 'eliminar', codigo_de_herramienta: codigo_item }, // Envía el código para eliminar
        success: function (respuesta) { 
            const res = respuesta;
            if (res.estado === 'ok') {
                $('#tablaCatalogo').DataTable().ajax.reload(null, false);
                mostrarAlerta('Ítem del catálogo eliminado correctamente.', 'success');
            } else {
                mostrarAlerta(res.mensaje || 'No se pudo eliminar el ítem del catálogo.', 'danger');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error al eliminar ítem del catálogo:', textStatus, errorThrown, jqXHR);
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
