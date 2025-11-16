from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (TokenRefreshView)
from .views import CustomTokenObtainPairView

urlpatterns = [
    # ------------------------ CRUDs ------------------------
    # canton_provincia
    path('canton_provincia/', canton_provinciaListCreateView.as_view(), name='get y post canton_provincia'),
    path('canton_provincia/<int:pk>', canton_provinciaRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById canton_provincias'),
    # Usuario
    path('usuario/', UsuarioListCreateView.as_view(), name='get y post Usuarios'),
    path('usuario/<int:pk>', UsuarioRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Usuarios'),
    # UsuarioGroup
    path('usuario_group/', UsuarioListCreateView.as_view(), name='get y post Usuarios'),
    path('usuario_group/<int:pk>', UsuarioRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Usuarios'),
    #login
    path('login/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', UserInSession.as_view(), name='user_in_session'),
    # Categoria
    path('categoria/', CategoriaListCreateView.as_view(), name='get y post Categorias'),
    path('categoria/<int:pk>', CategoriaRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Categorias'),
    # Servicio
    path('servicio/', ServicioListCreateView.as_view(), name='get y post Servicios'),
    path('servicio/<int:pk>', ServicioRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Servicios'),
    # Solicitud
    path('solicitud/', SolicitudListCreateView.as_view(), name='get y post Solicitudes'),
    path('solicitud/<int:pk>', SolicitudRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Solicitudes'),
    # Resenha
    path('resenha/', ResenhaListCreateView.as_view(), name='get y post Resenhas'),
    path('resenha/<int:pk>', ResenhaRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Resenhas'),
    # Mensaje
    path('mensaje/', MensajeListCreateView.as_view(), name='get y post Mensajes'),
    path('mensaje/<int:pk>', MensajeRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Mensajes'),
    # Portafolio
    path('portafolio/', PortafolioListCreateView.as_view(), name='get y post Portafolios'),
    path('portafolio/<int:pk>', PortafolioRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Portafolios'),
    # Notificacion
    path('notificacion/', NotificacionListCreateView.as_view(), name='get y post Notificaciones'),
    path('notificacion/<int:pk>', NotificacionRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Notificaciones'),
    # Favorito
    path('favorito/', FavoritoListCreateView.as_view(), name='get y post Favoritos'),
    path('favorito/<int:pk>', FavoritoRetrieveUpdateDestroyView.as_view(), name='Put,Delete y ById Favoritos'),

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
