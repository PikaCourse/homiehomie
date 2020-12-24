from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from homiehomie.user.models import *


class StudentSerializer(serializers.ModelSerializer):
    permission_classes = [IsAdminUser, IsAuthenticated]
    class Meta:
        model = Student
        fields = '__all__'
        exclude = []
        depth = 1
