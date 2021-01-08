"""
filename:    views.py
created at:  01/6/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0b
desc:        User api for Course Wiki
"""

from user.serializers import *
from django.shortcuts import redirect, resolve_url, reverse
from django.conf import settings
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator
from rest_framework import viewsets, status, mixins
from rest_framework.response import Response
from rest_framework.decorators import action, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny

"""
URL Pattern need to implemented
GET: user/, either redirect user to login or to their own page if already logged in
GET: user/{pk}, user own detail page, need auth
GET: user/login, return login page, if logged in, redirect to detail page
POST: user/login, login user
GET: user/register, return register page
POST: user/register, create user

All need auth below
GET/POST: user/{pk}/change-password
GET/POST: user/{pk}/update-profile
DELETE:  user/{pk}, delete user
"""


class UserLoginViewSet(viewsets.GenericViewSet):
    """
    User login viewset api, handle any operations related to users login, including:
    As of version 1.0.0b
    - Login
    - Register
    - Logout
    """

    serializer_class = StudentSerializer
    parser_classes = [JSONParser]
    permission_classes = [AllowAny]     # Should any no authenticated users to login/register

    # TODO Need to specify permission individually?
    @action(detail=False, methods=["post"])
    @method_decorator(never_cache)
    # CSRF is enforced on login and password related views,
    # see https://www.django-rest-framework.org/api-guide/authentication/#sessionauthentication
    @method_decorator(csrf_protect)
    def login(self, request, *args, **kwargs):
        """
        Login a user with given credentials
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        # If already login, simply return the response
        if not request.user.is_anonymous:
            error_pack = {"code": "success", "detail": "already login",
                          "user": request.user.id, "status": status.HTTP_200_OK}
            return Response(error_pack, status=status.HTTP_200_OK)
        credentials = UserLoginSerializer(data=request.data)

        # Set true to raise the exception during validation process immediately
        if credentials.is_valid(raise_exception=False):
            # Check if the credentials are correct and can be login
            user = credentials.save()
            # Credential correct, login user
            auth_login(request, user)
            error_pack = {"code": "success", "detail": "successfully login user",
                          "user": user.id, "status": status.HTTP_200_OK}
            return Response(error_pack, status=status.HTTP_200_OK)
        else:
            raise ValidationError("invalid username or password combination",
                                  code="invalid_login")

    @action(detail=False, methods=["get", "post"])
    @method_decorator(never_cache)
    def logout(self, request, *args, **kwargs):
        """
        Log a user out regardless of login status and redirect
        to LOGOUT_REDIRECT_URL specified in settings.py file
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        auth_logout(request)
        return redirect(settings.LOGOUT_REDIRECT_URL)

    @action(detail=False, methods=["post"])
    def register(self, request, *args, **kwargs):
        """
        Register a user with email, username, and a password
        :param request:
        :param args:
        :param kwargs:
        :return:
        """

        credentials = UserRegisterSerializer(data=request.data)
        if credentials.is_valid(raise_exception=True):
            # Credentials valid, creating new user/student instance
            user = credentials.save()
            # TODO Add email registration step
            error_pack = {"code": "success", "detail": "successfully register user",
                          "user": user.id, "status": status.HTTP_200_OK}
            # Login user, removed after adding email registration
            auth_login(request, user)
            return Response(error_pack, status=status.HTTP_200_OK)
        else:
            raise ValidationError("invalid registration info",
                                  code="invalid_login")


class UserManagementViewSet(mixins.RetrieveModelMixin,
                            mixins.UpdateModelMixin,
                            viewsets.GenericViewSet):
    """
    User profile management viewset, include the following:

    - Retrieve and modify user profile

    Might also support the following in future version:
    - Password reset
    - Change password
    - Delete user
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    # TODO Permission checking
    def default_get(self, request, *args, **kwargs):
        """
        Retrieve current session user profile via getting the user id from
        session and perform redirection

        Need authenticated user, therefore set permission class to IsAuthenticated
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        # TODO Redirect to login if fail to authenticated

        # Access user id and redirect to specific url
        user_id = request.user.id
        # TODO Is there a way to not hardcode this?
        url = reverse("user:users-detail", kwargs={"pk": user_id})
        return redirect(url)

    def default_put(self, request, *args, **kwargs):
        """
        Update current user's profile, via getting the user id from
        session and perform redirection

        Need authenticated user, therefore set permission class to IsAuthenticated
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        # TODO Redirect to login if fail to authenticated
        # Access user id and redirect to specific url
        user_id = request.user.id
        url = self.reverse_action("user:users-detail", kwargs={"pk": user_id})
        return redirect(url)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a user's profile, need either admin privilege or the logined user be himself

        Permission is IsAuthenticated and Owner
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        return Response({"test": "TEST"})

    def update(self, request, *args, **kwargs):
        """
        Update a user's profile, need either admin or the logined user be hiimself
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        return Response({})


# TODO Add support for password management
# TODO Add support for user profile
