import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chambapp.settings')
django.setup()

from api.models import Usuario, Favorito, Servicio
from api.serializers import UserSerializer, ServicioSerializer

def debug_favoritos():
    # Find a user with favorites
    print("Searching for a user with favorites...")
    favoritos_all = Favorito.objects.all()
    if not favoritos_all.exists():
        print("No favorites found in the database.")
        return

    # Pick the first user who has a favorite
    usuario = favoritos_all.first().usuario
    print(f"Testing with user: {usuario.username} (ID: {usuario.id})")

    # Logic from favoritos_extendido
    limit = 50
    include_services = True

    favoritos_qs = Favorito.objects.filter(usuario=usuario).select_related('trabajador')[:limit]
    trabajador_ids = [f.trabajador_id for f in favoritos_qs]
    
    servicios_qs = Servicio.objects.filter(
        usuario_id__in=trabajador_ids,
        disponibilidad=True
    ).select_related('categoria')

    servicios_map = {}
    for s in servicios_qs:
        servicios_map.setdefault(s.usuario_id, []).append(s)

    usuarios_qs = Usuario.objects.filter(id__in=trabajador_ids)
    usuarios_map = {u.id: u for u in usuarios_qs}

    resultados = []
    for fav in favoritos_qs:
        t_id = fav.trabajador_id
        trabajador = usuarios_map.get(t_id)
        if not trabajador:
            continue
        
        trabajador_data = UserSerializer(trabajador).data
        servicios_list = servicios_map.get(t_id, [])
        servicios_ser = ServicioSerializer(servicios_list, many=True).data if include_services else []
        
        min_precio = None
        precios = [float(s.precio_referencial) for s in servicios_list if s.precio_referencial is not None]
        if precios:
            min_precio = min(precios)
            
        resultados.append({
            'favorito_id': fav.id,
            'trabajador': trabajador_data,
            'servicios': servicios_ser,
            'min_precio': min_precio,
            'servicios_count': len(servicios_list),
            'promedio_calificacion': trabajador.calificacion_promedio,
        })

    print(json.dumps(resultados, indent=2, default=str))

if __name__ == "__main__":
    debug_favoritos()
