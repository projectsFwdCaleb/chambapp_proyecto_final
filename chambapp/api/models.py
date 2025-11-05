from django.db import models;


# ============================================================
# :uno: USUARIO (trabajador o cliente)
# ============================================================
class Roles(models.model):
    nombre = models.CharField()
    permisos = models.CharField()


class canton_provincia:
    nombre: models.CharField()


class Usuario(AbstractUser):
    rol = models.ForeignKey(Roles, on_delete=models.SET_NULL, null=True, related_name='usuarios')
    foto_perfil = models.TextField()
    verificado = models.BooleanField(default=False)
    # Ubicación (compatible con Google Maps APIs)
    canton_provincia = models.ForeignKey(canton_provincia, on_delete=models.SET_NULL, null=True, related_name='usuarios')
    direccion = models.CharField(max_length=255, blank=True, null=True)
    latitud = models.FloatField(blank=True, null=True)
    longitud = models.FloatField(blank=True, null=True)
    calificacion_promedio = models.FloatField(default=0)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.rol})"
    

# ============================================================
# :dos: CATEGORÍA
# ============================================================
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.nombre
    

# ============================================================
# :tres: SERVICIO (lo que ofrece un trabajador)
# ============================================================
class Servicio(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='servicios')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, related_name='servicios')
    nombre_servicio = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio_referencial = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    disponibilidad = models.BooleanField(default=True)
    whatsapp_contacto = models.CharField(max_length=20, blank=True, null=True)
    def __str__ (self):
        return f"{self.nombre_servicio} - {self.usuario.username}"


# ============================================================
# :cuatro: SOLICITUD (publicaciones pidiendo servicios)
# ============================================================
class Solicitud(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='solicitudes')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, related_name='solicitudes')
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField()
    estado = models.BooleanField()
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    # Ubicación asociada a la solicitud
    canton_provincia = models.ForeignKey(canton_provincia, on_delete=models.SET_NULL, null=True, related_name='solicitudes')
    latitud = models.FloatField(blank=True, null=True)
    longitud = models.FloatField(blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    def __str__(self):
        return f"{self.titulo} ({self.estado})"
    

# ============================================================
# :cinco: RESEnha / CALIFICACIÓN
# ============================================================
class Resenha(models.Model):
    autor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='resenhas_realizadas')
    trabajador = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='resenhas_recibidas')
    puntuacion = models.IntegerField(default=5)
    comentario = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    servicio = models.ForeignKey(Servicio, on_delete=models.SET_NULL, null=True, related_name='resenhas_realizadas')
    def __str__(self):
        return f"Resenha de {self.autor.username} a {self.trabajador.username}"
    

# ============================================================
# :seis: MENSAJE / CHAT
# ============================================================
class Mensaje(models.Model):
    remitente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='mensajes_enviados')
    destinatario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='mensajes_recibidos')
    contenido = models.TextField() #cifrado
    fecha_envio = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.remitente.username} → {self.destinatario.username}"
    

# ============================================================
# :siete: PORTAFOLIO / TRABAJOS REALIZADOS
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
# :ocho: NOTIFICACIONES
# ============================================================
class Notificacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='notificaciones')
    solicitud = models.ForeignKey(Solicitud, on_delete=models.CASCADE, related_name='notificaciones')
    contenido = models.CharField(max_length=255)
    leida = models.BooleanField(default=False)
    fecha_envio = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Notif. para {self.usuario.username} - {self.mensaje[:30]}..."
    

# ============================================================
# :nueve: Favoritos
# ============================================================
class Favorito(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='favoritos')
    trabajador = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='guardado_por')
    class Meta:
        unique_together = ('usuario', 'trabajador')  # evita duplicados
    def __str__(self):
        return f"{self.usuario.username} → {self.trabajador.username}"