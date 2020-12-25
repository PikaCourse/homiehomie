from django.urls import path, include
from rest_framework import routers
from homiehomie.scheduler import views

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'coursesmeta', views.CourseMetaViewSet)
router.register(r'courses', views.CourseViewSet, basename='courses')
router.register(r'questions', views.QuestionViewSet, basename='questions')
router.register(r'notes', views.NoteViewSet)
router.register(r'posts', views.PostViewSet, basename='posts')

urlpatterns = [
    # path('templates/', views.scheduler, name='scheduler'),
    path('/', include(router.urls), name='api')
]

app_name = 'api'
