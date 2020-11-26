from django.urls import path
from scheduler import views

urlpatterns = [
    path('', views.scheduler, name='scheduler'),
]