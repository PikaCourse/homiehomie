from django.db import models
from django.contrib.auth.models import User


class SiteUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    school = models.CharField(max_length=100)
    majors = models.JSONField(default=list, blank=True, null=True)
    minors = models.JSONField(default=list, blank=True, null=True)
    expected_graduation = models.DateField(blank=True, null=True)
    age = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    sex = models.CharField(max_length=20)
    # TODO