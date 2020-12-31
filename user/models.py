from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

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
    school = models.CharField(max_length=100, null=True)
    major = models.CharField(max_length=100, null=True)
    majors = models.JSONField(default=list, blank=True, null=True)
    minors = models.JSONField(default=list, blank=True, null=True)
    graduation = models.DateField(blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    sex = models.CharField(max_length=20, null=True)
    type = models.CharField(max_length=10, null=True)

    @classmethod
    def get_sentinel_user(cls):
        user = User.objects.get_or_create(username='deleted')[0]
        return Student.objects.get(user=user)

    @classmethod
    def get_tester_user(cls):
        tester = User.objects.get_or_create(username='tester')[0]
        return Student.objects.get(user=tester)

    def __str__(self):
        return self.user.username


# Create student instance upon new user and link with it
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, raw, **kwargs):
    # Prevent creating instance upon loading fixtures, which is used for testing
    if created and not raw:
        Student.objects.create(user=instance)