"""
filename:    serializers.py
created at:  01/8/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        User system serializer, handle retrieving and updating data format and
             incoming form processing
"""


from user.models import *
from user.validators import *
from user.tokens import *
from django.contrib.auth import (
    authenticate, password_validation,
)
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.template import loader
from django.contrib.auth.forms import _unicode_ci_compare
from django.core.mail import EmailMultiAlternatives
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.fields import (empty)


# TODO Add validation for birthday and gradation
class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer to return student profile
    """
    # Required is set to false since we want the input
    # data to be flatten as well, thus won't contains key `user`
    user = User
    username = serializers.CharField(source="user.username",
                                     validators=[UniqueOrOwnerValidator(queryset=User.objects.all())])
    email = serializers.EmailField(source="user.email",
                                   validators=[UniqueOrOwnerValidator(queryset=User.objects.all())])
    first_name = serializers.CharField(source="user.first_name", allow_blank=True)
    last_name = serializers.CharField(source="user.last_name", allow_blank=True)
    # If read only is true, will not be included in validated data
    last_login = serializers.DateTimeField(source="user.last_login", read_only=True)
    date_joined = serializers.DateTimeField(source="user.date_joined", read_only=True)

    class Meta:
        model = Student
        exclude = ("user", )
        read_only_fields = ("id", )

    def validate_email(self, value):
        # Value already check against model field Email constraint
        email = value
        if not email:
            raise serializers.ValidationError("missing email field")
        if not email.endswith(".edu"):
            raise serializers.ValidationError("requires .edu email for registration")
        return email

    def update(self, instance, validated_data):
        """
        Update the user student profile
        :param instance:
        :param validated_data:
        :return:
        """
        # Update user instance
        user = instance.user
        user_data = validated_data.pop("user")
        for field in user_data:
            if hasattr(user, field):
                setattr(user, field, user_data[field])
        user.save()

        # Update Student instance
        super().update(instance, validated_data)

        return instance


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
        if not email.endswith(".edu"):
            raise serializers.ValidationError("requires .edu email for registration")
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


class EmailTokenSerializer(serializers.Serializer):
    """
    Serializer to send out verification link to user email
    Adapted from django.contrib.auth.forms.PasswordResetForm
    """
    email = serializers.EmailField()

    def send_mail(self, subject_template_name, email_template_name,
                  context, from_email, to_email, html_email_template_name=None):
        """
        Send a django.core.mail.EmailMultiAlternatives to `to_email`.
        """
        subject = loader.render_to_string(subject_template_name, context)
        # Email subject *must not* contain newlines
        subject = ''.join(subject.splitlines())
        body = loader.render_to_string(email_template_name, context)

        email_message = EmailMultiAlternatives(subject, body, from_email, [to_email])
        if html_email_template_name is not None:
            html_email = loader.render_to_string(html_email_template_name, context)
            email_message.attach_alternative(html_email, 'text/html')

        email_message.send()

    def get_users(self, email):
        """Given an email, return matching user(s) who should receive a reset.
        This allows subclasses to more easily customize the default policies
        that prevent inactive users and users with unusable passwords from
        resetting their password.
        """
        email_field_name = User.get_email_field_name()
        active_users = User._default_manager.filter(**{
            '%s__iexact' % email_field_name: email,
            'is_active': True,
        })
        return (
            u for u in active_users
            if u.has_usable_password() and
               _unicode_ci_compare(email, getattr(u, email_field_name))
        )

    def save(self, domain_override=None,
             subject_template_name='registration/password_reset_subject.txt',
             email_template_name='registration/password_reset_email.html',
             use_https=False, token_generator=default_token_generator,
             from_email=None, request=None, html_email_template_name=None,
             extra_email_context=None):
        """
        Generate a one-use only link for resetting password and send it to the
        user.
        """
        email = self.validated_data["email"]
        if not domain_override:
            current_site = get_current_site(request)
            site_name = current_site.name
            domain = current_site.domain
        else:
            site_name = domain = domain_override
        email_field_name = User.get_email_field_name()
        for user in self.get_users(email):
            user_email = getattr(user, email_field_name)
            context = {
                'email': user_email,
                'domain': domain,
                'site_name': site_name,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'user': user,
                'token': token_generator.make_token(user),
                'protocol': 'https' if use_https else 'http',
                **(extra_email_context or {}),
            }
            self.send_mail(
                subject_template_name, email_template_name, context, from_email,
                user_email, html_email_template_name=html_email_template_name,
            )
