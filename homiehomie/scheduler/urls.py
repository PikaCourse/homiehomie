from django.urls import path
from homiehomie.scheduler import views

urlpatterns = [
    path('template/', views.scheduler, name='scheduler'),
    path('api/course/', views.CourseListCreate.as_view())
]