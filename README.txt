Generador de códigos QR personalizables con Python

Descripción
-----------
Este proyecto es la primera fase de un generador de códigos QR dinámicos. 
En esta fase inicial se ofrece un servicio gratuito para crear códigos QR 
personalizados con selección de color de fondo y color de relleno.

Objetivo del proyecto
---------------------
El objetivo es construir una plataforma que, a largo plazo, permita generar códigos QR 
completamente personalizables y dinámicos. 
El producto final buscará ser accesible, directo, sin intermediarios y con estadísticas 
de escaneo integradas.

Fases del proyecto
------------------
1. Primera fase: Generador de QR gratuito con personalización de color
   - Generación de códigos QR en el navegador.
   - Personalización del color de fondo del QR.
   - Personalización del color del relleno del QR.
   - Entrega del QR en formato de imagen listo para descargar.

2. Segunda fase: Agregar icono central con personalización de color
   - Opción para insertar un icono o logotipo en el centro del QR.
   - Permitir personalizar el color del icono para que combine con el diseño.
   - Esta funcionalidad se considerará como una opción de pago o premium.

3. Fase final: Generador de QR 100% personalizable y dinámico
   - Generación de códigos QR totalmente personalizados.
   - Soporte para contenido dinámico y redirecciones configurables.
   - Interfaz amigable sin intermediación externa.
   - Estadísticas de escaneo para monitorear el uso del QR.

Tecnologías
-----------
- Python
- Flask
- qrcode
- HTML/CSS
- JavaScript

Cómo usar
---------
1. Abrir `qr_web/app.py` y ejecutar la aplicación.
2. Acceder a la página principal en el navegador.
3. Ingresar un texto o URL.
4. Elegir colores de fondo y de código.
5. Generar y descargar el QR.

Notas
-----
Este README describe el alcance actual y la visión futura del proyecto. 
La primera fase ya está implementada; las siguientes fases están planteadas 
como mejora continua y expansión del servicio.