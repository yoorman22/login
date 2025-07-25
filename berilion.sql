-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS berilion;
USE berilion;

-- Tabla: Gestionar Cliente
CREATE TABLE Cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(15) UNIQUE,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    organizacion VARCHAR(100),
    sede VARCHAR(100)
);

-- Tabla: Gestionar Personal Técnico
CREATE TABLE PersonalTecnico (
    id_tecnico INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(15) UNIQUE,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    cargo VARCHAR(50),
    direccion VARCHAR(255),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    especializacion TEXT
);

-- Tabla: Gestionar Solicitudes
CREATE TABLE Solicitudes (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha DATE NOT NULL,
    estado_ticket VARCHAR(50) NOT NULL,
    prioridad VARCHAR(20) NOT NULL,

    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Tabla: Gestionar Recursos Tecnológicos
CREATE TABLE RecursosTecnologicos (
    id_herramienta INT AUTO_INCREMENT PRIMARY KEY,
    codigo_de_herramienta VARCHAR(20) UNIQUE,
    nombre VARCHAR(100),
    tipo VARCHAR(50),
    descripcion TEXT,
    cantidad_disponible INT
);

-- Tabla: Gestión de Planificación de Visita Técnica
CREATE TABLE PlanificacionVisitaTecnica (
    id_planificacion INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    tecnico_cedula VARCHAR(15) NOT NULL,
    id_herramienta_asignada INT,
    fecha_visita DATE NOT NULL,
    direccion_visita VARCHAR(255) NOT NULL, 
    estado_planificacion VARCHAR(50) DEFAULT, 
    observaciones TEXT,

    -- Definición de la clave foránea para la tabla Solicitudes
    FOREIGN KEY (solicitud_id) REFERENCES Solicitudes(id_solicitud)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Definición de la clave foránea para la tabla PersonalTecnico
    FOREIGN KEY (tecnico_cedula) REFERENCES PersonalTecnico(cedula)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Definición de la clave foránea para la tabla RecursosTecnologicos
    FOREIGN KEY (id_herramienta_asignada) REFERENCES RecursosTecnologicos(id_herramienta)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Crear la tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    usuario VARCHAR(50) UNIQUE,
    contrasena VARCHAR(255),
    cargo VARCHAR(50)
);

-- Insertar usuario de ejemplo
INSERT INTO usuarios (nombre, usuario, contrasena, cargo)
VALUES ('Admin', 'admin', '123456', 'tecnico');
