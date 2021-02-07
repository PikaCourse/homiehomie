# chat/urls.py
from django.urls import path, include

from chat import views
from rest_framework import routers

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'coursemeta/(?P<coursemeta_id>[^/.]+)', views.CourseChatMessageViewSet, basename="coursechat")

urlpatterns = [
    path('chat/test/index', views.index, name='chat-test-index'),
    path('chat/test/coursemeta/<int:course_meta_id>', views.room, name='chat-test-room'),
    path('chat/', include(router.urls), name='chat'),
]

app_name = 'chat'
