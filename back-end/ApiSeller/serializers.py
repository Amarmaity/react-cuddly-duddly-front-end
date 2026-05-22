# 🔹 imports at the TOP
from rest_framework import serializers
from django.contrib.auth import get_user_model
from ApiAdmin.models import SellerProfile

# 🔹 get user model
User = get_user_model()


# 🔹 user serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "mobile", "user_type"]


# 🔹 seller serializer
class SellerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = SellerProfile
        fields = ["id", "shop_name", "user"]
