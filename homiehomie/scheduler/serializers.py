from rest_framework import serializers
from homiehomie.scheduler.models import *

# TODO Restrict update method


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [field.name for field in model._meta.fields]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [field.name for field in model._meta.fields]


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = [field.name for field in model._meta.fields]


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [field.name for field in model._meta.fields]


class PostAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAnswer
        fields = [field.name for field in model._meta.fields]


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAnswer
        fields = [field.name for field in model._meta.fields]
