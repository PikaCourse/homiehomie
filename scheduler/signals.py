"""
filename:    signals.py
created at:  02/28/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Signals for scheduler
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from scheduler.models import Schedule, WishList
from user.models import Student

# Create a schedule after a student instance is created
@receiver(post_save, sender=Student)
def create_user_schedule(sender, instance, created, raw, **kwargs):
    # Prevent creating instance upon loading fixtures, which is used for testing
    if created and not raw:
        Schedule.objects.create(student=instance)

# Create a wishlist after a student instance is created
@receiver(post_save, sender=Student)
def create_user_wishlist(sender, instance, created, raw, **kwargs):
    # Prevent creating instance upon loading fixtures, which is used for testing
    if created and not raw:
        WishList.objects.create(student=instance)