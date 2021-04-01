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


class ChatRoomSerializer(serializers.ModelSerializer):
    """
    Serializer for chat room
    """

    class Meta:
        model = ChatRoom
        exclude = ("group_name", )
        read_only_fields = ("id", "created_at",
                            "last_active", "is_DM",
                            "admin", "supervisors",
                            "participants")

    def create(self, validated_data):
        """
        Create a instance based on the validated data
        :param validated_data:
        :return:
        """
        # Get user info from context
        # default admin is who created it
        user = self.context["request"].user

        validated_data["admin"] = user.student
        validated_data["participants"] = [user.student]
        return super().create(validated_data)


class ChatMessageSerializer(serializers.ModelSerializer):
    """
    Used for saving chat messages and loading history chats
    """
    chat_room = ChatRoomSerializer()
    user = UserChatSerializer()

    class Meta:
        model = ChatMessage
        fields = ('id', 'user', 'chat_room', 'message',)
        read_only_fields = ('id', 'user', 'chat_room',)

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
        chat_room = self.context["chat_room"]

        validated_data["user"] = user
        validated_data["chat_room"] = chat_room
        return super().create(validated_data)

