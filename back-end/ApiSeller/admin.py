from django.contrib import admin
from .models import Seller_auth


@admin.register(Seller_auth)
class Seller_authAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'is_active', 'is_onboarded', 'created_at']
    list_filter = ['is_active', 'is_onboarded', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Shop Info', {'fields': ('shop_name', 'shop_description', 'rating')}),
        ('Status', {'fields': ('verified', 'is_active')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

