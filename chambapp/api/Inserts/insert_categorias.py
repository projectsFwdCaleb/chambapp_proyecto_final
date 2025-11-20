import requests

URL = "http://127.0.0.1:8000/api/categorias/"

categorias = [
    "Construcción",
    "Electricidad",
    "Fontanería",
    "Jardinería",
    "Pintura",
    "Carpintería",
    "Limpieza",
    "Cerrajería",
    "Diseño gráfico",
    "Programación",
    "Clases particulares",
    "Mecánica",
]

for nombre in categorias:
    response = requests.post(URL, json={"nombre": nombre})
    print(nombre, "→", response.status_code)