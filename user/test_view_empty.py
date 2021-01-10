"""
filename:    test_view_empty.py
created at:  01/9/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Unit tests for user application with empty test database
"""

from django.shortcuts import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.exceptions import *
from datetime import datetime
from user.test_utils import *
from scheduler.test_utils import check_method_not_allowed
from django.contrib.auth.models import User
from django.contrib import auth
import json
import random


"""
Begin TestCase classes
"""


class UserLoginViewSetTests(APITestCase):
    """
    Unit tests for UserLoginViewSet
    """

    def test_user_login(self):
        """
        Try to login user with empty database, expecting error
        :return:
        """

        login_data = {
            "username": "tester",
            "password": "password"
        }

        check_login_error(self, login_data, "invalid_login")

    def test_user_login_without_csrf(self):
        """
        Login without CSRF token
        :return:
        """
        login_data = {
            "username": "tester",
            "password": "password"
        }

        check_login_error(self, login_data, "invalid_login", csrf_checks=True)

    def test_user_login_methods_not_allowed(self):
        """
        Check if methods beside `post` are disabled
        :return:
        """
        url = reverse("user:users-login")
        methods_not_allowed = ["GET", "PUT", "PATCH", "DELETE"]
        for method in methods_not_allowed:
            check_method_not_allowed(self, url, method)

    def test_user_register(self):
        """
        Normally register a user and see the user
        is registered and logged in
        :return:
        """
        register_data = {
            "username": "tester",
            "password": "testcoursewiki",
            "email": "test@test.edu"
        }

        check_register_success(self, register_data)

    def test_user_register_without_csrf(self):
        """
        Register a user without csrf, expecting error
        :return:
        """

        register_data = {
            "username": "tester",
            "password": "testcoursewiki",
            "email": "test@test.edu"
        }

        check_register_error(self, register_data, csrf_checks=True)

    def test_user_register_email_without_edu(self):
        """
        Register a user with non-edu email
        :return:
        """

        register_data = {
            "username": "tester",
            "password": "testcoursewiki",
            "email": "test@test.com"
        }

        check_register_error(self, register_data)

    def test_user_register_same_username(self):
        """
        Register two users with same username, expecting error
        :return:
        """

        register_data_1 = {
            "username": "tester1",
            "password": "testcoursewiki",
            "email": "test1@test.edu"
        }

        register_data_2 = {
            "username": "tester1",
            "password": "testcoursewiki",
            "email": "test2@test.edu"
        }

        check_register_success(self, register_data_1)
        check_register_error(self, register_data_2)

    def test_user_register_same_email(self):
        """
        Register two users with same email, expecting error
        :return:
        """

        register_data_1 = {
            "username": "tester1",
            "password": "testcoursewiki",
            "email": "test@test.edu"
        }

        register_data_2 = {
            "username": "tester2",
            "password": "testcoursewiki",
            "email": "test@test.edu"
        }

        check_register_success(self, register_data_1)
        check_register_error(self, register_data_2)

    def test_user_register_same_password(self):
        """
        Register two users with same password, which is allowed
        :return:
        """

        register_data_1 = {
            "username": "tester1",
            "password": "samepassword",
            "email": "test1@test.edu"
        }

        register_data_2 = {
            "username": "tester2",
            "password": "samepassword",
            "email": "test2@test.edu"
        }

        check_register_success(self, register_data_1)
        check_register_success(self, register_data_2)

    def test_user_register_methods_not_allowed(self):
        """
        Check if methods beside `post` are disabled
        :return:
        """
        url = reverse("user:users-register")
        methods_not_allowed = ["GET", "PUT", "PATCH", "DELETE"]
        for method in methods_not_allowed:
            check_method_not_allowed(self, url, method)

    def test_user_logout(self):
        """
        Test logout independent with api login or register
        :return:
        """
        user_data = {
            "username": "tester",
            "password": "testcoursewiki"
        }

        User.objects.create_user(**user_data)
        self.client.login(**user_data)

        check_logout(self)

    def test_user_logout_with_api(self):
        """
        Test logout after register as well as log in
        :return:
        """

        # Register
        register_data = {
            "username": "tester",
            "password": "testcoursewiki",
            "email": "test@test.edu"
        }

        check_register_success(self, register_data)
        check_logout(self)

        # Login
        check_login_success(self, register_data)
        check_logout(self)

    def test_user_logout_with_logged_in(self):
        """
        Test logout without previous logged in
        :return:
        """

        check_logout(self)

    def test_user_logout_after_logout(self):
        """
        Test logout a user twice
        :return:
        """

        login_data = {
            "username": "tester",
            "password": "testcoursewiki"
        }

        check_login_success(self, login_data)
        check_logout(self)
        check_logout(self)

    def test_user_logout_methods_not_allowed(self):
        """
        Check if methods beside `get` are disabled
        :return:
        """
        url = reverse("user:users-logout")
        methods_not_allowed = ["POST", "PUT", "PATCH", "DELETE"]
        for method in methods_not_allowed:
            check_method_not_allowed(self, url, method)


class UserManagementViewSetTests(APITestCase):
    pass

