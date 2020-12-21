from django.urls import path, include
from django.contrib.auth.views import LoginView
from django.contrib.auth import authenticate

urlpatterns = [
    path('login/', LoginView.as_view(template_name="user/login.html"), name='login'),
    # path('', include('django.contrib.auth.urls')),
]