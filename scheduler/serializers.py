from rest_framework import serializers
from scheduler.models import *

# TODO Restrict update method


class CourseMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseMeta
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    # TODO Access CourseMeta info based on the id in Course
    class Meta:
        model = Course
        fields = '__all__'
        depth = 1


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class PostAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAnswer
        fields = '__all__'


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'
