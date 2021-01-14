"""
filename:    backends.py
created at:  01/14/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Backend for user application
"""

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User


class EmailAuthBackend(ModelBackend):
    """
    Authenticate the user email and password pair
    """

    def authenticate(self, request, email=None, password=None, **kwargs):
        # Check the email/password and return a user
        if email is None:
            email = kwargs.get("username")
        if email is None or password is None:
            return
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a nonexistent user (#20760).
            User().set_password(password)
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user

