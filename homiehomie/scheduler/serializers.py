from rest_framework import serializers
from homiehomie.scheduler.models import Course


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('major', 'name', 'department', 'crn', 'time', 'school','professor', 'year', 'semester', 'description', 'tags', 'schedule')