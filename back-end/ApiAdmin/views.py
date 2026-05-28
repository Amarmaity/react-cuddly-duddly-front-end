import random
from .models import OTP, SellerProfile, CustomUser
from .permissions import IsAdmin
from rest_framework import status
from .serializers import (
    AdminLoginSerializer,
    RegisterSerializer,
    AdminCreateSellerSerializer,
    SellerListSerializer
)
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes

User = get_user_model()


# ----------------
# Regristraiopn
# ----------------
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(
        {
            "message": "User created successfully",
            "data": serializer.data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def check_admin_users(request):

    # ================= GET =================
    if request.method == "GET":

        email = request.query_params.get("email", "").strip()
        mobile = request.query_params.get("mobile", "").strip()

        user_exists = (
            CustomUser.objects.filter(email=email).exists()
            or CustomUser.objects.filter(mobile=mobile).exists()
        )

        return Response(
            {
                "message": "User already exists" if user_exists else "New User",
                "success": True,
                "exists": user_exists,
            },
            status=status.HTTP_200_OK,
        )

    # ================= POST LOGIN =================
    elif request.method == "POST":

        serializer = AdminLoginSerializer(data=request.data)

        if serializer.is_valid():

            user = serializer.validated_data["user"]

            return Response(
                {
                    "success": True,
                    "exists": True,
                    "message": "Login Successful",
                    "data": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "mobile": user.mobile,
                        "user_type": user.user_type,
                    },
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "success": False,
                "exists": False,
                "message": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )




# ----------------
# Send Otp
# ----------------
@api_view(["POST"])
@permission_classes([AllowAny])
def send_otp(request):
    mobile = request.data.get("mobile")

    try:
        if not mobile:
            return Response(
                {"message": "Moile number is requred.", "success": False},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(mobile=mobile).filter()

        if not user:
            return Response(
                {"message": "Invalide mobile number", "success": False},
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp = str(random.randint(100000, 999999))
        # Optional: delete old OTP
        OTP.objects.filter(mobile=mobile).delete()
        OTP.objects.create(mobile=mobile, otp=otp)
        print(f"Otp for {mobile} is {otp}")

        return Response(
            {"success": True, "otp": otp, "message": "Otp sent successfully."},
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        return Response(
            {"message": str(e), "success": False}, status=status.HTTP_400_BAD_REQUEST
        )


# ----------------
# Verify Otp
# ----------------
@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    mobile = request.data.get("mobile")
    otp = request.data.get("otp")

    try:
        otp_obj = OTP.objects.filter(mobile=mobile).latest("created_at")

        if otp_obj.is_expired():
            return Response(
                {"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST
            )

        if otp_obj.otp != otp:
            return Response(
                {"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.get(mobile=mobile)

        # 🔥 CREATE JWT TOKEN
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login Successfull",
                "token": {"access": str(refresh.access_token), "refresh": str(refresh)},
                "data": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "mobile": user.mobile,
                    "user_type": user.user_type,
                },
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response(
            {"success": False, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_dashboard(request):
    return Response({"message": "Welcome Admin", "user": request.user.username})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated, IsAdmin])
def all_sellers(request):

    try:
        if request.method == "GET":
            queryset = (
                SellerProfile.objects.select_related("user").all().order_by("-id")
            )
            serializer = SellerListSerializer(queryset, many=True)

            return Response(
                {
                    "success": True,
                    "message": "Seller list fetch Successfully",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        elif request.method == "POST":
            serializer = AdminCreateSellerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()

            return Response(
                {
                    "message": "Seller created successfully",
                    "success": True,
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

    except Exception as e:
        return Response(
            {"success": False, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )
