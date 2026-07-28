from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    message = "Admin access required."

    def has_permission(self, request, view):
        user = request.user

        return bool(
            user
            and user.is_authenticated
            and (user.user_type == "admin" or user.is_staff or user.is_superuser)
        )


class IsSeller(BasePermission):
    message = "Seller access required."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.user_type == "seller"
        )
