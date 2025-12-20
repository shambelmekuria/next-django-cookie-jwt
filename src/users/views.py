from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

# JWT packages for create token manualy
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import (
    AuthenticationFailed,
    TokenError,
    InvalidToken,
)
from rest_framework_simplejwt.tokens import RefreshToken

# custom code
from .models import User
from .serializers import (
    UserSerializer,
    ChangePasswordSerializer,
    ResetPasswordSerializer,
    PasswordRestConfirmSerializer
)

# Django Contrib for Password Reset
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator


# Display User Info
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# Create User
@api_view(["POST"])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Update User
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_user(request):
    try:
        user = User.objects.get(id=request.user.id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# Delete User Account
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_user(request):
    try:
        user = User.objects.get(id=request.user.id)
        user.delete()
        return Response(
            {"message": "Your Account are deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )
    except User.DoesNotExist:
        return Response(
            {"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND
        )


# Password Change
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def passoword_change(request):
    if request.method == "POST":
        serializer = ChangePasswordSerializer(request.data)
        if serializer.is_valid():
            # user = request.user or
            user = User.objects.get(id=request.user.id)
            if not user.check_password(serializer.validated_data["current_password"]):
                return Response(
                    {"error": "Current password is not match"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.set_password()
            user.save()
            return Response(
                {"message": "Password updated successfully"}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(
        {"message": "GET Request Not Allowed"},
        status=status.HTTP_405_METHOD_NOT_ALLOWED,
    )


# Passoword Reset
@api_view(["POST"])
def password_reset_request(request):
    serializer = ResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data["email"]  
        try:
            user = User.objects.filter(email=email).first()
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
       
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"{settings.FRONTEND_URL}/password-reset?uid={uid}&token={token}"
        send_mail(
            subject="Password Reset",
            message=f"{reset_link}",
            from_email="shambelmekuria2022@gmail.com", recipient_list=[email])
        return Response({"message": "The Passord Reset link sent successfully, check spam email"}, status=status.HTTP_200_OK,)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Password Reset Confirm
@api_view(["POST"])
def password_reset_confirm(request):
    # I am Shambel
    serializer = PasswordRestConfirmSerializer(data=request.data)
    if serializer.is_valid():
        uid = urlsafe_base64_decode(serializer.validated_data['uid']).decode()
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        try:
            user = User.objects.get(id=uid)
        except User.DoesNotExist:
            return Response({'message': "User not found"}, status=status.HTTP_404_NOT_FOUND)
        if not default_token_generator.check_token(user, token):
            return Response({'message': 'Invalid Token'},status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password Change Successfully'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
