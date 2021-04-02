"""
filename:    consumers.py
created at:  02/5/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Consumer handler for real time chat 
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone

from scheduler.models import CourseMeta
from chat.models import ChatRoom
from chat.serializers import *
from copy import deepcopy
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    """
    Chat websocket handler, does the following:
    1. Handle incoming ws connection request and assign group for it
    2. Handle ws disconnect event to clean up
    3. Receiving incoming message and broadcast to all other ws connections in the same group/course
    """
    async def connect(self):
        # Get user info from Django session
        self.user = self.scope["user"]
        # Assign the db anonymous user if the request is anonymous
        # Also convert from Django User to our own Student instance
        if self.user.is_anonymous:
            self.user = await database_sync_to_async(Student.get_anonymous_user)()
        else:
            self.user = await database_sync_to_async(Student.objects.get)(user__id=self.user.id)
        self.user_data = await self.get_user_data()

        # Get course meta info from path
        room_id = self.scope['url_route']['kwargs']['room_id']
        self.room = await self.get_room(room_id)
        if self.room is None:
            # Invalid course meta id, reject
            await self.close(code=4001)
        else:
            self.room_data = await self.get_room_data()
            self.room_group_name = self.room_data['group_name']

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()

    @database_sync_to_async
    def get_user_data(self):
        tmp = UserChatSerializer(self.user)
        return tmp.data

    @database_sync_to_async
    def get_room(self, room_id):
        try:
            obj = ChatRoom.objects.get(id=room_id)
        except ChatRoom.DoesNotExist:
            obj = None
        return obj

    @sync_to_async
    def get_room_data(self):
        tmp = ChatRoomSerializer(self.room)
        return tmp.data

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        # Inject sender and course info into message field
        message = json.loads(text_data)
        message["meta"] = self.room_data
        message["user"] = self.user_data
        # Override message timestamp
        message["message"]["timestamp"] = timezone.now().isoformat()

        # TODO How to handle millions of messages?
        # Save the message for history query and get the message id
        message["id"] = await self.save_message_to_db(message)

        # Add sender channel info in case the user is anonymous
        message["sender_channel"] = self.channel_name

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    @database_sync_to_async
    def save_message_to_db(self, message):
        """
        Save a message to db with given sender and course meta info
        :param message: message to be saved
        :return:
        """
        message = ChatMessageSerializer(data=message,
                                        context={"user": self.user,
                                                 "chat_room": self.room})
        if message.is_valid(raise_exception=False):
            instance = message.save()
            return instance.id
        else:
            # TODO Error handling?
            return -1

    # Receive message from room group
    async def chat_message(self, event):
        # Make a copy of the object to change the return message
        # for individual sender
        message = deepcopy(event['message'])

        # Determine if the receiver is the sender
        # If user is anonymous, use channel name as identifier
        # else use user id
        if message["user"]["username"] == "anonymous":
            if self.channel_name == message["sender_channel"]:
                message["sender"] = True
            else:
                message["sender"] = False
        else:
            if self.user.id == message["user"]["id"]:
                message["sender"] = True
            else:
                message["sender"] = False

        message.pop("sender_channel")

        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))
