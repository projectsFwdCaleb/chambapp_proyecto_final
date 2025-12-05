from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group
from .models import Usuario, Servicio, Solicitud, Notificacion


# registrar al nuevo usuario automaticamente en el grupo clientes
@receiver(post_save, sender=Usuario) #receiver hace que una funcion actue como disparador 
def assign_client_group(sender, instance, created, **kwargs):
    if created:
        try:
            grupo_cliente = Group.objects.get(id=1)  # ="clientes"
            instance.groups.add(grupo_cliente)
        except Group.DoesNotExist:
            print("El grupo con id=1 no existe.")

# registrar al usuario en el grupo trabajadores cuando agrega un servicio
@receiver(post_save, sender=Servicio)
def add_user_to_workers_group(sender, instance, created, **kwargs):
    if created:
        user = instance.usuario
        # Obtener el grupo "trabajadores"
        grupo_trabajadores = Group.objects.get(name="trabajadores")
        # Agregar al usuario si no estaba
        if not user.groups.filter(name="trabajadores").exists():
            user.groups.add(grupo_trabajadores)
            user.save()

# Enviar notificación al usuario cuando se publica una notificación en su canton y con una categoria asociada
@receiver(post_save, sender=Solicitud)
def notify_workers_on_solicitud(sender, instance, created, **kwargs):
    if not created:
        return

    solicitud = instance
    categoria_solicitud = solicitud.categoria
    canton_solicitud = solicitud.canton_provincia
    grupo_trabajadores = Group.objects.get(name="trabajadores")
    trabajadores = grupo_trabajadores.api_usuarios.all()
    # Filtrar por cantón del trabajador
    trabajadores = trabajadores.filter(canton_provincia=canton_solicitud)
    # Filtrar por categoría que el trabajador ofrece
    trabajadores = trabajadores.filter(
        servicios__categoria=categoria_solicitud
    ).distinct()
    # Crear notificaciones
    for trabajador in trabajadores:
        Notificacion.objects.create(
            usuario=trabajador,
            solicitud=solicitud,  # <--- obligatorio por tu modelo
            contenido=f"Nueva solicitud en tu cantón: {categoria_solicitud.nombre}"
        )