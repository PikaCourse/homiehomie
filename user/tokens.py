"""
filename:    tokens.py
created at:  01/12/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Token generator for sending one-time link to verify
             user emails or reset passwords
"""

from django.contrib.auth.tokens import PasswordResetTokenGenerator


class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        """
        return a hash value based on user data that will changed
        after the action is performed (namely fields that changed
        after email verified) and current timestamp

        1. User: is_verified field
        2. User: last_login field since after verifying the token is correct,
                user will be logged in again and thus will refresh this timestamp
        :param user:
        :param timestamp:
        :return:
        """
        # Truncate microseconds so that tokens are consistent even if the
        # database doesn't support microseconds.
        login_timestamp = '' if user.last_login is None else user.last_login.replace(microsecond=0, tzinfo=None)
        email_field = user.get_email_field_name()
        email = getattr(user, email_field, '') or ''
        return f'{user.pk}{user.student.is_verified}{login_timestamp}{timestamp}{email}'


default_token_generator = EmailVerificationTokenGenerator()
