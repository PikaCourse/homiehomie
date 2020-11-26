from django.shortcuts import render
from homiehomie.scheduler.models import Course
from homiehomie.scheduler.serializers import CourseSerializer
from rest_framework import generics

# Create your views here.
def scheduler(request):
    return render(request, 'templates/base.html', {})


class CourseListCreate(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
