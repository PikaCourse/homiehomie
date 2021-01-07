from rest_framework import serializers
from user.models import *


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer to return user profile
    """
    class Meta:
        model = Student
        fields = '__all__'
        exclude = ["password"]
        depth = 1


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer to validate user login information
    Should allow either username or email login
    """

    # 150 max character length as by django auth user model
    # Allow user to use registered email as well to login
    username = serializers.CharField(max_length=150)
    password = serializers.CharField()


class UserRegisterSerializer(serializers.Serializer):
    """
    Serializer to validate register information
    """

    # 150 max character length as by django auth user model
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField()
