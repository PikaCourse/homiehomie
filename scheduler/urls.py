from django.urls import path, include
from rest_framework import routers
from scheduler import views

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'coursesmeta', views.CourseMetaViewSet, basename='coursesmeta')
router.register(r'courses', views.CourseViewSet, basename='courses')
router.register(r'questions', views.QuestionViewSet, basename='questions')
router.register(r'notes', views.NoteViewSet, basename='notes')
router.register(r'posts', views.PostViewSet, basename='posts')
router.register(r'posts/(?P<post_id>[^/.]+)/answers', views.PostAnswerViewSet, basename='postanswers')
router.register(r'schedules', views.ScheduleViewSet, basename='schedules')
router.register(r'wishlists', views.WishListViewSet, basename='wishlist')

urlpatterns = [
    path('', include(router.urls), name='api')
]

app_name = 'api'
