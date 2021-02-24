"""
filename:    routing.py
created at:  02/14/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:
"""

from django.urls import re_path

from user.consumers import UserNotificationConsumer

websocket_urlpatterns = [
    re_path(r'notification$', UserNotificationConsumer.as_asgi()),
]