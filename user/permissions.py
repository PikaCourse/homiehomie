"""
filename:    permissions.py
created at:  01/7/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        permission settings for user application
"""

from rest_framework import permissions
from user.models import *


class IsProfileOwnerUser(permissions.BasePermission):
    """
    Check if the user owns the profile instance
    """

    message = "Not the owner of the profile"

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class NotificationViewSetPermission(permissions.BasePermission):
    """
    Check if the user is the owner of the notification
    """
    message = "Need to be the owner to perform the operation"

    def has_object_permission(self, request, view, obj: Notification):
        """
        :param request:
        :param view:
        :param obj:
        :return:
        """
        return obj.receiver.user == request.user
