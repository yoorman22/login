<?php

namespace App\Controller;

class FrontController {

    private $pagina; // Atributo para almacenar el nombre de la página/controlador

    
    public function __construct() {
        if (isset($_GET["pagina"])) {
            $this->pagina = $_GET["pagina"];
        } else {
            // Si no se especifica una página, por defecto cargamos el controlador de login.
            $this->pagina = 'login'; 
        }

        // Llama al método para cargar el controlador
        $this->loadController();
    }

    private function loadController() {
        // Construye la ruta al archivo del controlador
        $rutaControlador = "app/Controller/" . $this->pagina . "Controller.php";

        // Verifica
        if (file_exists($rutaControlador)) {
            require_once($rutaControlador);
        } else {
            echo "<h1>Error 404: Página no encontrada</h1>";
            exit;
        }
    }
}
