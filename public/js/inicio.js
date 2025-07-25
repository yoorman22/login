$(document).ready(function() {
    //Función para cargar los datos del dashboard mediante una llamada AJAX.
     
    function cargarDatosDashboard() {
        // Muestra un estado de carga inicial
        $('#solicitudes-pendientes-count').text('Cargando...');
        $('#ordenes-trabajo-pendientes-count').text('Cargando...');
        $('#total-servicios-completados').text('Cargando...');

        $.ajax({
            url: 'index.php?pagina=Dashboard',
            method: 'GET',
            dataType: 'json', // Esperamos una respuesta JSON
            success: function(response) {
                // Actualiza los elementos del dashboard con los datos recibidos
                if (response) {
                    $('#solicitudes-pendientes-count').text(response.solicitudes_pendientes);
                    $('#ordenes-trabajo-pendientes-count').text(response.ordenes_trabajo_pendientes);
                    $('#total-servicios-completados').text(response.total_servicios_completados);
                } else {
                    console.error('Respuesta vacía o inesperada del servidor.');
                    $('#solicitudes-pendientes-count').text('Error');
                    $('#ordenes-trabajo-pendientes-count').text('Error');
                    $('#total-servicios-completados').text('Error');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Manejo de errores
                console.error('Error al cargar los datos del dashboard:', textStatus, errorThrown);
                $('#solicitudes-pendientes-count').text('Error');
                $('#ordenes-trabajo-pendientes-count').text('Error');
                $('#total-servicios-completados').text('Error');
            }
        });
    }

    // Llama a la función para cargar los datos del dashboard cuando la página esté lista
    cargarDatosDashboard();

});
