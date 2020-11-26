from django.urls import path
from homiehomie.frontend import views

urlpatterns = [
    path('', views.index),
]