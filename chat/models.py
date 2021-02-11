"""
filename:    models.py
created at:  02/6/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Data models for chat
"""


from django.db import models
from user.models import Student
from scheduler.models import CourseMeta

# Create your models here.


# TODO DB backend switched to Redis for performance improvement when the db is larged?
class CourseChatMessage(models.Model):
    """
    CourseChatMessage data model

    created_at:         Time and date this message is created/received in server
    is_anonymous:       Is the sender prefer to send this in anonymous mode
    user:               User who send the message, could be anonymous user (i.e. not authenticated)
    course_meta:        Course meta object this message relates to
    message:            Actual message content, defined by frontend
    """
    created_at = models.DateTimeField(auto_now_add=True)
    is_anonymous = models.BooleanField(default=False)
    user = models.ForeignKey(Student, on_delete=models.SET(Student.get_sentinel_user))
    course_meta = models.ForeignKey(CourseMeta, on_delete=models.CASCADE, default=-1)
    message = models.JSONField(default=dict)
