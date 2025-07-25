let usuarioModal; 

$(document).ready(function () {
    const tabla = $('#tablaUsuarios').DataTable({
        ajax: {
            url: 'index.php?pagina=usuarios',
            type: 'POST',
            data: { accion: 'listar' },
            dataSrc: ''
        },
        responsive: true,
        columns: [
            { data: 'id', visible: false }, // ID oculto, no visible en tabla
            { data: 'nombre' },
            { data: 'usuario' },
            { data: 'cargo' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-success me-1 btn-editar" data-id="${row.id}" data-usuario='${JSON.stringify(row)}'>
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-eliminar" data-id="${row.id}">
                            <i class="bi bi-trash-fill"></i>
                        </button>`;
                },
                orderable: false
            }
        ],
        language: { url: 'public/libraries/DataTables/es-MX.json' }
    });

    // Referencias al formulario y modal
    const formUsuario = $('#formUsuario');
    // Asigna la instancia del modal a la variable global
    usuarioModal = new bootstrap.Modal(document.getElementById('usuarioModal')); 
    const inputContrasena = $('#contrasena');
    const errorContrasena = $('#scontrasena');
    const inputUsuario = $('#usuario');
    const togglePasswordBtn = $('#togglePassword'); // Botón para el toggle de contraseña
    const contrasenaHelpText = formUsuario.find('.form-text.text-muted'); // Texto de ayuda de la contraseña

    // Validación en tiempo real para la contraseña
    inputContrasena.on('input', function () {
        if ($(this).val().length === 0 || $(this).val().length >= 6) {
            $(this).removeClass('is-invalid').addClass('is-valid');
            errorContrasena.text('');
        } else {
            $(this).removeClass('is-valid').addClass('is-invalid');
            errorContrasena.text('La contraseña debe tener al menos 6 caracteres.');
        }
    });

    // Enviar formulario (crear o modificar usuario)
    formUsuario.on('submit', function (e) {
        e.preventDefault();

        const accion = $('#accion').val();
        if (accion === 'crear' || (accion === 'modificar' && inputContrasena.val().length > 0)) {
            if (inputContrasena.val().length < 6) {
                inputContrasena.focus();
                inputContrasena.removeClass('is-valid').addClass('is-invalid');
                errorContrasena.text('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
        }


        let isUsuarioReadOnly = inputUsuario.prop('readOnly');
        if (isUsuarioReadOnly) {
            inputUsuario.prop('readOnly', false);
        }

        const datos = new FormData(formUsuario[0]);

        if (isUsuarioReadOnly) {
            inputUsuario.prop('readOnly', true);
        }

        fetch('index.php?pagina=usuarios', {
            method: 'POST',
            body: datos
        })
        .then(res => {
            // Verifica si la respuesta es JSON antes de intentar parsearla
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return res.json(); 
            } else {
                // Si no es JSON, lee la respuesta como texto y lanza un error
                return res.text().then(text => { throw new Error('Respuesta del servidor no es JSON: ' + text); });
            }
        })
        .then(data => { 
            if (data.estado === 'ok') { // Se accede directamente a 'data.estado'
                usuarioModal.hide();
                formUsuario[0].reset();
                $('#accion').val('crear');
                $('#id').val('');
                inputContrasena.removeClass('is-valid is-invalid');
                errorContrasena.text('');
                inputUsuario.prop('readOnly', false); // Hacer el campo de usuario editable de nuevo para nuevos registros
                tabla.ajax.reload(null, false); // Recargar la tabla sin resetear la paginación
                mostrarAlerta('Usuario guardado correctamente.', 'success');
            } else {
                mostrarAlerta(data.mensaje || 'Ocurrió un error.', 'danger'); 
            }
        })
        .catch(error => {
            console.error('Error en la solicitud Fetch:', error);
            mostrarAlerta('Error de conexión o servidor. Verifique la consola para más detalles.', 'danger');
        });
    });

    // Evento para limpiar el formulario y manejar el campo de contraseña/toggle al abrir el modal
    $('#usuarioModal').on('show.bs.modal', function (event) {
        const accion = $('#accion').val();
        if (accion === 'crear') {
            formUsuario[0].reset();
            inputUsuario.prop('readOnly', false);
            inputContrasena.prop('required', true); // Contraseña es requerida al crear
            inputContrasena.attr('placeholder', 'Mínimo 6 caracteres'); // Placeholder para crear
            inputContrasena.val(''); // Asegurarse de que esté vacía
            contrasenaHelpText.text('Mínimo 6 caracteres.');
            togglePasswordBtn.show(); // Mostrar el botón de toggle
            inputContrasena.attr('type', 'password'); // Asegurarse de que el tipo sea password
            togglePasswordBtn.find('i').removeClass('bi-eye-slash-fill').addClass('bi-eye-fill'); // Icono de ojo visible
            inputContrasena.removeClass('is-valid is-invalid');
            errorContrasena.text('');
            $('#usuarioModalLabel').html('<i class="bi bi-person-plus-fill me-2"></i>Registrar Usuario');
        } else if (accion === 'modificar') {
            // Cuando se modifica, la contraseña no es requerida y el toggle se oculta
            inputContrasena.prop('required', false);
            inputContrasena.attr('placeholder', 'Dejar vacío para no cambiar'); // Placeholder para modificar
            contrasenaHelpText.text('Dejar vacío para no cambiar la contraseña al modificar.'); // Texto de ayuda para modificar
            togglePasswordBtn.hide(); // Ocultar el botón de toggle
            inputContrasena.val(''); // Asegurarse de que esté vacía al abrir para modificar
            inputContrasena.attr('type', 'password'); // Asegurarse de que el tipo sea password
            inputContrasena.removeClass('is-valid is-invalid');
            errorContrasena.text('');
        }
    });

    // Lógica para el toggle de visibilidad de la contraseña
    togglePasswordBtn.on('click', function() {
        const type = inputContrasena.attr('type') === 'password' ? 'text' : 'password';
        inputContrasena.attr('type', type);
        // Cambiar el icono
        $(this).find('i').toggleClass('bi-eye-fill bi-eye-slash-fill');
    });


    // Manejar el clic en el botón "Eliminar" del modal de confirmación
    $('#confirmDeleteBtn').on('click', function() {
        const id_usuario = $('#confirmIdToDelete').val();
        eliminarUsuarioConfirmado(id_usuario);
        $('#confirmModal').modal('hide');
    });

    // Delegar eventos para botones Editar y Eliminar en la tabla
    $(document).on('click', '.btn-editar', function() {
        const usuario = JSON.parse($(this).attr('data-usuario'));
        editarUsuario(usuario);
    });

    $(document).on('click', '.btn-eliminar', function() {
        const id = $(this).attr('data-id');
        confirmarEliminacionUsuario(id);
    });
});

// Función para editar usuario (rellena el formulario y abre el modal)
function editarUsuario(usuario) {
    $('#accion').val('modificar');
    $('#id').val(usuario.id);
    $('#nombre').val(usuario.nombre);
    $('#usuario').val(usuario.usuario).prop('readOnly', true);
    $('#cargo').val(usuario.cargo);
    $('#contrasena').val('').prop('required', false).attr('placeholder', 'Dejar vacío para no cambiar');
    $('#scontrasena').text('');
    $('#contrasena').removeClass('is-valid is-invalid');
    $('#usuarioModalLabel').html('<i class="bi bi-pencil-fill me-2"></i>Modificar Usuario');

    // Ocultar el botón de toggle de contraseña al modificar
    $('#togglePassword').hide();
    // Asegurarse de que el campo de contraseña sea tipo 'password' al abrir el modal de edición
    $('#contrasena').attr('type', 'password');


    usuarioModal.show();
}

// Función para mostrar el modal de confirmación
function confirmarEliminacionUsuario(id_usuario) {
    $('#confirmIdToDelete').val(id_usuario);
    new bootstrap.Modal(document.getElementById('confirmModal')).show();
}

// Función que realiza la eliminación real (llamada desde el modal de confirmación)
function eliminarUsuarioConfirmado(id_usuario) {
    const formData = new FormData();
    formData.append('accion', 'eliminar');
    formData.append('id', id_usuario);

    fetch('index.php?pagina=usuarios', {
        method: 'POST',
        body: formData
    })
    .then(res => {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            return res.json(); 
        } else {
            return res.text().then(text => { throw new Error('Respuesta del servidor no es JSON: ' + text); });
        }
    })
    .then(data => { // 
        if (data.estado === 'ok') {
            $('#tablaUsuarios').DataTable().ajax.reload(null, false);
            mostrarAlerta('Usuario eliminado correctamente.', 'success');
        } else {
            mostrarAlerta(data.mensaje || 'No se pudo eliminar el usuario.', 'danger');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud Fetch (eliminar):', error);
        mostrarAlerta('No se pudo conectar al servidor o hubo un error en la solicitud. Verifique la consola para detalles.', 'danger');
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

    if ($('.container').length) {
        $('.container').prepend(alerta);
    } else {
        $('body').prepend(alerta);
    }
    setTimeout(() => alerta.alert('close'), 4000);
}
