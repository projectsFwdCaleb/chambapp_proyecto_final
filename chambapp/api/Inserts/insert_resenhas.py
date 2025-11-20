import requests

URL = "http://127.0.0.1:8000/api/resenhas/"

resenhas = [
    {
        "autor": 1,
        "trabajador": 2,
        "puntuacion": 5,
        "comentario": "Excelente servicio",
        "servicio": 1
    },
    {
        "autor": 2,
        "trabajador": 3,
        "puntuacion": 4,
        "comentario": "Muy profesional",
        "servicio": 3
    }
]

for r in resenhas:
    response = requests.post(URL, json=r)
    print(r["comentario"], "→", response.status_code)