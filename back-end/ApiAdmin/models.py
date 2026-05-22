from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = [
        ("admin", "Admin"),
        ("seller", "Seller"),
        ("tester", "Tester"),
        ("operations", "Operations"),
    ]

    mobile = models.CharField(max_length=15, unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)


class AdminProfile(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": "admin"},
    )
    permissions_level = models.CharField(max_length=20, default="admin")


# Otp Model
class OTP(models.Model):
    mobile = models.CharField(max_length=15, unique=True, blank=False)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        from django.utils import timezone

        return (timezone.now() - self.created_at).total_seconds() > 300

#Seller Model
class SellerProfile(models.Model):
    GST_CHOICES = (
        ("1", "Yes"),
        ("0", "No"),
    )

    PRODUCT_CATEGORY_CHOICES = (
        ("fashion", "Fashion"),
        ("electronics", "Electronics"),
        ("beauty", "Beauty"),
        ("other", "Other"),
    )

    MONTHLY_ORDER_CHOICES = (
        ("0-100", "0-100"),
        ("100-500", "100-500"),
        ("500+", "500+"),
    )

    DISPATCH_CHOICES = (
        ("same_day", "Same Day"),
        ("1_day", "1 Day"),
        ("2_day", "2 Day"),
    )

    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": "seller"},
    )

    business_name = models.CharField(max_length=225, blank=True, null=True)
    store_display_name = models.CharField(max_length=225, blank=True, null=True)
    business_type = models.CharField(max_length=225, blank=True, null=True)

    have_gst = models.CharField(max_length=1, choices=GST_CHOICES, blank=True, null=True)
    gst_number = models.CharField(max_length=15, blank=True, null=True)

    pan = models.CharField(max_length=11, blank=True, null=True)
    name_as_per_pan = models.CharField(max_length=115, blank=True, null=True)

    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    dist = models.CharField(max_length=100, blank=True, null=True)
    pin = models.CharField(max_length=9, blank=True, null=True)

    room_building = models.CharField(max_length=225, blank=True, null=True)
    street_landmark = models.CharField(max_length=255, blank=True, null=True)

    pick_add_one = models.CharField(max_length=225, blank=True, null=True)
    pick_add_two = models.CharField(max_length=225, blank=True, null=True)
    pickup_pin = models.CharField(max_length=20, blank=True, null=True)
    pickup_land_mark = models.CharField(max_length=225, blank=True, null=True)
    pickup_city = models.CharField(max_length=115, blank=True, null=True)
    pickup_state = models.CharField(max_length=225, blank=True, null=True)

    contact_p_name = models.CharField(max_length=115, blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)

    # ✅ Make banking optional (best UX)
    account_holder_name = models.CharField(max_length=50, blank=True, null=True)
    bank_name = models.CharField(max_length=50, blank=True, null=True)
    ifsc_code = models.CharField(max_length=30, blank=True, null=True)
    account_number = models.CharField(max_length=30, blank=True, null=True)

    products_category = models.CharField(
        max_length=50, choices=PRODUCT_CATEGORY_CHOICES, blank=True, null=True
    )

    monthly_order = models.CharField(max_length=20, choices=MONTHLY_ORDER_CHOICES, blank=True, null=True)

    # ✅ FIXED FIELD TYPE
    average_dispatch = models.CharField(
        max_length=20, choices=DISPATCH_CHOICES, default="same_day"
    )

    commission = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    seller_logo = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.business_name or ""
