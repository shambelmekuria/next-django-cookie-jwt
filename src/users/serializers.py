from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User

# Djago buit-in password Checker
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        token['fullname'] = user.get_full_name()
        return token

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'password','email', 'first_name', 'last_name', 'role')
        read_only_fields =('id','is_active','is_staff','is_superuser','last_login','date_joined')
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        password = validated_data.pop('password',None)
        user = User(**validated_data)
        if password is not None:
            user.set_password(password)
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    
    def validate(self, validated_data):
        if validated_data['current_password'] == validated_data['new_password']:
            raise serializers.ValidationError("The new password must be different from the current password.")
        return validated_data
    
# Password Reset Request
class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

# Password Reset Confirm
class PasswordRestConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    
    # Validate new password
    def validate_new_password(self,data):
        # Return Validation Error if it is false
        validate_password(data)
        return data