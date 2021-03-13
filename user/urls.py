from django.urls import path, include
from user import views, routers
from rest_framework.routers import DefaultRouter
# router = SimpleRouter(trailing_slash=False)

user_router = routers.UserRouter(trailing_slash=False)
user_router.register(r'users', views.UserLoginViewSet, basename='users')
user_router.register(r'users', views.UserManagementViewSet, basename='users')

router = DefaultRouter(trailing_slash=False)
router.register(r'notifications', views.NotificationViewSet, basename='notifications')


urlpatterns = [
    path('', include(user_router.urls), name='login'),
    path('', include(router.urls), name='notification')
]

# TODO Create a util to handle shared app_name?
app_name = 'user'
