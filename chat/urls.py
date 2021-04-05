# chat/urls.py
from django.urls import path, include

from chat import views
from rest_framework import routers

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'room/(?P<room_id>[^/.]+)/message', views.ChatMessageViewSet, basename="chat-message")
router.register(r'room', views.ChatRoomViewSet, basename="chat-room")


urlpatterns = [
    path('chat/test/index', views.index, name='chat-test-index'),
    path('chat/test/room/<int:room_id>', views.room, name='chat-test-room'),
    path('chat/', include(router.urls), name='chat'),
]

app_name = 'chat'
