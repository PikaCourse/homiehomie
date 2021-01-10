"""
filename:    test_view.py
created at:  01/9/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Unit tests for user application
"""

from django.shortcuts import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.exceptions import *
from datetime import datetime
from user.test_utils import *
from scheduler.test_utils import check_method_not_allowed, check_fields
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
    """
    Unit test for UserManagementViewSet
    """

    def test_user_retrieve_default_empty(self):
        """
        Retrieve default user profile
        :return:
        """

        check_retrieve_user_profile_error(self)

    def test_user_retrieve_id_empty(self):
        """
        Retrieve by id, expecting 403 due to not logged in
        :return:
        """

        check_retrieve_user_profile_error(self, pk=1)

    def test_user_retrieve_create_user(self):
        """
        Create a user and access the his own page and other page
        :return:
        """
        # Create a user
        register_data = {
            "username": "tester",
            "password": "testcoursewiki",
            "email": "test@test.edu"
        }

        check_register_success(self, register_data)

        # Get user profile via default redirection
        user_profile = check_retrieve_user_profile_success(self)

        # Verify user field and field content
        fields = [
            "id", "email", "username", "school", "major",
            "majors", "minors", "graduation", "birthday", "sex", "type"
        ]
        check_fields(self, user_profile, fields)
        check_fields_content(self, user_profile, register_data, exclude=("password",))

        # Via direct retrieve
        user_profile = check_retrieve_user_profile_success(self, pk=user_profile["id"])
        check_fields(self, user_profile, fields)
        check_fields_content(self, user_profile, register_data, exclude=("password",))

        # Access others, expecting not found
        check_retrieve_user_profile_error(self, pk=2, error_code="not_found", status_code=status.HTTP_404_NOT_FOUND)

    def test_user_retrieve_access_other_user(self):
        """
        Create two users and see if user A can access user B's profile
        Should not allowed this
        :return:
        """
        # Create two users
        user_1 = {
            "username": "tester1",
            "password": "testcoursewiki",
            "email": "test1@test.edu"
        }

        user_2 = {
            "username": "tester2",
            "password": "testcoursewiki",
            "email": "test2@test.edu"
        }

        user_obj_1 = User.objects.create_user(**user_1)
        user_obj_2 = User.objects.create_user(**user_2)

        # Login with user_1 and access user 2
        login_with_api(self, user_1)

        # Try to access user 2 profile, expecting 403 error
        check_retrieve_user_profile_error(self, pk=user_obj_2.id, error_code="permission_denied")

    def test_user_update_empty(self):
        """
        Update a user profile with empty db
        :return:
        """
        check_update_user_profile_error(self, data={}, pk=1)

    def test_user_update_create_user(self):
        """
        Create users to test update
        :return:
        """

        # Create a user
        register_data = {
            "username": "tester",
            "password": "testcoursewiki",
            "email": "test@test.edu"
        }

        changed_user = {
            "username": "testertester",
            "email": "chest@ted.edu",
            "first_name": "first",
            "last_name": "last",
            "school": "test university",
            "major": "Test Major",
            "majors": ["Test 1", "Test 2"],
            "minors": ["Minor 1", "Minor 2"],
            "graduation": "2022-12-24",
            "birthday": "2000-04-23",
            "sex": "male",
            "type": "JR"
        }

        user = check_register_success(self, register_data)

        # Get user profile via default redirection
        # TODO Return should be error packet not the user profile
        check_update_user_profile_success(self, changed_user, pk=user["user"])

        # Get the user profile
        user_profile = check_retrieve_user_profile_success(self)
        check_fields_content(self, user_profile, changed_user)

    def test_user_update_access_other_user(self):
        """
        Create two users and let user 1 update to user 2
        :return:
        """

        # Create a user
        user_1 = {
            "username": "tester1",
            "password": "testcoursewiki",
            "email": "test1@test.edu"
        }

        user_2 = {
            "username": "tester2",
            "password": "testcoursewiki",
            "email": "test2@test.edu"
        }

        changed_user = {
            "username": "testertester",
            "email": "chest@ted.edu",
            "first_name": "first",
            "last_name": "last",
            "school": "test university",
            "major": "Test Major",
            "majors": ["Test 1", "Test 2"],
            "minors": ["Minor 1", "Minor 2"],
            "graduation": "2022-12-24",
            "birthday": "2000-04-23",
            "sex": "male",
            "type": "JR"
        }

        user_obj_1 = User.objects.create_user(**user_1)
        user_obj_2 = User.objects.create_user(**user_2)

        # Login with user_1 and access user 2
        login_with_api(self, user_1)

        check_update_user_profile_error(self, data=changed_user, pk=user_obj_2.id, error_code="permission_denied")

    def test_user_update_same_name(self):
        """
        Create users to test update
        :return:
        """

        # Create a user
        user_1 = {
            "username": "tester1",
            "password": "testcoursewiki",
            "email": "test1@test.edu"
        }

        user_2 = {
            "username": "tester2",
            "password": "testcoursewiki",
            "email": "test2@test.edu"
        }

        changed_user = {
            "username": user_2["username"]
        }

        user_obj_1 = User.objects.create_user(**user_1)
        user_obj_2 = User.objects.create_user(**user_2)

        # Login with user_1 and access user 2
        login_with_api(self, user_1)

        # Submit update request
        check_update_user_profile_error(self, data=changed_user, pk=user_obj_1.id,
                                        error_code="valid_error", status_code=status.HTTP_400_BAD_REQUEST)

    def test_user_update_same_email(self):
        """
        Create users to test update
        :return:
        """

        # Create a user
        user_1 = {
            "username": "tester1",
            "password": "testcoursewiki",
            "email": "test1@test.edu"
        }

        user_2 = {
            "username": "tester2",
            "password": "testcoursewiki",
            "email": "test2@test.edu"
        }

        changed_user = {
            "email": user_2["email"]
        }

        user_obj_1 = User.objects.create_user(**user_1)
        user_obj_2 = User.objects.create_user(**user_2)

        # Login with user_1 and access user 2
        login_with_api(self, user_1)

        # Submit update request
        check_update_user_profile_error(self, data=changed_user, pk=user_obj_1.id,
                                        error_code="valid_error", status_code=status.HTTP_400_BAD_REQUEST)

    def test_user_update_email_without_edu(self):
        """
        Create users to test update
        :return:
        """

        # Create a user
        user_1 = {
            "username": "tester1",
            "password": "testcoursewiki",
            "email": "test1@test.edu"
        }

        changed_user = {
            "email": "chest@test.com"
        }

        user_obj_1 = User.objects.create_user(**user_1)
        login_with_api(self, user_1)

        # Submit update request
        check_update_user_profile_error(self, data=changed_user, pk=user_obj_1.id,
                                        error_code="valid_error", status_code=status.HTTP_400_BAD_REQUEST)
