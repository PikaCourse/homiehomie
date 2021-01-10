"""
filename:    permissions.py
created at:  01/9/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Permission for scheduler api
"""

from rest_framework import permissions


class IsAuthenticatedAndOwnerOrReadOnly(permissions.BasePermission):
    """
    Check if the user is authenticated for
    creating new instance
    and is the owner of the instance for updating and deleting it
    If the user is not authenticated, only grant Read access
    """

    message = "Need to be authenticated to create and be the owner to change content"

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            # Need to be authenticated for write access
            return not request.user.is_anonymous

    def has_object_permission(self, request, view, obj):
        """
        Allow GET the detail object
        :param request:
        :param view:
        :param obj:
        :return:
        """
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.owner == request.user


class QuestionViewSetPermission(IsAuthenticatedAndOwnerOrReadOnly):
    """
    Check if the request to question viewset is appropriate
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.created_by == request.user


class NoteViewSetPermission(IsAuthenticatedAndOwnerOrReadOnly):
    """
    Check if the request to note viewset is appropriate
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.created_by == request.user


class PostViewSetPermission(IsAuthenticatedAndOwnerOrReadOnly):
    """
    Check if the request to post viewset is appropriate
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.poster == request.user


class PostAnswerViewSetPermission(IsAuthenticatedAndOwnerOrReadOnly):
    """
    Check if the request to question viewset is appropriate
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.postee == request.user


class ScheduleViewSetPermission(IsAuthenticatedAndOwnerOrReadOnly):
    """
    Check if the request to schedule viewset is appropriate
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.user == request.user
