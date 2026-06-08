
/*
  main.js

  Módulo de interacción con la página para generar y descargar códigos QR.

  - Lee valores del formulario (`url-input`, `bg-color`, `fill-color`).
  - Envía una petición POST a `/generar_qr` y muestra la imagen resultante.
  - Proporciona utilidades de UI: mostrar errores y descargar la imagen.
*/

const urlInput = document.getElementById('url-input');
const qrForm = document.getElementById('qr-form');
const qrResultado = document.getElementById('qr-resultado');
const bgColorInput = document.getElementById('bg-color');
const fillColorInput = document.getElementById('fill-color');


/*
  generarQR()

  Envía los datos del formulario al servidor para generar un QR y
  muestra la imagen recibida.

  Parámetros:
    - Ninguno (lee desde el DOM):
        * `url` (string): URL a codificar.
        * `background` (string): color de fondo en formato hex.
        * `fill_color` (string): color del código en formato hex.

  Salida esperada:
    - Inserta en `qrResultado` un `<img>` con el QR generado y un
      botón con clase `btn-download` para descargar la imagen.
    - En caso de error, llama a `mostrarError(mensaje)`.
*/
async function generarQR() {
    const url = urlInput.value.trim();
    const bgColor = bgColorInput.value;
    const fillColor = fillColorInput.value;

    if (!url) {
        mostrarError('❌ Por favor ingresa una URL o texto');
        return;
    }

    if (bgColor === fillColor) {
        mostrarError('❌ El color de fondo y el de relleno no pueden ser iguales');
        return;
    }

    console.log('contenedorQR' + qrResultado);
    qrResultado.innerHTML = '<p>⏳ Generando QR... </p>';

    try {
        const formData = new FormData();
        formData.append('url', url);
        formData.append('background', document.getElementById('bg-color').value);
        formData.append('fill_color', document.getElementById('fill-color').value);

        const respuesta = await fetch('/generar_qr', {
            method: 'POST',
            body: formData
        });

        if (!respuesta.ok) {
            throw new Error('Error al generar el QR');
        }

        const blob = await respuesta.blob();
        const imagenURL = URL.createObjectURL(blob);

        const img = document.createElement('img');
        img.src = imagenURL;
        img.alt = 'Código QR generado';
        img.style.maxWidth = '100%';
        img.style.border = '1px solid #ccc';
        img.style.borderRadius = '8px';

        qrResultado.innerHTML = '';
        qrResultado.appendChild(img);

        const btnDescargar = document.createElement('button');
        btnDescargar.type = 'button';
        btnDescargar.className = 'btn-download';
        btnDescargar.textContent = 'Descargar QR';
        btnDescargar.addEventListener('click', () => descargarQR(imagenURL));

        qrResultado.appendChild(btnDescargar);

    } catch (error) {
        mostrarError('❌ Error: ' + error.message);
    }
}


/*
  mostrarError(mensaje)

  Inserta un párrafo con la clase `error` dentro de `qrResultado`.

  Parámetros:
    - mensaje (string): texto del error a mostrar.

  Salida esperada:
    - Reemplaza el contenido de `qrResultado` por el mensaje formateado.
*/
function mostrarError(mensaje) {
    qrResultado.innerHTML = `<p class="error">${mensaje}</p>`;
}


/*
  descargarQR(imagenURL)

  Inicia la descarga del recurso indicado por `imagenURL`.

  Parámetros:
    - imagenURL (string): URL (por ejemplo creada con `URL.createObjectURL`).

  Salida esperada:
    - Dispara la descarga del fichero `mi_codigo_qr.png`.
*/
function descargarQR(imagenURL) {
    const link = document.createElement('a');
    link.download = 'mi_codigo_qr.png';
    link.href = imagenURL;
    link.click();
}


/*
  Event listeners: conexión de UI

  - Escucha el evento `submit` del formulario para evitar el envío nativo
    y llamar a `generarQR()`.
  - Escucha la tecla Enter en `urlInput` para generar el QR.
*/
urlInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        generarQR();
    }
});

qrForm.addEventListener('submit', (event) => {
    event.preventDefault();
    generarQR();
});
