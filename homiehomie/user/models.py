from django.db import models
from django.contrib.auth.models import User


# TODO Add API KEY field?
class Student(models.Model):
    """
    Student User

    user:       User mapping
    school:     Student's School
    major:      Student's Primary major
    majors:     Student's Other Majors list
    minors:     Student's Minors list
    graduation: Student's expected graduation
    birthday:   Student's Birthday
    sex:        Student's sex/gender
    type:       Student's Type: freshman, sophomore, junior, senior, graduate
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    school = models.CharField(max_length=100)
    major = models.CharField(max_length=100)
    majors = models.JSONField(default=list, blank=True, null=True)
    minors = models.JSONField(default=list, blank=True, null=True)
    graduation = models.DateField(blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    sex = models.CharField(max_length=20)
    type = models.CharField(max_length=10)
