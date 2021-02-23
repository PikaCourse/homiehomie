"""
filename:    router.py
created at:  01/7/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Custom router to handle user url pattern
"""

from rest_framework.routers import Route, DynamicRoute, SimpleRouter


class UserRouter(SimpleRouter):
    """
    A router for user apis, order matters
    """
    routes = [
        # Default user get and update profile
        Route(
            url=r'^{prefix}{trailing_slash}$',
            mapping={'get': 'default_get'},
            name='{basename}-default',
            detail=False,
            initkwargs={'suffix': 'Default'}
        ),
        DynamicRoute(
            url=r'^{prefix}/{url_path}{trailing_slash}$',
            name='{basename}-{url_name}',
            detail=False,
            initkwargs={}
        ),
        # Specific user get and update
        Route(
            url=r'^{prefix}/{lookup}{trailing_slash}$',
            mapping={'get': 'retrieve',
                     'put': 'update',
                     'patch': 'partial_update'},
            name='{basename}-detail',
            detail=True,
            initkwargs={'suffix': 'Detail'}
        ),
        # Dynamic route for any additional method like password reset or change
        DynamicRoute(
            url=r'^{prefix}/{lookup}/{url_path}{trailing_slash}$',
            name='{basename}-{url_name}',
            detail=True,
            initkwargs={}
        ),
    ]
