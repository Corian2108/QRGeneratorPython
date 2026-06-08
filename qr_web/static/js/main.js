
// 1. Obtener referencias a los elementos del DOM
const urlInput = document.getElementById('url-input');
const qrForm = document.getElementById('qr-form');
const qrResultado = document.getElementById('qr-resultado');
const bgColorInput = document.getElementById('bg-color');
const fillColorInput = document.getElementById('fill-color');

// 2. Función que se ejecuta al hacer clic
async function generarQR() {
    // Obtener la URL ingresada por el usuario
    const url = urlInput.value.trim();
    const bgColor = bgColorInput.value;
    const fillColor = fillColorInput.value;

    // Validar que no esté vacío
    if (!url) {
        mostrarError('❌ Por favor ingresa una URL o texto');
        return;
    }

    if (bgColor === fillColor) {
        mostrarError('❌ El color de fondo y el de relleno no pueden ser iguales');
        return;
    }

    // Mostrar mensaje de "cargando"
    console.log('contenedorQR' + qrResultado);
    qrResultado.innerHTML = '<p>⏳ Generando QR... </p>';

    try {
        // Enviar la URL al servidor usando Fetch API
        const formData = new FormData();
        formData.append('url', url);
        formData.append('background', document.getElementById('bg-color').value);
        formData.append('fill_color', document.getElementById('fill-color').value);

        const respuesta = await fetch('/generar_qr', {
            method: 'POST',
            body: formData
        });

        // Verificar si la respuesta es exitosa
        if (!respuesta.ok) {
            throw new Error('Error al generar el QR');
        }

        // Convertir la respuesta a una imagen
        const blob = await respuesta.blob();
        const imagenURL = URL.createObjectURL(blob);

        // Crear elemento <img> y mostrarlo
        const img = document.createElement('img');
        img.src = imagenURL;
        img.alt = 'Código QR generado';
        img.style.maxWidth = '100%';
        img.style.border = '1px solid #ccc';
        img.style.borderRadius = '8px';

        // Limpiar y mostrar la imagen
        qrResultado.innerHTML = '';
        qrResultado.appendChild(img);

        // Añadir botón para descargar
        const btnDescargar = document.createElement('button');
        btnDescargar.textContent = '💾 Descargar QR';
        btnDescargar.style.marginTop = '15px';
        btnDescargar.style.backgroundColor = '#28a745';
        btnDescargar.onclick = () => descargarQR(imagenURL);

        qrResultado.appendChild(btnDescargar);

    } catch (error) {
        mostrarError('❌ Error: ' + error.message);
    }
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    qrResultado.innerHTML = `<p class="error">${mensaje}</p>`;
}

// Función para descargar el QR
function descargarQR(imagenURL) {
    const link = document.createElement('a');
    link.download = 'mi_codigo_qr.png';
    link.href = imagenURL;
    link.click();
}

// 3. Conectar el botón con la función
// generarBtn.addEventListener('click', generarQR);

// 4. Opcional: Generar al presionar Enter
urlInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        generarQR();
    }
});
// 3. Conectar el formulario con la función evitando el envío nativo
qrForm.addEventListener('submit', (event) => {
    event.preventDefault();
    generarQR();
});

// 4. Opcional: Generar al presionar Enter dentro del campo de URL
urlInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        generarQR();
    }
});