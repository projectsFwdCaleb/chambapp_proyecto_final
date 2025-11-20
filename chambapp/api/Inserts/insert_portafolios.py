import requests

URL = "http://127.0.0.1:8000/api/portafolio/"

portafolios = [
    {
        "usuario": 1,
        "titulo": "Proyecto de repello",
        "descripcion": "Antes y después",
        "imagen": "https://via.placeholder.com/300"
    },
    {
        "usuario": 3,
        "titulo": "Diseño web empresarial",
        "descripcion": "Sitio moderno",
        "imagen": "https://via.placeholder.com/400"
    }
]

for p in portafolios:
    response = requests.post(URL, json=p)
    print(p["titulo"], "→", response.status_code)