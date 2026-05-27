from django.urls import path
from . import views

app_name = "ApiAdmin"

urlpatterns = [
    path("register/", views.register),
    path("check-admin-user/", views.check_admin_users),
    path("send-otp/", views.send_otp),
    path("verify-otp/", views.verify_otp),
]
