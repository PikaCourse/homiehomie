from django.urls import path, include
from user import views, routers
from rest_framework.routers import SimpleRouter
# router = SimpleRouter(trailing_slash=False)

router = routers.UserRouter(trailing_slash=False)
router.register(r'users', views.UserLoginViewSet, basename='users')
router.register(r'users', views.UserManagementViewSet, basename='users')


urlpatterns = [
    path('', include(router.urls), name='login')
]

# TODO Create a util to handle shared app_name?
app_name = 'user'
