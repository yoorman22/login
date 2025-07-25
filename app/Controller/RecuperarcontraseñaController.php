<?php
session_start();

// Import PHPMailer classes
require_once __DIR__ . '/../PHPMailer/PHPMailer.php';
require_once __DIR__ . '/../PHPMailer/SMTP.php';
require_once __DIR__ . '/../PHPMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../Model/loginModel.php';

$loginModel = new loginModel();

// Procesar formulario de recuperación
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    
    if (empty($email)) {
        $_SESSION['mensaje'] = 'Por favor, ingrese su correo electrónico.';
        $_SESSION['tipo_mensaje'] = 'error';
    } else {
        // Intentar recuperar contraseña
        $token = $loginModel->recuperarContraseña($email);
        
        if ($token) {
            // Enviar correo con el enlace de recuperación
            if (enviarCorreoRecuperacion($email, $token)) {
                $_SESSION['mensaje'] = 'Se ha enviado un correo de recuperación a su dirección de email. Por favor, revise su bandeja de entrada.';
                $_SESSION['tipo_mensaje'] = 'success';
            } else {
                $_SESSION['mensaje'] = 'Error al enviar el correo. Por favor, intente nuevamente.';
                $_SESSION['tipo_mensaje'] = 'error';
            }
        } else {
            $_SESSION['mensaje'] = 'No se encontró una cuenta con ese correo electrónico.';
            $_SESSION['tipo_mensaje'] = 'error';
        }
    }
    
    // Redirigir para evitar reenvío del formulario
    header('Location: index.php?pagina=recuperarContraseña');
    exit;
}

// Función para enviar correo de recuperación
function enviarCorreoRecuperacion($email, $token) {
    $mail = new PHPMailer(true);
    
    try {
        // Configuración del servidor SMTP
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host = 'sandbox.smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Username = 'e557ec7918dfb7';
        $mail->Password = 'f255d44c895415';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 2525;

        // Remitente y destinatario
        $mail->setFrom('noreply@berilion.com', 'Berilion');
        $mail->addAddress($email);

        // Contenido del correo
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'Recuperación de Contraseña - Berilion';
        
        // URL base para el enlace de recuperación
        $baseUrl = 'http://localhost:8080/login/index.php?pagina=cambiarContraseña&token=';
        $enlaceRecuperacion = $baseUrl . $token;
        
        // Cuerpo del correo en HTML
        $mail->Body = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Recuperación de Contraseña</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #007bff;">Berilion</h2>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                    <h3 style="color: #333; margin-top: 0;">Recuperación de Contraseña</h3>
                    <p>Hemos recibido una solicitud para recuperar la contraseña de su cuenta.</p>
                    <p>Si usted no realizó esta solicitud, puede ignorar este correo.</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="' . $enlaceRecuperacion . '" 
                       style="background-color: #007bff; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block; 
                              font-weight: bold;">
                        Recuperar Contraseña
                    </a>
                </div>
                
                <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; font-size: 14px;">
                    <p><strong>Nota importante:</strong></p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Este enlace es válido por 1 hora</li>
                        <li>Si el enlace no funciona, copie y pegue esta URL en su navegador:</li>
                    </ul>
                    <p style="word-break: break-all; background-color: #fff; padding: 10px; 
                              border-radius: 3px; margin: 10px 0; font-size: 12px;">
                        ' . $enlaceRecuperacion . '
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #6c757d;">
                    <p>Este es un correo automático, por favor no responda a este mensaje.</p>
                </div>
            </div>
        </body>
        </html>';
        
        // Cuerpo del correo en texto plano
        $mail->AltBody = "Recuperación de Contraseña - Berilion\n\n" .
                         "Hemos recibido una solicitud para recuperar la contraseña de su cuenta.\n" .
                         "Si usted no realizó esta solicitud, puede ignorar este correo.\n\n" .
                         "Para recuperar su contraseña, haga clic en el siguiente enlace:\n" .
                         $enlaceRecuperacion . "\n\n" .
                         "Este enlace es válido por 1 hora.\n\n" .
                         "Este es un correo automático, por favor no responda a este mensaje.";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Error al enviar correo de recuperación: " . $e->getMessage());
        return false;
    }
}

// Cargar la vista
require_once __DIR__ . '/../View/RecuperarContraseña.php';