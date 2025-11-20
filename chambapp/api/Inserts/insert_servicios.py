import requests

URL = "http://127.0.0.1:8000/api/servicios/"

servicios = [
    {
        "usuario": 1,
        "categoria": 1,
        "nombre_servicio": "Reparación de paredes",
        "descripcion": "Arreglo de grietas, acabados y repello.",
        "precio_referencial": "25000",
        "whatsapp_contacto": "88881234"
    },
    {
        "usuario": 2,
        "categoria": 4,
        "nombre_servicio": "Corte de césped",
        "descripcion": "Servicio de corte y limpieza.",
        "precio_referencial": "15000",
        "whatsapp_contacto": "88884567"
    },
    {
        "usuario": 3,
        "categoria": 10,
        "nombre_servicio": "Desarrollo web",
        "descripcion": "Páginas web modernas y responsivas.",
        "precio_referencial": "150000",
        "whatsapp_contacto": "88887890"
    }
]

for s in servicios:
    response = requests.post(URL, json=s)
    print(s["nombre_servicio"], "→", response.status_code)