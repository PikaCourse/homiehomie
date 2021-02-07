"""
filename:    serializers.py
created at:  02/6/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Serializer for coursemeta object used in CourseChatConsumer
"""

from rest_framework import serializers
from scheduler.models import *
from chat.models import *


class CourseMetaChatSerializer(serializers.ModelSerializer):
    """
    Serializer to serialize course meta info upon first ws connection
    Readonly
    """
    class Meta:
        model = CourseMeta
        fields = ('id', 'title', 'school',)
        read_only_fields = fields


class UserChatSerializer(serializers.ModelSerializer):
    """
    Serializer to serialize user info upon first ws connection
    Readonly
    """
    username = serializers.CharField(source="user.username")

    class Meta:
        model = Student
        # TODO Add avator url
        fields = ("id", "username",)
        read_only_fields = ("id", "username",)


class CourseChatMessageSerializer(serializers.ModelSerializer):
    """
    Used for saving chat messages and loading history chats
    """
    course_meta = CourseMetaChatSerializer()
    user = UserChatSerializer()

    class Meta:
        model = CourseChatMessage
        fields = ('id', 'user', 'course_meta', 'message',)
        read_only_fields = ('id', 'user', 'course_meta',)

    # TODO Define save() method to save incoming message
    def create(self, validated_data):
        """
        Create a instance based on the validated data
        :param validated_data:
        :return:
        """
        # Get user and course info from context
        # assuming that user is a valid user in db
        user = self.context["user"]
        course_meta = self.context["course_meta"]

        validated_data["user"] = user
        validated_data["course_meta"] = course_meta
        return super().create(validated_data)

