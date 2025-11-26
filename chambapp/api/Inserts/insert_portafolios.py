import requests

URL = "http://127.0.0.1:8000/api/portafolio/"

portafolios = [
    {
        "usuario": 1,
        "titulo": "Proyecto de repello",
        "descripcion": "Antes y después",
        "imagen": "https://scontent.fsyq2-1.fna.fbcdn.net/v/t39.30808-6/558082138_24612448431729920_1788761601028109559_n.jpg?stp=dst-jpg_s600x600_tt6&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=GqDxm0iDJnsQ7kNvwGy9Ge3&_nc_oc=AdlXJyfT5jhqk9-7l1X8oO_j5vR-Ne5zdykaa8A-c5XDhwZAnUAIXzUn1JEXcMqRBiI&_nc_zt=23&_nc_ht=scontent.fsyq2-1.fna&_nc_gid=JiD2c1UsVQfkiuZWQeuWkw&oh=00_Afg8p6Knv5z5JXhvK5_EbCWaSxOV8cXHSAF6JMfcls5yow&oe=692BA07C"
    },
    {
        "usuario": 3,
        "titulo": "Diseño web empresarial",
        "descripcion": "Sitio moderno",
        "imagen": "https://www.ionos.com/es-us/digitalguide/fileadmin/DigitalGuide/Screenshots_2023/dribbble-website-screenshot.png"
    }
]

for p in portafolios:
    response = requests.post(URL, json=p)
    print(p["titulo"], "→", response.status_code)