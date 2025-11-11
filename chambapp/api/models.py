from django.db import models
from django.contrib.auth.models import AbstractUser
from cryptography.fernet import Fernet
from django.conf import settings
cipher = Fernet(settings.ENCRYPTION_KEY)


# ============================================================
# 1️ CANTÓN / PROVINCIA
# ============================================================
class canton_provincia(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


# ============================================================
# 2️ USUARIO
# ============================================================
class Usuario(AbstractUser):
    foto_perfil = models.TextField(blank=True, null=True)
    verificado = models.BooleanField(default=False)
    email = models.EmailField(unique=True, blank=False)
    canton_provincia = models.ForeignKey(canton_provincia, on_delete=models.SET_NULL, null=True, related_name='usuarios')
    direccion = models.CharField(max_length=255, blank=True, null=True)
    latitud = models.FloatField(blank=True, null=True)
    longitud = models.FloatField(blank=True, null=True)
    calificacion_promedio = models.FloatField(default=0)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_usuarios',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_usuarios_permisos',
        blank=True
    )    

    def __str__(self):
        return f"{self.username} registrado el {self.fecha_registro}"


# ============================================================
# 3️ CATEGORÍA
# ============================================================
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre


# ============================================================
# 4️ SERVICIO (lo que ofrece un trabajador)
# ============================================================
class Servicio(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='servicios')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, related_name='servicios')
    nombre_servicio = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio_referencial = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    disponibilidad = models.BooleanField(default=True)
    whatsapp_contacto = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.nombre_servicio} - {self.usuario.username}"


# ============================================================
# 5️ SOLICITUD (publicaciones pidiendo servicios)
# ============================================================
class Solicitud(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='solicitudes')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, related_name='solicitudes')
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField()
    estado = models.BooleanField(default=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    canton_provincia = models.ForeignKey(canton_provincia, on_delete=models.SET_NULL, null=True, related_name='solicitudes')
    latitud = models.FloatField(blank=True, null=True)
    longitud = models.FloatField(blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.titulo} ({'Activa' if self.estado else 'Cerrada'})"


# ============================================================
# 6️ RESENHA
# ============================================================
class Resenha(models.Model):
    autor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='resenhas_realizadas')
    trabajador = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='resenhas_recibidas')
    puntuacion = models.IntegerField(default=5)
    comentario = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    servicio = models.ForeignKey(Servicio, on_delete=models.SET_NULL, null=True, related_name='resenhas')

    def __str__(self):
        return f"Reseña de {self.autor.username} a {self.trabajador.username}"


# ============================================================
# 7️ MENSAJES
# ============================================================
class Mensaje(models.Model):
    remitente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='mensajes_enviados')
    destinatario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='mensajes_recibidos')
    contenido_cifrado = models.BinaryField(default=b'', blank=True)# se almacena el texto cifrado
    fecha_envio = models.DateTimeField(auto_now_add=True)
    
    def set_contenido(self, texto):
        self.contenido_cifrado = cipher.encrypt(texto.encode())

    def get_contenido(self):
        return cipher.decrypt(self.contenido_cifrado).decode()

    def __str__(self):
        return f"{self.remitente.username} → {self.destinatario.username}"


# ============================================================
# 8️ PORTAFOLIO
# ============================================================
class Portafolio(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='portafolio')
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    imagen = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} - {self.usuario.username}"


# ============================================================
# 9️ NOTIFICACIÓN
# ============================================================
class Notificacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='notificaciones')
    solicitud = models.ForeignKey(Solicitud, on_delete=models.CASCADE, related_name='notificaciones')
    contenido = models.CharField(max_length=255)
    fecha_envio = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notif. para {self.usuario.username} - {self.contenido[:30]}..."


# ============================================================
# 10 FAVORITOS
# ============================================================
class Favorito(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='favoritos')
    trabajador = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='guardado_por')

    class Meta:
        unique_together = ('usuario', 'trabajador')

    def __str__(self):
        return f"{self.usuario.username} → {self.trabajador.username}"