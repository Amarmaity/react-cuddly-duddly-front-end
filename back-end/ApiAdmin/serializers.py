import re
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth import get_user_model
from ApiAdmin.models import (AdminProfile,
                            SellerProfile,
                            RolePermission,
                            SiteMaintenance,
                            ActivityLog,
                            PermissionLevel)


User = get_user_model()


class ActiveUserTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        refresh = self.token_class(attrs["refresh"])
        user_id = refresh.payload.get(api_settings.USER_ID_CLAIM)
        user = User.objects.filter(**{api_settings.USER_ID_FIELD: user_id}).first()

        if not user or not user.is_active:
            raise serializers.ValidationError("This account is inactive. Please contact admin.")

        return super().validate(attrs)


class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    mobile = serializers.CharField(max_length=15)
    password = serializers.CharField(write_only=True)

    user_type = serializers.ChoiceField(
        choices=["admin", "seller", "tester", "operations", "super user"]
    )
    permissions_level = serializers.CharField(required=False, default="super user")

    def validate(self, data):
        if User.objects.filter(mobile=data["mobile"]).exists():
            raise serializers.ValidationError(
                {"mobile": "User already exists with this mobile"}
            )

        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError(
                {"email": "User already exists with this email"}
            )

        return data

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User.objects.create_user(
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            username=validated_data["username"],
            email=validated_data["email"],
            mobile=validated_data["mobile"],
            user_type=validated_data["user_type"],
            password=password,
        )

        if user.user_type == "admin":
            AdminProfile.objects.create(
                user=user,
                permissions_level=validated_data.get("permissions_level", "admin"),
            )

        elif user.user_type == "seller":
            SellerProfile.objects.create(user=user)

        return user

    def to_representation(self, instance):
        return {
            "id": instance.id,
            "first_name": instance.first_name,
            "username": instance.username,
            "email": instance.email,
            "mobile": instance.mobile,
            "user_type": instance.user_type,
        }


class AdminLoginSerializer(serializers.Serializer):
    email_or_mobile = serializers.CharField(required=False, allow_blank=False)
    email_or_phone = serializers.CharField(required=False, allow_blank=False)
    password = serializers.CharField()
    user_type = serializers.CharField()

    def validate(self, data):
        email_or_mobile = data.get("email_or_mobile") or data.get("email_or_phone")
        password = data.get("password")
        user_type = data.get("user_type")

        if not email_or_mobile:
            raise serializers.ValidationError(
                {"email_or_mobile": "Email or mobile number is required."}
            )

        user = User.objects.filter(
            user_type=user_type
        ).filter(
            email=email_or_mobile
        ).first() or User.objects.filter(
            user_type=user_type
        ).filter(
            mobile=email_or_mobile
        ).first()

        if not user:
            raise serializers.ValidationError("User not found")

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive. Please contact admin.")
        
        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect password")

        data["user"] = user
        return data


class AdminCreateSellerSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    mobile = serializers.CharField(max_length=15)
    password = serializers.CharField(required=False, write_only=True, allow_blank=True)

    class Meta:
        model = SellerProfile
        exclude = ["id", "user", "created_at", "updated_at"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_mobile(self, value):
        if User.objects.filter(mobile=value).exists():
            raise serializers.ValidationError("Mobile number already exists.")

        if not re.match(r"^[6-9]\d{9}$", value):
            raise serializers.ValidationError("Enter a valid 10 digit mobile number.")

        return value

    def validate_pan(self, value):
        if not re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$", value):
            raise serializers.ValidationError("Invalid PAN number.")
        return value

    def validate_gst_number(self, value):
        have_gst = self.initial_data.get("have_gst")

        if have_gst == "1":
            if not value:
                raise serializers.ValidationError("GST number is required.")

            if not re.match(r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$", value):
                raise serializers.ValidationError("Invalid GST number.")

        return value

    def validate_ifsc_code(self, value):
        if not value:
            return value

        if not re.match(r"^[A-Z]{4}0[A-Z0-9]{6}$", value):
            raise serializers.ValidationError("Invalid IFSC code.")
        return value

    def validate(self, attrs):
        if attrs["have_gst"] == "0":
            attrs["gst_number"] = None

        return attrs

    def create(self, validated_data):
        email = validated_data.pop("email")
        mobile = validated_data.pop("mobile")
        password = validated_data.pop("password", "")

        user = User.objects.create_user(
            username=mobile,
            email=email,
            mobile=mobile,
            user_type="seller",
            password=password or None,
        )

        if not password:
            user.set_unusable_password()
            user.save(update_fields=["password"])

        seller = SellerProfile.objects.create(user=user, **validated_data)

        return seller

    def to_representation(self, instance):
        return {
            "email": instance.user.email,
            "mobile": instance.user.mobile,
            "business_name": instance.business_name,
            "store_display_name": instance.store_display_name,
            "business_type": instance.business_type,
            "have_gst": instance.have_gst,
            "gst_number": instance.gst_number,
            "pan": instance.pan,
            "name_as_per_pan": instance.name_as_per_pan,
            "city": instance.city,
            "state": instance.state,
            "dist": instance.dist,
            "pin": instance.pin,
            "room_building": instance.room_building,
            "street_landmark": instance.street_landmark,
            "pick_add_one": instance.pick_add_one,
            "pick_add_two": instance.pick_add_two,
            "pickup_pin": instance.pickup_pin,
            "pickup_land_mark": instance.pickup_land_mark,
            "pickup_city": instance.pickup_city,
            "pickup_state": instance.pickup_state,
            "contact_p_name": instance.contact_p_name,
            "contact_number": instance.contact_number,
            "account_holder_name": instance.account_holder_name,
            "bank_name": instance.bank_name,
            "ifsc_code": instance.ifsc_code,
            "account_number": instance.account_number,
            "products_category": instance.products_category,
            "monthly_order": instance.monthly_order,
            "average_dispatch": instance.average_dispatch,
            "commission": instance.commission,
        }


class SellerListSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = SellerProfile
        fields = [
            "id",
            "business_name",
            "store_display_name",
            "business_type",
            "city",
            "state",
            "contact_p_name",
            "contact_number",
            "products_category",
            "monthly_order",
            "average_dispatch",
            "commission",
            "is_active",
            "created_at",
            "user",
        ]

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "email": obj.user.email,
            "mobile": obj.user.mobile,
        }

    def get_is_active(self, obj):
        return obj.user.is_active


class AdminSellerDetailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email")
    mobile = serializers.CharField(source="user.mobile", max_length=15)
    is_active = serializers.BooleanField(source="user.is_active", required=False)

    class Meta:
        model = SellerProfile
        fields = [
            "id",
            "email",
            "mobile",
            "business_name",
            "store_display_name",
            "business_type",
            "have_gst",
            "gst_number",
            "pan",
            "name_as_per_pan",
            "city",
            "state",
            "dist",
            "pin",
            "room_building",
            "street_landmark",
            "pick_add_one",
            "pick_add_two",
            "pickup_pin",
            "pickup_land_mark",
            "pickup_city",
            "pickup_state",
            "contact_p_name",
            "contact_number",
            "account_holder_name",
            "bank_name",
            "ifsc_code",
            "account_number",
            "products_category",
            "monthly_order",
            "average_dispatch",
            "commission",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_email(self, value):
        queryset = User.objects.filter(email=value)
        if self.instance:
            queryset = queryset.exclude(id=self.instance.user_id)

        if queryset.exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_mobile(self, value):
        queryset = User.objects.filter(mobile=value)
        if self.instance:
            queryset = queryset.exclude(id=self.instance.user_id)

        if queryset.exists():
            raise serializers.ValidationError("Mobile number already exists.")

        if not re.match(r"^[6-9]\d{9}$", value):
            raise serializers.ValidationError("Enter a valid 10 digit mobile number.")

        return value

    def validate_pan(self, value):
        if value and not re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$", value):
            raise serializers.ValidationError("Invalid PAN number.")
        return value

    def validate_gst_number(self, value):
        have_gst = self.initial_data.get("have_gst")

        if have_gst == "1":
            if not value:
                raise serializers.ValidationError("GST number is required.")

            if not re.match(r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$", value):
                raise serializers.ValidationError("Invalid GST number.")

        return value

    def validate_ifsc_code(self, value):
        if value and not re.match(r"^[A-Z]{4}0[A-Z0-9]{6}$", value):
            raise serializers.ValidationError("Invalid IFSC code.")
        return value

    def validate(self, attrs):
        if attrs.get("have_gst") == "0":
            attrs["gst_number"] = None

        return attrs

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        user = instance.user

        if "email" in user_data:
            user.email = user_data["email"]

        if "mobile" in user_data:
            user.mobile = user_data["mobile"]
            user.username = user_data["mobile"]

        if "is_active" in user_data:
            user.is_active = user_data["is_active"]

        if user_data:
            user.save()

        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()
        return instance



class RolePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolePermission,
        fields = ["permissions_level"]