from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .serializers import ActiveUserTokenRefreshSerializer

app_name = "ApiAdmin"

urlpatterns = [
    path("register/", views.register),
    path("check-admin-user/", views.check_admin_users),
    path("admin-dashboard/", views.admin_dashboard),
    path("send-otp/", views.send_otp),
    path("verify-otp/", views.verify_otp),
    path(
        "token/refresh/",
        TokenRefreshView.as_view(serializer_class=ActiveUserTokenRefreshSerializer),
    ),
    path("logout/", views.logout_view),
    path("admin-crearte-get-seller/", views.all_sellers),
    path("admin-sellers/<int:seller_id>/", views.seller_detail),
    path("admin-sellers/<int:seller_id>/status/", views.seller_status),
]
