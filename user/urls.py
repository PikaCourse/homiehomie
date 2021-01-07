from django.urls import path, include
from user import views, routers

router = routers.UserRouter()
router.register(r'users', views.UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls), name='api')
]

# TODO Create a util to handle shared app_name?
app_name = 'api'
