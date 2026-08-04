import uuid
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import AbstractUser
import django.utils.timezone
django.utils.timezone.now

class UserType(models.TextChoices):
    ADMIN = "admin", "Admin"
    SELLER = "seller", "Seller"
    CUSTOMER = "customer", "Customer"
    TESTER = "tester", "Tester"
    OPERATIONS = "operations", "Operations"

class AccountRole(AbstractUser):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    mobile = models.CharField(max_length=15,
                             unique=True,
                             blank=True,
                             null=True)
    user_type = models.CharField(max_length=20,
                                choices=UserType.choices,
                                db_index=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = "accounts"
    
    def __str__(self):
        return self.username or self.email or self.mobile or str(self.id)


class AdminProfile(models.Model):
    user = models.OneToOneField(
        AccountRole,
        on_delete=models.CASCADE,
        related_name="admin_profile",
        limit_choices_to={"user_type": UserType.ADMIN},
    )
    permissions_level = models.CharField(max_length=30, default="admin")
    created_at = models.DateTimeField(auto_now_add=True)


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

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="seller_profile",
        limit_choices_to={"user_type": UserType.SELLER},
    )

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

    business_name = models.CharField(max_length=225, blank=True, null=True)
    store_display_name = models.CharField(max_length=225, blank=True, null=True)
    business_type = models.CharField(max_length=100, blank=True, null=True)
    contact_p_name = models.CharField(max_length=115, blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    
    status = models.BooleanField(default=True, db_index=True)
    commission = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    seller_logo = models.URLField(blank=True, null=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(
                fields=["status", "created_at"],
                name="seller_status_created_idx",
            ),
        ]

    def __str__(self):
        return self.business_name or ""
    

class SellerTaxInformation(models.Model):
        seller = models.OneToOneField(
            SellerProfile,
            on_delete=models.CASCADE,
            related_name="tax_information",
        )
        have_gst = models.CharField(max_length=1, choices=SellerProfile.GST_CHOICES, blank=True, null=True)
        gst_number = models.CharField(max_length=15, blank=True, null=True)
        pan = models.CharField(max_length=11, blank=True, null=True)
        name_as_per_pan = models.CharField(max_length=115, blank=True, null=True)
        verified_at = models.DateTimeField(null=True, blank=True)


class SellerBankAccount(models.Model):
        seller = models.OneToOneField(
            SellerProfile,
            on_delete=models.CASCADE,
            related_name="bank_accounts",
        )
        account_holder_name = models.CharField(max_length=50, blank=True, null=True)
        bank_name = models.CharField(max_length=100, blank=True, null=True)
        account_number_encrypted = models.TextField(blank=True, null=True)
        account_number_last4 = models.CharField(max_length=4, blank=True, null=True)
        ifsc_code = models.CharField(max_length=30, blank=True, null=True)
        is_primary = models.BooleanField(default=False)
        is_verified = models.BooleanField(default=False)

        created_at = models.DateTimeField(auto_now_add=True)

        class Meta:
            constraints = [
            models.UniqueConstraint(
                fields=["seller"],
                condition=models.Q(is_primary=True),
                name="one_primary_bank_per_seller",
            ),
        ]


class SellerAddress(models.Model):
        seller = models.ForeignKey(
            SellerProfile,
            on_delete=models.CASCADE,
            related_name="addresses",
        )
        room_building = models.CharField(max_length=225, blank=True, null=True)
        street_landmark = models.CharField(max_length=255, blank=True, null=True)
        city = models.CharField(max_length=100, blank=True, null=True)
        state = models.CharField(max_length=100, blank=True, null=True)
        dist = models.CharField(max_length=100, blank=True, null=True)
        pin = models.CharField(max_length=9, blank=True, null=True)

        created_at = models.DateTimeField(auto_now_add=True)
        pick_add_one = models.CharField(max_length=225, blank=True, null=True)
        pick_add_two = models.CharField(max_length=225, blank=True, null=True)
        pickup_pin = models.CharField(max_length=20, blank=True, null=True)
        pickup_land_mark = models.CharField(max_length=225, blank=True, null=True)
        pickup_city = models.CharField(max_length=115, blank=True, null=True)
        pickup_state = models.CharField(max_length=225, blank=True, null=True) 


class CustomerProfile(models.Model):
    user = models.OneToOneField(
        AccountRole,
        on_delete=models.CASCADE,
        related_name="customer_profile",
        limit_choices_to={"user_type": UserType.CUSTOMER},
    )
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


class CustomerAddress(models.Model):
        customer = models.ForeignKey(
            CustomerProfile,
            on_delete=models.CASCADE,
            related_name="addresses",
        )

        full_name = models.CharField(max_length=150, blank=True, null=True)
        mobile = models.CharField(max_length=15, unique=True, blank=True, null=True)
        address_line1 = models.CharField(max_length=255, blank=True, null=True)
        address_line2 = models.CharField(max_length=255, blank=True, null=True)
        landmark = models.CharField(max_length=255, blank=True, null=True)
        city = models.CharField(max_length=100, blank=True, null=True)
        state = models.CharField(max_length=100, blank=True, null=True)
        postal_code = models.CharField(max_length=9, blank=True, null=True)
        country = models.CharField(max_length=100, blank=True, null=True)

        is_default_shiping = models.BooleanField(default=False)
        is_default_billing = models.BooleanField(default=False)
        created_at = models.DateTimeField(auto_now_add=True)


class ModuleChoies(models.TextChoices):
    DASHBOARD = "dashboard", "Dashboard"
    ORDERS = "orders", "Orders"
    PRODUCTS = "products", "Products"
    CUSTOMERS = "customers", "Customers"
    REPORTS = "reports", "Reports"
    SETTINGS = "settings", "Settings"
    PAYMENTS = "payments", "Payments"


class PermissionLevel(models.TextChoices):
    NONE = "none", "None"
    VIEW = "view", "View"
    EDIT = "edit", "Edit"
    FULL = "full", "Full"


class RolePermission(models.Model):
    """
    One row per (role, module) pair. This is what the 'click a cell to cycle none
    -> view -> edit -> > full' UI reads and writes.
    Seed this table once per role/module combo (a data migration is the
    cleanest way — see note below)
    """
    role = models.CharField(max_length=20, db_index=True)
    module = models.CharField(max_length=20, choices=ModuleChoies.choices)
    level = models.CharField(max_length=10, choices=PermissionLevel.choices,
                              default=PermissionLevel.NONE)

    updated_by = models.ForeignKey(
        "ApiAdmin.AccountRole",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="updated_permissions",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "role_permissions"
        constraints = [
            models.UniqueConstraint(
                fields=["role", "module"],
                name="unique_role_module",
            ),
        ]
    def clear(self):
        #Admin is always full access — enforce it at the model layer too,
        # not just in the frontend, so a stray API call can't downgrade it.
        if self.role == "admin" and self.level != PermissionLevel.FULL:
            raise ValidationError("Admin permission cannot be reduced below full access.")

    def __str__(self):
         return f"{self.role} / {self.module}: {self.level}"


class SiteMaintenance(models.Model):
    """
    Deliberately a singleton (always pk=1). Use SiteMaintenance.load()
    instead of .objects.get(...) so callers never have to think about
    whether the row exists yet.
    """
    is_enabled = models.BooleanField(default=False)
    message = models.TextField(blank=True)
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    allow_admin_bypass = models.BooleanField(default=True)
    notify_users = models.BooleanField(default=True)

    updated_by = models.ForeignKey(
        "ApiAdmin.AccountRole",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_maintenance",
    )

    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = "site_maintenance"

    def save(self, *args, **kwargs):
        self.pk = 1  # Always enforce singleton
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class SiteSettings(models.Model):
    app_name = models.CharField(max_length=100, default="Cuddly Dudly")
    support_email = models.EmailField(blank=True, null=True)
    support_phone = models.CharField(max_length=15, blank=True, null=True)
    timezone = models.CharField(max_length=64, default="Asia/Kolkata")

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "site_settings"

    def save(self, *args, **kwargs):
        self.pk = 1  # Always enforce singleton
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class ActivityLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    actor = models.ForeignKey(
        "ApiAdmin.AccountRole",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="activity_logs",
        help_text="Null actor means the action was performed by the system (e.g. a scheduled job).",
    )
    action = models.CharField(max_length=255)
    target_type = models.CharField(max_length=100, blank=True, null=True)
    target_id = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "activity_logs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["target_type", "target_id"]),
        ]
    def __str__(self):
        who = self.actor or "System"
        return f"{who}: {self.action}"

