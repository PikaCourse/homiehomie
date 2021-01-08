from user.models import *
from django.contrib.auth import (
    authenticate, get_user_model, password_validation,
)
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework import serializers
from rest_framework.exceptions import NotFound, AuthenticationFailed
from rest_framework.fields import (empty)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer return django auth user model
    """
    class Meta:
        model = User
        exclude = ["password"]


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer to return student profile
    """
    user = UserSerializer(read_only=True)

    class Meta:
        model = Student
        fields = "__all__"


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer to validate user login information
    Should allow either username or email login

    In `save`, authentic user but not log he in, log user in in
    viewset; since the save method aim at checking the
    if the credentials are valid. Also should raise login error here as well
    TODO After checking the credentials are valid, can also check if the user is allow to login
    TODO which is useful in cases like required email verification
    """

    # 150 max character length as by django auth user model
    # Allow user to use registered email as well to login
    username = serializers.CharField(max_length=150)
    password = serializers.CharField()

    def __init__(self, instance=None, data=empty, **kwargs):
        super().__init__(instance, data, **kwargs)
        self.user_cache = None

    def save(self, **kwargs):
        """
        Check the user can be authenticated and is allow to login
        Return the user instance if no error found
        Otherwise raise validation error
        :param kwargs:
        :return:
        """
        assert hasattr(self, '_errors'), (
            'You must call `.is_valid()` before calling `.save()`.'
        )

        assert not self.errors, (
            'You cannot call `.save()` on a serializer with invalid data.'
        )

        username = self.validated_data.get("username")
        password = self.validated_data.get("password")

        # TODO Finish auth user here and support either email or username
        #  Need to write a backend for this, but later,
        #  check: https://docs.djangoproject.com/en/3.1/topics/auth/customizing/#authentication-backends

        if username is not None and password:
            self.user_cache = authenticate(username=username, password=password)
            if self.user_cache is None:
                raise self.get_invalid_login_error()
            else:
                self.confirm_login_allowed(self.user_cache)

        return self.user_cache


    """
    Below is copied from django.contrib.auth.forms and modified
    to suit project need
    """
    def confirm_login_allowed(self, user):
        """
        Controls whether the given User may log in. This is a policy setting,
        independent of end-user authentication. This default behavior is to
        allow login by active users, and reject login by inactive users.
        If the given user cannot log in, this method should raise a
        ``ValidationError``.
        If the given user may log in, this method should return None.
        """
        if not user.is_active:
            raise ValidationError(
                self.error_messages['inactive'],
                code='inactive',
            )
        # TODO Check for email verification here

    def get_user(self):
        return self.user_cache

    def get_invalid_login_error(self):
        raise AuthenticationFailed("invalid username or password combination",
                                   code="invalid_login")


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer to validate register information
    """

    password = serializers.CharField()

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def __init__(self, instance=None, data=empty, **kwargs):
        super().__init__(instance, data, **kwargs)
        self.user_cache = None

    def validate_email(self, value):
        # Value already check against model field Email constraint
        email = value
        if not email:
            raise serializers.ValidationError("missing email field")
        if User.objects.filter(email=email).count():
            raise serializers.ValidationError("email taken")
        return email

    def validate_username(self, value):
        # Not necessary since the username is unique in the
        # django.contrib.auth models
        return value

    def validate_password(self, value):
        # Handled in object-level validation
        return value

    def validate(self, data):
        """
        Object-level validation on object data
        :param data:
        :return:
        """

        # Validate the user password
        # TODO Add additional validator for password strength?
        user = User(**data)
        password = data.get('password')
        errors = dict()
        try:
            # Validate the password and catch the exception
            password_validation.validate_password(password=password, user=user)
        # The exception raised here is different than serializers.ValidationError
        except ValidationError as e:
            errors['password'] = list(e)
        if errors:
            raise serializers.ValidationError(errors)
        return super(UserRegisterSerializer, self).validate(data)

    def create(self, validated_data):
        """
        Create a new user after validating if the credentials are proper
        :param validated_data:
        :return:
        """
        return User.objects.create_user(**validated_data)
