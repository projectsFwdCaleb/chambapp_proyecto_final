import requests

URL = "http://127.0.0.1:8000/api/'mensaje/"

mensajes = [
    { "remitente": 1, "destinatario": 2, "contenido": "Hola, ¿aún ofreces el servicio?" },
    { "remitente": 2, "destinatario": 1, "contenido": "Sí, con gusto te ayudo" }
]

for m in mensajes:
    response = requests.post(URL, json=m)
    print(m["contenido"], "→", response.status_code)