"""
filename:    signals.py
created at:  02/28/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Signals for user subsystem
"""

from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from user.models import Student, Notification
from scheduler.models import PostAnswer
from scheduler.serializers import PostAnswerSerializer
from chat.models import CourseChatMessage
from chat.serializers import CourseChatMessageSerializer

# Create student instance upon new user and link with it
@receiver(post_save, sender=User)
def create_user_profile(sender, instance: User, created, raw, **kwargs):
    # Prevent creating instance upon loading fixtures, which is used for testing
    if created and not raw:
        Student.objects.create(user=instance)

# Create notification after a post answer is created under a post
@receiver(post_save, sender=PostAnswer)
def notify_on_new_postanswer(sender, instance: PostAnswer, created, **kwargs):
    post_receiver = instance.post.poster
    content = PostAnswerSerializer(instance).data
    Notification.objects.create(receiver=post_receiver, content=content)

# Create notification after a chat message
# TODO Need user to subscribe to a chat room for message notification
# @receiver(post_save, sender=CourseChatMessage)
# def notify_on_new_message(sender, instance: CourseChatMessage, created, **kwargs):
#     pass

