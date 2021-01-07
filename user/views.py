"""
filename:    views.py
created at:  01/6/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0b
desc:        User api for Course Wiki
"""

from user.models import Student
from user.serializers import StudentSerializer
from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.views import LoginView
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.views import View
from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer

"""
URL Pattern
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

    # TODO Need to specify permission individually?
    @action(detail=False, methods=["post"])
    def login(self, request, *args, **kwargs):
        """
        Login a user with given credientials
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        pass

    @action(detail=False, methods=["get"])
    def logout(self, request, *args, **kwargs):
        """
        Log a user out regardless of login status
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        pass

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


class RegisterUserView(View):
    """
    Register user and redirect user to profile page
    """

    def get(self, request):
        """
        Render registration page
        :param request:
        :return:
        """
        if request.user.is_authenticated:
            return redirect("/", username=request.user.username)
        else:
            f = UserCreationForm()
            return render(request, "user/register.html", {"form": f})

    def post(self, request):
        """
        Create user and authenticate
        :param request:
        :return:
        """
        f = UserCreationForm(request.POST)
        if f.is_valid():
            user = f.save(commit=False)
            user.save()
            return redirect('user:login')
        return render(request, "user/register.html", {"form": f})


# TODO Add support for password management
# TODO Add support for user profile