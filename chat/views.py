"""
filename:    views.py
created at:  02/6/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        chat application http request handler
"""

from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser
from rest_framework.decorators import action
from rest_framework.response import Response
from chat.serializers import ChatMessageSerializer, ChatRoomSerializer
from chat.models import *
from chat.paginations import *


# TODO The following two handlers are only for testing purposes and will 
#   remove in release
def index(request):
    return render(request, 'chat/index.html')


def room(request, room_id):
    return render(request, 'chat/room.html', {
        'room_name': room_id
    })


# TODO Need if admin or supervisor to change the participants?
# TODO IsChatAdmin, IsChatSupervisor
# TODO add supervisor action
class ChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ChatRoomSerializer
    parser_classes = [JSONParser]
    queryset = ChatRoom.objects.all()
    permission_classes = [IsAuthenticated]

    # Pagination control, default 20 rooms per page
    pagination_class = ChatRoomPagination

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """
        Join a chat room as a participant
        :param request:
        :return:
        """
        student = request.user.student
        chatroom = self.get_object()
        chatroom.join_chat(student)
        error_pack = {"code": "success", "detail": f"successfully join chat room {chatroom.name}",
                      "chatroom": chatroom.id,  "status": status.HTTP_200_OK}
        return Response(error_pack)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        student = request.user.student
        chatroom = self.get_object()
        if chatroom.admin == student:
            error_pack = {"code": "unsupported", "detail": f"please transfer admin of chat room {chatroom.name}",
                          "chatroom": chatroom.id, "status": status.HTTP_400_BAD_REQUEST}
            return Response(error_pack)
        else:
            chatroom.leave_chat(student)
            error_pack = {"code": "success", "detail": f"successfully leave chat room {chatroom.name}",
                          "chatroom": chatroom.id, "status": status.HTTP_200_OK}
            return Response(error_pack)


# /api/chat/room/<room_id>/message
class ChatMessageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ChatMessageSerializer

    # TODO Do we need to only allow authenticated user to get history message?
    # permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]
    queryset = ChatMessage.objects.all()

    # Pagination control, default 50 messages per page
    pagination_class = ChatHistoryPagination

    def get_queryset(self):
        # Make sure user only see chat message under the specified course
        room_id = self.kwargs["room_id"]
        return ChatMessage.objects.filter(chat_room_id=room_id).order_by("-created_at")
