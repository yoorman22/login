DROP DATABASE IF EXISTS berilion;

CREATE DATABASE IF NOT EXISTS berilion;
USE berilion;

-- Tabla: Empresas
CREATE TABLE Empresas (
    RIF VARCHAR(20) PRIMARY KEY NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    direccion_fiscal VARCHAR(255),
    numero_telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE
);

-- Tabla: Cliente
CREATE TABLE Cliente (
    cedula VARCHAR(15) PRIMARY KEY NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(255)
);

-- Tabla: PersonalTecnico
CREATE TABLE PersonalTecnico (
    cedula VARCHAR(15) PRIMARY KEY NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    cargo VARCHAR(50),
    direccion VARCHAR(255),
    correo VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    especializacion TEXT
);

-- Tabla: catalogo
CREATE TABLE catalogo (
    codigo_de_herramienta VARCHAR(20) PRIMARY KEY NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50),
    descripcion TEXT,
    cantidad_disponible INT
);

-- Tabla: Solicitudes
CREATE TABLE Solicitudes (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    cedula_cliente VARCHAR(15),
    empresa_rif VARCHAR(20),

    descripcion TEXT NOT NULL,
    fecha DATE NOT NULL,
    estado_ticket VARCHAR(50) NOT NULL,
    prioridad VARCHAR(20) NOT NULL,

    FOREIGN KEY (cedula_cliente) REFERENCES Cliente(cedula)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (empresa_rif) REFERENCES Empresas(RIF)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Tabla: orden_de_trabajo
CREATE TABLE orden_de_trabajo (
    id_orden INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    tecnico_cedula VARCHAR(15) NOT NULL,
    codigo_herramienta_asignada VARCHAR(20),

    fecha_visita DATE NOT NULL,
    direccion_visita VARCHAR(255) NOT NULL,
    estado_planificacion VARCHAR(50) NOT NULL,
    tipo_de_trabajo VARCHAR(100) NOT NULL,
    observaciones TEXT,

    FOREIGN KEY (solicitud_id) REFERENCES Solicitudes(id_solicitud)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (tecnico_cedula) REFERENCES PersonalTecnico(cedula)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (codigo_herramienta_asignada) REFERENCES catalogo(codigo_de_herramienta)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Tabla: usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo text NOT NULL,
    usuario VARCHAR(50) UNIQUE,
    contrasena VARCHAR(255),
    cargo VARCHAR(50)
);

-- Inserts de datos (7 datos cada tabla, excepto usuarios con 1)

-- Datos para Empresas (7 registros)
INSERT INTO Empresas (RIF, nombre, direccion_fiscal, numero_telefono, email) VALUES
('J-12345678-0', 'Tech Solutions Corp', 'Av. Principal, Edif. A, Caracas', '02121112233', 'contacto@techsol.com'),
('J-23456789-1', 'Global Innovations', 'Calle 5, Centro Empresarial, Valencia', '02412223344', 'info@globalinnov.net'),
('J-34567890-2', 'Mega Construcciones C.A.', 'Urb. Industrial, Galpón 10, Maracay', '02433334455', 'ventas@megaconstr.com'),
('J-45678901-3', 'Servicios Web Pro', 'Boulevard Digital, Oficina 501, Barquisimeto', '02514445566', 'soporte@webpro.biz'),
('J-56789012-4', 'Logistica Express XXI', 'Zona Franca, Almacén 7, La Guaira', '02125556677', 'logisticaxxi@email.com'),
('J-67890123-5', 'Farmacia Salud y Vida', 'Av. Bolívar, Local 15, Mérida', '02746667788', 'farmacia.sv@salud.org'),
('J-78901234-6', 'Distribuidora Alimentos S.A.', 'Calle del Mercado, Galpón 3, San Cristóbal', '02767778899', 'distribucion@alimentos.net');

-- Datos para Cliente (7 registros)
INSERT INTO Cliente (cedula, nombre, apellido, correo, telefono, direccion) VALUES
('V-12345678', 'María', 'García', 'maria.g@email.com', '04121234567', 'Calle La Paz, Casa 10, Caracas'),
('V-87654321', 'Pedro', 'Martínez', 'pedro.m@email.com', '04147654321', 'Av. Libertador, Edif. B, Apto 5, Valencia'),
('V-23456789', 'Ana', 'Rodríguez', 'ana.r@email.com', '04262345678', 'Residencias El Sol, Apt. 3A, Maracay'),
('V-98765432', 'Luis', 'Hernández', 'luis.h@email.com', '04169876543', 'Urb. Los Pinos, Calle C, Casa 2, Barquisimeto'),
('V-34567890', 'Sofía', 'Pérez', 'sofia.p@email.com', '04123456789', 'Av. Principal, Edif. Plaza, Ofic. 4, La Guaira'),
('V-01234567', 'Carlos', 'González', 'carlos.g@email.com', '04140123456', 'Sector El Carmen, Calle 8, Mérida'),
('V-76543210', 'Laura', 'Sánchez', 'laura.s@email.com', '04247654321', 'Barrio Obrero, Carrera 5, San Cristóbal');

-- Datos para PersonalTecnico (7 registros)
INSERT INTO PersonalTecnico (cedula, nombre, apellido, cargo, direccion, correo, telefono, especializacion) VALUES
('V-10000001', 'Juan', 'Pérez', 'Técnico Senior', 'Calle 1, Zona Industrial, Caracas', 'juan.p@berilion.com', '04121000001', 'Redes Avanzadas, Servidores Linux'),
('V-10000002', 'Gabriela', 'López', 'Soporte Nivel 2', 'Av. Central, Edif. Beta, Valencia', 'gabriela.l@berilion.com', '04141000002', 'Reparación de Hardware, Software de Oficina'),
('V-10000003', 'Ricardo', 'Díaz', 'Especialista en Seguridad', 'Urb. Las Acacias, Casa 5, Maracay', 'ricardo.d@berilion.com', '04261000003', 'Ciberseguridad, Firewalls'),
('V-10000004', 'Andrea', 'Castro', 'Técnico de Campo', 'Sector La Rosa, Calle 10, Barquisimeto', 'andrea.c@berilion.com', '04161000004', 'Cableado Estructurado, Fibra Óptica'),
('V-10000005', 'Fernando', 'Rojas', 'Analista de Sistemas', 'Av. Costanera, Edif. Mar, La Guaira', 'fernando.r@berilion.com', '04121000005', 'Diagnóstico de Redes, Virtualización'),
('V-10000006', 'Patricia', 'Blanco', 'Técnico Jr.', 'Calle del Parque, Urb. Nueva, Mérida', 'patricia.b@berilion.com', '04141000006', 'Soporte al Usuario Final, Windows'),
('V-10000007', 'José', 'Silva', 'Técnico Hardware', 'Carrera 15, Barrio Obrero, San Cristóbal', 'jose.s@berilion.com', '04241000007', 'Mantenimiento Preventivo, Recuperación de Datos');

-- Datos para catalogo (7 registros)
INSERT INTO catalogo (codigo_de_herramienta, nombre, tipo, descripcion, cantidad_disponible) VALUES
('HERR001', 'Multímetro Digital', 'Eléctrica', 'Medición de voltaje, corriente y resistencia', 15),
('HERR002', 'Kit de Herramientas de Red', 'Redes', 'Crimpadora, tester de cables, ponchadora', 10),
('HERR003', 'Estación de Soldadura', 'Electrónica', 'Para reparaciones de componentes electrónicos', 5),
('HERR004', 'Taladro Inalámbrico', 'Manual', 'Para montaje y fijación', 20),
('HERR005', 'Tester de Fibra Óptica', 'Redes', 'Medición y diagnóstico de cables de fibra', 3),
('HERR006', 'Analizador de Redes WiFi', 'Redes', 'Diagnóstico de cobertura y rendimiento WiFi', 8),
('HERR007', 'Kit de Limpieza de PC', 'Mantenimiento', 'Aire comprimido, paños de microfibra, alcohol isopropílico', 25);


-- Datos para Solicitudes (7 registros, alternando entre clientes y empresas)
INSERT INTO Solicitudes (cedula_cliente, empresa_rif, descripcion, fecha, estado_ticket, prioridad) VALUES
('V-12345678', NULL, 'Problema de conexión a internet en residencia.', '2024-05-20', 'Abierta', 'Alta'),
(NULL, 'J-12345678-0', 'Falla de servidor principal en oficina.', '2024-05-21', 'En Proceso', 'Urgente'),
('V-87654321', NULL, 'Mi PC no enciende después de una actualización.', '2024-05-22', 'Abierta', 'Media'),
(NULL, 'J-23456789-1', 'Configuración de nueva red para 20 empleados.', '2024-05-23', 'Pendiente', 'Alta'),
('V-23456789', NULL, 'Impresora no funciona correctamente.', '2024-05-24', 'En Proceso', 'Baja'),
(NULL, 'J-34567890-2', 'Instalación de cámaras de seguridad en obra.', '2024-05-25', 'Asignada', 'Media'),
('V-98765432', NULL, 'Recuperación de datos de disco duro externo.', '2024-05-26', 'Cerrada', 'Urgente');


-- Datos para orden_de_trabajo (7 registros)
INSERT INTO orden_de_trabajo (solicitud_id, tecnico_cedula, codigo_herramienta_asignada, fecha_visita, direccion_visita, estado_planificacion, tipo_de_trabajo, observaciones) VALUES
(1, 'V-10000001', 'HERR002', '2024-05-28', 'Calle La Paz, Casa 10, Caracas', 'Asignada', 'Diagnóstico de Red', 'Revisar router y cableado principal.'),
(2, 'V-10000005', 'HERR006', '2024-05-29', 'Av. Principal, Edif. A, Caracas', 'En Curso', 'Reparación de Servidor', 'Verificar módulos de RAM y disco duro.'),
(3, 'V-10000002', 'HERR001', '2024-05-30', 'Av. Libertador, Edif. B, Apto 5, Valencia', 'Pendiente', 'Mantenimiento Preventivo', 'Limpieza interna y revisión de componentes.'),
(4, 'V-10000004', 'HERR005', '2024-05-31', 'Calle 5, Centro Empresarial, Valencia', 'Asignada', 'Instalación de Red', 'Tendido de cables y configuración de switches.'),
(5, 'V-10000006', 'HERR007', '2024-06-01', 'Residencias El Sol, Apt. 3A, Maracay', 'Completada', 'Revisión de Periféricos', 'Reconfiguración de controladores de impresora.'),
(6, 'V-10000003', 'HERR003', '2024-06-02', 'Urb. Industrial, Galpón 10, Maracay', 'Asignada', 'Instalación de Seguridad', 'Montaje de cámaras y configuración NVR.'),
(7, 'V-10000007', 'HERR004', '2024-06-03', 'Boulevard Digital, Oficina 501, Barquisimeto', 'En Curso', 'Recuperación de Datos', 'Uso de software especializado para HDD.');


-- Insertar usuario de ejemplo (1 registro)
INSERT INTO usuarios (nombre, usuario, contrasena, cargo)
VALUES ('Admin', 'admin', '123456', 'tecnico');
