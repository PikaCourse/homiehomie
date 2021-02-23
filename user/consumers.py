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
    1. Handle incoming ws connection request and assign group for it
    2. Handle ws disconnect event to clean up
    3. Receiving incoming message
    """
    pass
