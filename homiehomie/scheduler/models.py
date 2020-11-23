from django.db import models

# Create your models here.
class Course(models.Model):
    major = models.CharField(max_length=100)
    name = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    