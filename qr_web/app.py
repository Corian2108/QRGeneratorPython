# app.py - Servidor básico
from flask import Flask, render_template, request, send_file
import qrcode
from io import BytesIO
import base64

app = Flask(__name__)

niveles = {
    'L': qrcode.constants.ERROR_CORRECT_L,  # 7%
    'M': qrcode.constants.ERROR_CORRECT_M,  # 15%
    'Q': qrcode.constants.ERROR_CORRECT_Q,  # 25%
    'H': qrcode.constants.ERROR_CORRECT_H   # 30%
}

@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')

@app.route('/generar_qr', methods=['POST'])
def generar_qr():
    """
    Recibe URL del formulario y retorna QR como imagen
    """
    print(f"Datos recibidos: {request.form}")  # Debug: Ver datos recibidos
    # 1. Obtener URL del formulario
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
    
    # 2. Generar QR
    qr = qrcode.QRCode(
        version=version,
        error_correction=niveles.get(error_correction, qrcode.constants.ERROR_CORRECT_H),
        box_size=box_size,
        border=border
    )
    
    qr.add_data(url)
    qr.make(fit=True)
    
    # 3. Crear imagen en memoria (sin guardar en disco)
    img = qr.make_image(fill_color=fill_color, back_color=bg_color)
    
    # 4. Convertir a bytes para enviar al navegador
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    # 5. Enviar la imagen
    return send_file(img_bytes, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)