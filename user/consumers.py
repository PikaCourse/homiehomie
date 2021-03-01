"""
filename:    consumers.py
created at:  02/14/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Consumer for user async API
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone

from user.models import Student
from user.serializers import *


class UserNotificationConsumer(AsyncWebsocketConsumer):
    """
    User notification websocket handler, does the following:
    1. Join a channel group if user is logged in
    2. Handle disconnect event to logout user
    """
    async def connect(self):
        # Get user info from Django session
        self.user = self.scope["user"]
        # If user is anonymous, reject the connection since it is no use
        if self.user.is_anonymous:
            await self.close(code=4000)
            # self.room_group_name = f"notification_test_admin"
            # await self.channel_layer.group_add(
            #     self.room_group_name,
            #     self.channel_name
            # )
            # await self.accept()
        else:
            self.room_group_name = f"notification_{self.user.username}"
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Handle notification received
    async def send_notification(self, payload):
        notification = payload["notification"]
        await self.send(text_data=json.dumps(notification))
