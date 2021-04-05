"""
filename:    models.py
created at:  02/6/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Data models for chat
"""

import uuid
from django.db import models
from user.models import Student
from scheduler.models import CourseMeta

# Create your models here.


# TODO DB backend switched to Redis for performance improvement when the db is larged?
class ChatRoom(models.Model):
    """
    ChatRoom data model
    Fully describe either a group chat or DM session

    name:           The display name of the group chat
    group_name:     The channel layer room group, should be unique and unchanged, used internally
    created_at:     The time this chat room is created
    last_active:    The time this chat room is active
    is_private:     Whether this chat room can be searched
    is_DM:          Whether this chat room is a direct message room
    admin:          The top admin of the chat room, usually the creator
    supervisors:    Supporting admins
    participants:   Users in this chat room
    meta:           Custom setting for frontend if necessary
    """
    name = models.CharField(max_length=140)
    group_name = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(auto_now=True)
    is_private = models.BooleanField(default=False)
    is_DM = models.BooleanField(default=False)
    admin = models.ForeignKey(Student, on_delete=models.SET(Student.get_tester_user))
    supervisors = models.ManyToManyField(Student, blank=True, related_name="chat_room_supervisors")
    participants = models.ManyToManyField(Student, blank=True, related_name="chat_room_participants")
    meta = models.JSONField(default=dict)

    def join_chat(self, student):
        # add student to chat as participant
        self.participants.add(student)
        self.save()

    def leave_chat(self, student):
        # remove a student from chat
        if self.participants.filter(id=student.id):
            self.participants.remove(student)
            self.save()


class ChatMessage(models.Model):
    """
    ChatMessage data model

    created_at:         Time and date this message is created/received in server
    is_anonymous:       Is the sender prefer to send this in anonymous mode
    user:               User who send the message, could be anonymous user (i.e. not authenticated)
    chat_room:          Chat room of this message
    message:            Actual message content, defined by frontend
    """
    created_at = models.DateTimeField(auto_now_add=True)
    is_anonymous = models.BooleanField(default=False)
    user = models.ForeignKey(Student, on_delete=models.SET(Student.get_sentinel_user))
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, default=-1)
    message = models.JSONField(default=dict)
