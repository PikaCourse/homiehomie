from rest_framework import serializers
from homiehomie.scheduler.models import Course


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('major', 'name', 'description')