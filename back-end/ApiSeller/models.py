from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Seller_auth(models.Model):
    """
    Extended Seller profile - links to CustomUser with seller user_type
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'seller'})
    # shop_name = models.CharField(max_length=255)
    # shop_description = models.TextField(blank=True)
    # rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    phone = models.CharField(max_length=15, blank=False, null=False, unique=True)
    is_active = models.BooleanField(default=True)
    is_onboarded = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Seller: {self.user.username} - {self.shop_name}"

