"""
filename:    routing.py
created at:  02/5/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Routing for chat consumers
"""

from django.urls import re_path

from chat.consumers import CourseChatConsumer

websocket_urlpatterns = [
    re_path(r'coursemeta/(?P<course_meta_id>\d+)$', CourseChatConsumer.as_asgi()),
]
