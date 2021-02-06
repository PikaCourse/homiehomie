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


class CourseMetaChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseMeta
        fields = ['id', 'title', 'school']
