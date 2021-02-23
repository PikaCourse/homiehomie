"""
filename:    routing.py
created at:  02/5/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Root routing file for Channels
"""

from django.urls import re_path, include
from channels.routing import URLRouter
import chat.routing
import user.routing

websocket_urlpatterns = [
    re_path('ws/chat/', URLRouter(chat.routing.websocket_urlpatterns)),
    re_path('ws/user/', URLRouter(user.routing.websocket_urlpatterns)),
]
