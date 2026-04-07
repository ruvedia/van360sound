import requests
from django.conf import settings

def send_whatsapp_message(phone, message):
    """
    Envía un mensaje de WhatsApp utilizando la API de Ultramsg.
    """
    if not settings.WHATSAPP_API_URL or not settings.WHATSAPP_TOKEN:
        print("⚠️ WhatsApp API no configurada. Saltando envío.")
        return False

    # Limpiar el número de teléfono (quitar espacios, guiones, etc.)
    clean_phone = "".join(filter(str.isdigit, phone))
    
    # Asegurar que tenga el prefijo del país (asumimos +34 si no tiene)
    if len(clean_phone) == 9:
        clean_phone = "34" + clean_phone

    payload = {
        "token": settings.WHATSAPP_TOKEN,
        "to": clean_phone,
        "body": message
    }
    
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    try:
        response = requests.post(settings.WHATSAPP_API_URL, data=payload, headers=headers, timeout=10)
        result = response.json()
        if result.get('sent') == 'true' or result.get('success'):
            print(f"✅ WhatsApp enviado a {clean_phone}")
            return True
        else:
            print(f"❌ Error API WhatsApp: {result}")
            return False
    except Exception as e:
        print(f"❌ Error crítico enviando WhatsApp: {e}")
        return False
