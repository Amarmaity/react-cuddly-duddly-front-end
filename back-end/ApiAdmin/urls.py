from django.urls import path
from . import views

app_name = "ApiAdmin"

urlpatterns = [
    path("register/", views.register),
    path("check-admin-user/", views.check_admin_users),
    path("admin-dashboard/", views.admin_dashboard),
    path("send-otp/", views.send_otp),
    path("verify-otp/", views.verify_otp),
    path("logout/", views.logout_view),
]
