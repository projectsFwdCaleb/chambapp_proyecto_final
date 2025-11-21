import requests

URL = "http://127.0.0.1:8000/api/notificaciones/"

notifs = [
    { "usuario": 1, "solicitud": 2, "contenido": "Nueva oferta recibida" },
    { "usuario": 2, "solicitud": 1, "contenido": "Tu solicitud tiene una respuesta" }
]

for n in notifs:
    response = requests.post(URL, json=n)
    print(n["contenido"], "→", response.status_code)