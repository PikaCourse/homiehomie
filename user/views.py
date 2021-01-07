"""
filename:    views.py
created at:  01/6/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0b
desc:        User api for Course Wiki
"""

from user.models import Student
from user.serializers import *
from django.shortcuts import render, redirect, resolve_url
from django.conf import settings
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.views.decorators.debug import sensitive_post_parameters
from django.views.decorators.csrf import ensure_csrf_cookie, requires_csrf_token, csrf_protect
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator
from rest_framework import viewsets, status, mixins
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser

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


class UserViewSet(mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  viewsets.GenericViewSet):
    """
    User viewset api, handle any operations related to users, including:
    As of version 1.0.0b
    - Login
    - Register
    - Retrieve and modify user profile

    Might also support the following in future version:
    - Password reset
    - Change password
    - Delete user
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    parser_classes = [JSONParser]

    # TODO Need to specify permission individually?
    @action(detail=False, methods=["post"])
    @method_decorator(never_cache)
    @method_decorator(csrf_protect)
    @method_decorator(sensitive_post_parameters())
    def login(self, request, *args, **kwargs):
        """
        Login a user with given credentials
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        credentials = UserLoginSerializer(data=request.data)
        if credentials.is_valid():
            # Check if the credentials are correct and can be login
            user = credentials.save()
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
        next_page = resolve_url(settings.LOGOUT_REDIRECT_URL)
        return redirect(next_page)

    @action(detail=False, methods=["post"])
    def register(self, request, *args, **kwargs):
        """
        Register a user with email, username, and a password
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        pass

    def default_get(self, request, *args, **kwargs):
        """
        Retrieve current session user profile via getting the user id from
        session and perform redirectioon
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        pass

    def default_put(self, request, *args, **kwargs):
        """
        Update current user's profile, via getting the user id from
        session and perform redirection
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        pass

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a user's profile, need either admin privilege or the logined user be himself
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        pass

    def update(self, request, *args, **kwargs):
        """
        Update a user's profile, need either admin or the logined user be hiimself
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        pass


# TODO Add support for password management
# TODO Add support for user profile
