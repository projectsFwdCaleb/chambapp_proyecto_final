import requests

URL = "http://127.0.0.1:8000/api/favorito/"

favoritos = [
    {"usuario": 1, "trabajador": 2},
    {"usuario": 2, "trabajador": 3}
]

for f in favoritos:
    response = requests.post(URL, json=f)
    print(f"{f['usuario']} → {f['trabajador']}", "→", response.status_code)