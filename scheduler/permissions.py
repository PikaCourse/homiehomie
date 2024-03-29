"""
filename:    permissions.py
created at:  01/9/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Permission for scheduler api
"""

from rest_framework import permissions

# TODO Restructure permission code here


class ReadOnly(permissions.BasePermission):
    """
    Read only permission for course and course meta
    """
    message = "This is read only"
    code = "read_only"

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return False


class IsVerifiedOrReadOnly(permissions.BasePermission):
    """
    Check if the user has verified the email, otherwise
    only grant read permissions to the view
    """
    message = "Please verified your email to perform this action"

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            # Need to be verified for write access
            return request.user.student.is_verified


# TODO Break into IsAuthenticatedOrReadOnly and IsOwnerOrReadOnly
class IsAuthenticatedAndOwnerOrReadOnly(permissions.BasePermission):
    """
    Check if the user is authenticated for
    creating new instance
    and is the owner of the instance for updating and deleting it
    If the user is not authenticated, only grant Read access
    """

    # TODO Separate this using python functools.partial to apply to different view method
    #  https://stackoverflow.com/questions/23716855/django-rest-framework-custom-permissions-per-view
    #  or
    #  https://www.django-rest-framework.org/api-guide/viewsets/#introspecting-viewset-actions
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
            return obj.user == request.user


class IsOwnerOrWriteOnly(permissions.BasePermission):
    """
    Check if the user is the owner of the instance for listing, retrieving, updating and deleting it
    Else user can only post
    """
    message = "Need to be the owner to perform the operation"

    def has_object_permission(self, request, view, obj):
        """
        :param request:
        :param view:
        :param obj:
        :return:
        """
        return obj.user == request.user


class QuestionViewSetPermission(IsAuthenticatedAndOwnerOrReadOnly):
    """
    Check if the request to question viewset is appropriate
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.created_by.user == request.user


class NoteViewSetPermission(IsAuthenticatedAndOwnerOrReadOnly):
    """
    Check if the request to note viewset is appropriate
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.created_by.user == request.user


class PostViewSetPermission(IsAuthenticatedAndOwnerOrReadOnly):
    """
    Check if the request to post viewset is appropriate
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.poster.user == request.user


class PostAnswerViewSetPermission(IsAuthenticatedAndOwnerOrReadOnly):
    """
    Check if the request to question viewset is appropriate
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.postee.user == request.user


class ScheduleViewSetPermission(IsOwnerOrWriteOnly):
    """
    Check if the user is the owner of the instance for listing, retrieving, updating and deleting it
    Else user can only post
    """
    message = "Need to be the owner to perform the operation"

    def has_object_permission(self, request, view, obj):
        """
        If the is_private is true, check if the user own the oject
        else just return it
        :param request:
        :param view:
        :param obj:
        :return:
        """
        return obj.student.user == request.user or not obj.is_private


class WishListViewSetPermission(IsOwnerOrWriteOnly):
    """
    Check if the user is the owner of the instance for listing, retrieving, updating and deleting it
    Else user can only post
    """
    message = "Need to be the owner to perform the operation"

    def has_object_permission(self, request, view, obj):
        """
        :param request:
        :param view:
        :param obj:
        :return:
        """
        return obj.student.user == request.user
