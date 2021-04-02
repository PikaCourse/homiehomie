"""
filename:    routing.py
created at:  02/5/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Routing for chat consumers
"""

from django.urls import re_path

from chat.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'room/(?P<room_id>\d+)$', ChatConsumer.as_asgi()),
]
