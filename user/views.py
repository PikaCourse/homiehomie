"""
filename:    views.py
created at:  01/6/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0b
desc:        User api for Course Wiki
"""

from user.serializers import *
from user.permissions import *
from user.tokens import *
from django.shortcuts import redirect, resolve_url, reverse, render
from django.conf import settings
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator
from django.utils.http import urlsafe_base64_decode
from rest_framework import viewsets, status, mixins
from rest_framework.response import Response
from rest_framework.decorators import action, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError

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


# TODO Add support for password management, like change password, reset password
class UserLoginViewSet(viewsets.GenericViewSet):
    """
    User login viewset api, handle any operations related to users login, including:
    As of version 1.0.0b
    - Login
    - Register
    - Logout
    - Confirm email
    """

    serializer_class = StudentSerializer
    parser_classes = [JSONParser]
    permission_classes = [AllowAny]     # Should any no authenticated users to login/register
    email_verification_token_generator = EmailVerificationTokenGenerator()

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
            # Refresh user login timestamp for token usage
            auth_login(request, request.user)
            error_pack = {"code": "success", "detail": "already login",
                          "user": request.user.id, "status": status.HTTP_200_OK}
            return Response(error_pack, status=status.HTTP_200_OK)
        credentials = UserLoginSerializer(data=request.data)

        # Set true to raise the exception during validation process immediately
        if credentials.is_valid(raise_exception=True):
            # Check if the credentials are correct and can be login
            user = credentials.save()
            # Credential correct, login user
            auth_login(request, user)
            error_pack = {"code": "success", "detail": "successfully login user",
                          "user": user.id, "status": status.HTTP_200_OK}
            return Response(error_pack, status=status.HTTP_200_OK)
        else:
            raise ValidationError("invalid username or password combination", code="invalid_login")

    @action(detail=False, methods=["get"])
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
    @method_decorator(csrf_protect)
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
            error_pack = {"code": "success", "detail": "successfully register user",
                          "user": user.id, "status": status.HTTP_200_OK}
            # Login user, removed after adding email registration
            auth_login(request, user)

            # Send verification email to user
            try:
                send_verification_email(request)
            except Exception:
                # Ignore any issue with email system
                # Undo user creation upon error
                auth_logout(request)
                user.delete()
                error_pack = {"code": "error", "detail": "Unknown server error",
                              "status": status.HTTP_500_INTERNAL_SERVER_ERROR}

            return Response(error_pack, status=error_pack["status"])
        else:
            raise ValidationError("invalid registration info",
                                  code="invalid_register")

    @action(detail=False, methods=['get'],
            url_path=r'confirm_email/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]+)')
    @method_decorator(never_cache)
    def confirm_email(self, request, uidb64=None, token=None, *args, **kwargs):
        # URL Path config courtesy of:
        #   https://simpleisbetterthancomplex.com/tutorial/2016/08/24/how-to-create-one-time-link.html
        user = self.get_user(uidb64)
        if self.email_verification_token_generator.check_token(user, token):
            # Token verified, modified user `is_verified` and login user
            user.student.is_verified = True
            user.student.save()
            auth_login(request, user)
            # TODO Better template
            context = {
                "message": "You have successfully verified your email and we will be redirecting you shortly.."
            }
            return render(request, 'registration/success_verification.html', context=context)
        else:
            context = {
                "message": "Invalid link, please check the sent mail or request a new one at user panel..."
            }
            # TODO Better template
            return render(request, 'registration/invalid_verification.html', context=context)

    def get_user(self, uidb64):
        """
        Get user id from uidb64, see tokens.py for details
        :param uidb64:
        :return:
        """
        try:
            # urlsafe_base64_decode() decodes to bytestring
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist, ValidationError):
            user = None
        return user

    # TODO More sophisticated setting on this
    def get_throttles(self):
        if self.action in ['register']:
            self.throttle_scope = 'user.' + self.action
        return super().get_throttles()


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
    permission_classes = [IsAuthenticated, IsProfileOwnerUser]
    parser_classes = [JSONParser]

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

    # Comment out since Django redirect does not support 307, which will not
    # drop the POST data
    # def default_put(self, request, *args, **kwargs):
    #     """
    #     Update current user's profile, via getting the user id from
    #     session and perform redirection
    #
    #     Need authenticated user, therefore set permission class to IsAuthenticated
    #     :param request:
    #     :param args:
    #     :param kwargs:
    #     :return:
    #     """
    #     # TODO Redirect to login if fail to authenticated
    #     # Access user id and redirect to specific url
    #     user_id = request.user.id
    #     url = reverse("user:users-detail", kwargs={"pk": user_id})
    #     return redirect(url)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        data = serializer.data
        error_pack = {"code": "success", "detail": "successfully update user profile",
                      "user": data["id"], "status": status.HTTP_200_OK}
        return Response(error_pack, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    @method_decorator(never_cache)
    def verify_email(self, request, *args, **kwargs):
        """
        Allow user to send a new verification link
        will called the send_verification_email method
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        user = request.user
        if not user.student.is_verified:
            return send_verification_email(request)
        else:
            error_pack = {"code": "verified", "detail": "already verified",
                          "user": user.id, "status": status.HTTP_200_OK}
            return Response(error_pack, status=status.HTTP_200_OK)

    # TODO More sophisticated setting on this
    def get_throttles(self):
        if self.action in ['verify_email']:
            self.throttle_scope = 'user.' + self.action
        return super().get_throttles()


def send_verification_email(request, from_email=None,
                            email_template_name='registration/email_verification_email.html',
                            subject_template_name='registration/email_verification_subject.txt',
                            html_email_template_name=None,
                            extra_email_context=None
                            ):
    """
    Function to send verification email, not verify whether the user is logged in
    verification link:
        path param:
            uidb64: user id (in base 64?)
            token: authentication token to look up in db
        /api/confirm_email?uid=&token=
    send to: user.email
    :return:
    """
    user = request.user
    serializer = EmailTokenSerializer(data={"email": user.email})

    opts = {
        'use_https': request.is_secure(),
        'token_generator': default_token_generator,
        'from_email': from_email,
        'email_template_name': email_template_name,
        'subject_template_name': subject_template_name,
        'request': request,
        'html_email_template_name': html_email_template_name,
        'extra_email_context': extra_email_context,
    }

    if serializer.is_valid(raise_exception=True):
        serializer.save(**opts)

        error_pack = {"code": "success", "detail": "successfully deliver verification email",
                      "user": user.id, "email": user.email, "status": status.HTTP_200_OK}
        return Response(error_pack, status=status.HTTP_200_OK)
    else:
        raise ValidationError("invalid email",
                              code="invalid_email")
