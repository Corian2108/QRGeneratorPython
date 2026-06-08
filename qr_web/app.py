"""
app.py

Servidor Flask mínimo para generar códigos QR.

Rutas expuestas:
  - `/` : devuelve la plantilla HTML principal.
  - `/generar_qr` : acepta POST con datos del formulario y retorna
    la imagen PNG del QR generada en memoria.

El servidor utiliza la librería `qrcode` para crear la imagen y
devuelve el contenido a través de `send_file` sin escribir en disco.
"""

from flask import Flask, render_template, request, send_file
import qrcode
from io import BytesIO
import base64

app = Flask(__name__)

# Map de niveles de corrección de errores soportados por la librería
niveles = {
    'L': qrcode.constants.ERROR_CORRECT_L,  # 7%
    'M': qrcode.constants.ERROR_CORRECT_M,  # 15%
    'Q': qrcode.constants.ERROR_CORRECT_Q,  # 25%
    'H': qrcode.constants.ERROR_CORRECT_H   # 30%
}

@app.route('/')
def index():
        """
        Renderiza la página principal.

        Parámetros:
            - Ninguno.

        Salida esperada:
            - Respuesta HTML generada por la plantilla `index.html`.
        """
        return render_template('index.html')

@app.route('/generar_qr', methods=['POST'])
def generar_qr():
    """
    Genera una imagen PNG de un código QR a partir de los datos recibidos
    en el formulario (vía `request.form`) y la retorna en memoria.

    Parámetros (vía `request.form`):
      - url (str): texto o URL a codificar. Obligatorio.
      - background (str): color de fondo en formato hex (ej. '#ffffff'). Opcional.
      - fill_color (str): color del código en formato hex. Opcional.
      - version (str|None): versión del QR (opcional, puede ser None para auto).
      - error_correction (str): uno de 'L','M','Q','H' (opcional, por defecto 'H').
      - box_size (int): tamaño de cada cuadro del QR (opcional, por defecto 10).
      - border (int): tamaño del borde del QR (opcional, por defecto 4).
      - save_as (bool): flag que indicaría guardar con nombre (no usado aquí).
      - custom_name (str|None): nombre personalizado para guardar (no usado aquí).

    Salida esperada:
      - Respuesta HTTP con `mimetype='image/png'` que contiene la imagen PNG
        del QR generada en memoria.
      - En caso de error retorna una tupla `(mensaje, status_code)` con código 400.
    """
    print(f"Datos recibidos: {request.form}")

    url = request.form.get('url', '')
    bg_color = request.form.get('background', 'white')
    fill_color = request.form.get('fill_color', 'black')
    version = request.form.get('version', None)
    error_correction = request.form.get('error_correction', 'H')
    box_size = int(request.form.get('box_size', 10))
    border = int(request.form.get('border', 4))
    save_as = request.form.get('save_as', 'false').lower() == 'true'
    custom_name = request.form.get('custom_name', None)

    if not url:
        return "Error: Necesitas una URL", 400
    elif not url.startswith(('http://', 'https://')):
        return "Error: La URL debe comenzar con http:// o https://", 400

    qr = qrcode.QRCode(
        version=version,
        error_correction=niveles.get(error_correction, qrcode.constants.ERROR_CORRECT_H),
        box_size=box_size,
        border=border
    )

    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color=fill_color, back_color=bg_color)

    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)

    return send_file(img_bytes, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)