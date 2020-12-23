from django.urls import path, include
from homiehomie.user.views import *

urlpatterns = [
    path('login/',
         LoginView.as_view(template_name="user/login.html",
                           redirect_authenticated_user=True),
         name='login'),
    path('register/', RegisterUserView.as_view(), name='register'),
    # path('', include('django.contrib.auth.urls')),
    # path('', include(router.urls)),
]