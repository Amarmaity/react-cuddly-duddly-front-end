import re
from rest_framework import serializers
from django.contrib.auth import get_user_model
from ApiAdmin.models import AdminProfile, SellerProfile

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
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
            "username": instance.username,
            "email": instance.email,
            "mobile": instance.mobile,
            "user_type": instance.user_type,
        }


class AdminCreateSellerSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    mobile = serializers.CharField(max_length=15)

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

        user = User.objects.create_user(
            username=mobile, email=email, mobile=mobile, user_type="seller"
        )

        seller = SellerProfile.objects.create(user=user, **validated_data)

        return seller



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
        
        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect password")

        data["user"] = user
        return data




class SellerListSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

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
            "created_at",
            "user",
        ]

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "email": obj.user.email,
            "mobile": obj.user.mobile,
        }
