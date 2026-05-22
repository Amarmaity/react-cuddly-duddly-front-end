from django.contrib import admin
from .models import (AdminProfile, OTP, SellerProfile)


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "permissions_level")
    readonly_fields = ()
    list_filter = ("permissions_level",)


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ["mobile", "otp", "created_at"]


@admin.register(SellerProfile)
class SellerListing(admin.ModelAdmin):
    list_display = ["business_name", "store_display_name", "contact_p_name"]