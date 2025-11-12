from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [
    # ------------------------ CRUDs ------------------------
    # canton_provincia
    path('canton_provincia/', canton_provinciaListCreateView.as_view(), name='get y post canton_provincia'),
    path('canton_provincia/<int:pk>', canton_provinciaRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById canton_provincias'),
    # Usuario
    path('Usuario/', UsuarioListCreateView.as_view(), name='get y post Usuarios'),
    path('Usuario/<int:pk>', UsuarioRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Usuarios'),
    #login
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Categoria
    path('Categoria/', CategoriaListCreateView.as_view(), name='get y post Categorias'),
    path('Categoria/<int:pk>', CategoriaRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Categorias'),
    # Servicio
    path('Servicio/', ServicioListCreateView.as_view(), name='get y post Servicios'),
    path('Servicio/<int:pk>', ServicioRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Servicios'),
    # Solicitud
    path('Solicitud/', SolicitudListCreateView.as_view(), name='get y post Solicitudes'),
    path('Solicitud/<int:pk>', SolicitudRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Solicitudes'),
    # Resenha
    path('Resenha/', ResenhaListCreateView.as_view(), name='get y post Resenhas'),
    path('Resenha/<int:pk>', ResenhaRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Resenhas'),
    # Mensaje
    path('Mensaje/', MensajeListCreateView.as_view(), name='get y post Mensajes'),
    path('Mensaje/<int:pk>', MensajeRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Mensajes'),
    # Portafolio
    path('Portafolio/', PortafolioListCreateView.as_view(), name='get y post Portafolios'),
    path('Portafolio/<int:pk>', PortafolioRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Portafolios'),
    # Notificacion
    path('Notificacion/', NotificacionListCreateView.as_view(), name='get y post Notificaciones'),
    path('Notificacion/<int:pk>', NotificacionRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Notificaciones'),
    # Favorito
    path('Favorito/', FavoritoListCreateView.as_view(), name='get y post Favoritos'),
    path('Favorito/<int:pk>', FavoritoRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Favoritos'),

    # ------------------------ CUSTOM ENDPOINTS ------------------------
    # Servicios por categoría
    path('servicios/categoria/<int:categoria_id>/', servicios_por_categoria, name='servicios_por_categoria'),
    # Solicitudes por categoría
    path('solicitudes/categoria/<int:categoria_id>/', solicitudes_por_categoria, name='solicitudes_por_categoria'),
    # Populares en los últimos 7 días
    path('usuarios/populares/', populares_hoy, name='populares_hoy'),
    # Reseñas por trabajador con promedio
    path('resenhas/trabajador/<int:trabajador_id>/', resenhas_trabajador, name='resenhas_trabajador'),
    # Estadísticas de trabajador
    path('estadisticas/trabajador/<int:trabajador_id>/', estadisticas_trabajador, name='estadisticas_trabajador'),
    # Conversaciones de un usuario
    path('mensajes/conversaciones/<int:usuario_id>/', conversaciones_usuario, name='conversaciones_usuario'),
    # Mensajes entre dos usuarios
    path('mensajes/entre/<int:usuario1_id>/<int:usuario2_id>/', mensajes_entre_usuarios, name='mensajes_entre_usuarios'),
]
