import requests

URL = "http://127.0.0.1:8000/api/usuarios/"

usuarios = [
    {
        "username": "juan123",
        "password": "password123",
        "email": "juan@example.com",
        "first_name": "Juan",
        "last_name": "Pérez",
        "canton_provincia": 1,
        "direccion": "San José Centro",
    },
    {
        "username": "maria456",
        "password": "mypass4567",
        "email": "maria@example.com",
        "first_name": "María",
        "last_name": "Gómez",
        "canton_provincia": 2,
        "direccion": "Escazú",
    },
    {
        "username": "carlos789",
        "password": "superpass89",
        "email": "carlos@example.com",
        "first_name": "Carlos",
        "last_name": "Ramírez",
        "canton_provincia": 3,
        "direccion": "Desamparados",
    }
]

for u in usuarios:
    response = requests.post(URL, json=u)
    print(u["username"], "→", response.status_code)