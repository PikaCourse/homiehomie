from django.urls import path
from scheduler import views

urlpatterns = [
    path('', views.scheduler, name='scheduler'),
    path('api/course/', views.CourseListCreate.as_view() )
]