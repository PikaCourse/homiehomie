from user.models import Student
from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.views import LoginView
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.views import View
from rest_framework import viewsets
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
            return redirect('login')
        return render(request, "user/register.html", {"form": f})


# TODO Add support for password management
# TODO Add support for user profile