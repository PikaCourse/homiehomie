# chat/urls.py
from django.urls import path

from chat.views import index, room

urlpatterns = [
    path('index', index, name='index'),
    path('course/<int:course_meta_id>', room, name='room'),
]

app_name = 'chat'
