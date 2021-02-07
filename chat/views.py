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
from chat.serializers import CourseChatMessageSerializer
from chat.models import CourseChatMessage
from chat.paginations import ChatHistoryPagination


# TODO The following two handlers are only for testing purposes and will 
#   remove in release
def index(request):
    return render(request, 'chat/index.html')


def room(request, course_meta_id):
    return render(request, 'chat/room.html', {
        'room_name': course_meta_id
    })


# /api/chat/coursemeta/<course_meta_id>
class CourseChatMessageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CourseChatMessageSerializer

    # TODO Do we need to only allow authenticated user to get history message?
    # permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]
    queryset = CourseChatMessage.objects.all()

    # Pagination control, default 50 messages per page
    pagination_class = ChatHistoryPagination

    def get_queryset(self):
        # Make sure user only see chat message under the specified course
        coursemeta_id = self.kwargs["coursemeta_id"]
        return CourseChatMessage.objects.filter(
            course_meta_id=coursemeta_id).order_by("-created_at")
