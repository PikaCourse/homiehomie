"""
filename:    test_utils.py
created at:  01/9/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Some help function to help testing
"""

from django.shortcuts import reverse
from django.contrib.auth.models import User
from django.contrib import auth
from rest_framework import status
from rest_framework.test import APIClient
import json


def login_with_api(test_case, login_data, csrf_checks=False):
    """
    Login via the project API
    :param test_case:
    :param login_data:
    :param csrf_checks:
    :return: response : login response
    """
    url = reverse("user:users-login")
    # Not automatic JSON encoded as the test case is APITestCase from DRF
    # See: https://www.django-rest-framework.org/api-guide/testing/#apirequestfactory
    if not csrf_checks:
        return test_case.client.post(url, data=login_data, format="json")
    else:
        client = APIClient(enforce_csrf_checks=True)
        return client.post(url, data=login_data, format="json")


def register_with_api(test_case, register_data, csrf_checks=False):
    """
    Register a user via the project API
    :param test_case:
    :param register_data:
    :param csrf_checks:
    :return: response : registration response
    """
    url = reverse("user:users-register")
    if not csrf_checks:
        return test_case.client.post(url, data=register_data, format="json")
    else:
        client = APIClient(enforce_csrf_checks=True)
        return client.post(url, data=register_data, format="json")


def logout_with_api(test_case):
    """
    Log a user out via the project API
    :param test_case:
    :return:
    """
    url = reverse("user:users-logout")
    # In case of redirection
    return test_case.client.get(url, follow=True)


def check_login_success(test_case, login_data):
    """
    Check login, expecting success
    :param test_case:
    :param login_data:
    :return:
    """

    response = login_with_api(test_case, login_data)
    test_case.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)

    # Check if the user is actually logged in
    # Courtesy of:
    #   https://stackoverflow.com/questions/5660952/test-that-user-was-logged-in-successfully/35871564#35871564
    user = auth.get_user(test_case.client)
    test_case.assertTrue(user.is_authenticated, msg="User not logged in after login")


def check_login_error(test_case, login_data, error_code="invalid_login", status_code=status.HTTP_403_FORBIDDEN,
                      csrf_checks=False):
    """
    Check login, expecting error
    :param test_case:
    :param login_data:
    :param error_code:
    :param status_code:
    :param csrf_checks:
    :return:
    """
    if csrf_checks:
        error_code = "invalid_csrf"
    response = login_with_api(test_case, login_data, csrf_checks=csrf_checks)
    test_case.assertEqual(response.status_code, status_code)
    if not csrf_checks:
        test_case.assertEqual(response.data["code"], error_code, msg=f"Mismatch error code: Expected: {error_code}\t"
                                                                     f"Actual: {response.data['code']}")


def check_register_success(test_case, register_data):
    """
    Perform a user register operation, expecting success
    :param test_case:
    :param register_data:
    :return:
    """
    response = register_with_api(test_case, register_data)
    test_case.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)

    # Check if the user is created
    user_id = response.data["user"]
    test_case.assertTrue(User.objects.filter(id=user_id).exists(), msg="Fail to create user")
    user = User.objects.get(id=user_id)
    # Check the attribute to be the same
    for field in register_data:
        if field == "password":
            continue
        else:
            expected = register_data[field]
            actual = getattr(user, field, None)
            test_case.assertEqual(actual, expected,
                                  msg=f"Mismatched field {field}: Expected: {expected}\t"
                                  f"Actual: {actual}")

    # Check if the user is actually logged in
    # Courtesy of:
    #   https://stackoverflow.com/questions/5660952/test-that-user-was-logged-in-successfully/35871564#35871564
    user = auth.get_user(test_case.client)
    test_case.assertTrue(user.is_authenticated, msg="User not logged in after registration")


def check_register_error(test_case, register_data, error_code="valid_error", status_code=status.HTTP_400_BAD_REQUEST,
                         csrf_checks=False):
    """
    Perform a user registration operation, expecting error
    :param test_case:
    :param register_data:
    :param error_code:
    :param status_code:
    :param csrf_checks:
    :return:
    """

    if csrf_checks:
        error_code = "invalid_csrf"
    response = register_with_api(test_case, register_data, csrf_checks=csrf_checks)
    test_case.assertEqual(response.status_code, status_code, msg=response.data)
    if not csrf_checks:
        test_case.assertEqual(response.data["code"], error_code, msg=f"Mismatch error code: Expected: {error_code}\t"
                                                                     f"Actual: {response.data['code']}")


def check_logout(test_case):
    """
    Perform a logout, should always be successful
    :param test_case:
    :return:
    """
    # Logout user
    response = logout_with_api(test_case)
    test_case.assertEqual(response.status_code, status.HTTP_200_OK)

    # Check that the user is not logged in
    user = auth.get_user(test_case.client)
    test_case.assertFalse(user.is_authenticated, msg="User not logged out after logout")
