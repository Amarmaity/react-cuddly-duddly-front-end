from django.contrib import admin
from .models import (AdminProfile, OTP, SellerProfile, CustomerProfile, CustomerAddress)


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

@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "date_of_birth", "gender", "created_at"]

@admin.register(CustomerAddress)
class CustomerAddressAdmin(admin.ModelAdmin):
    list_display = ["full_name", "address_line1", "city", "state", "postal_code", "country"]