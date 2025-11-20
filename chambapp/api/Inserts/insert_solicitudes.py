import requests

URL = "http://127.0.0.1:8000/api/solicitudes/"

solicitudes = [
    {
        "usuario": 1,
        "categoria": 1,
        "titulo": "Necesito reparación de techo",
        "descripcion": "Goteras después de la lluvia",
        "canton_provincia": 1
    },
    {
        "usuario": 2,
        "categoria": 10,
        "titulo": "Busco profesor de inglés",
        "descripcion": "Clases nivel B1",
        "canton_provincia": 2
    }
]

for s in solicitudes:
    response = requests.post(URL, json=s)
    print(s["titulo"], "→", response.status_code)