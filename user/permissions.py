"""
filename:    permissions.py
created at:  01/7/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        permission settings for user application
"""

from rest_framework import permissions


class IsProfileOwnerUser(permissions.BasePermission):
    """
    Check if the user owns the profile
    """

    message = "Not the owner of the profile"

    def has_permission(self, request, view):
        user = request.user

    def has_object_permission(self, request, view, obj):
        pass
