from rest_framework.permissions import BasePermission

class IsTrabajador(BasePermission):
    """
    Permite acceso solo a usuarios que pertenecen al grupo 'trabajadores'.
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.groups.filter(name='trabajadores').exists()
        )
