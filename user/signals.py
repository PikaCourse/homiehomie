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
from chat.models import ChatMessage
from chat.serializers import ChatMessageSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import threading


class NotificationPostAnswerThread(threading.Thread):
    """
    Thread to start a notification on post answer
    """

    def __init__(self, instance, **kwargs):
        self.instance = instance
        super(NotificationPostAnswerThread, self).__init__(**kwargs)

    def run(self):
        instance = self.instance
        post_receiver = instance.post.poster
        content = PostAnswerSerializer(instance).data

        # Create notification in db
        Notification.objects.create(receiver=post_receiver, content=content)

        # Send out real-time notification to websocket if exist
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(f"notification_{post_receiver.user.username}",
                                                {"type": "send_notification", "notification": content})


# Create student instance upon new user and link with it
@receiver(post_save, sender=User)
def create_user_profile(sender, instance: User, created, raw, **kwargs):
    # Prevent creating instance upon loading fixtures, which is used for testing
    if created and not raw:
        Student.objects.create(user=instance)

# Create notification after a post answer is created under a post
@receiver(post_save, sender=PostAnswer)
def notify_on_new_postanswer(sender, instance: PostAnswer, created, **kwargs):
    # Use threading as signal is not asynchronous
    NotificationPostAnswerThread(instance).start()

# Create notification after a chat message
# TODO Need user to subscribe to a chat room for message notification
# @receiver(post_save, sender=CourseChatMessage)
# def notify_on_new_message(sender, instance: CourseChatMessage, created, **kwargs):
#     pass

