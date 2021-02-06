from django.shortcuts import render


def index(request):
    return render(request, 'chat/index.html')


def room(request, course_meta_id):
    return render(request, 'chat/room.html', {
        'room_name': course_meta_id
    })
