from django.shortcuts import render, get_list_or_404
from homiehomie.scheduler.models import *
from homiehomie.scheduler.serializers import *
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser, FormParser

# Create your views here.


def scheduler(request):
    return render(request, 'templates/base.html', {})


"""
API Definition below
"""


class CourseMetaViewSet(viewsets.ReadOnlyModelViewSet):
    query_parameters = ["school", "major", "limit"]
    queryset = CourseMeta.objects.all()
    serializer_class = CourseMetaSerializer

    def list(self, request, *args, **kwargs):
        queryset = CourseMeta.objects.all()

        # TODO Better way?
        # TODO Query parameter Vaildation
        school      = self.request.query_params.get("school", None)
        college     = self.request.query_params.get("college", None)
        title       = self.request.query_params.get("title", None)
        name        = self.request.query_params.get("name", None)
        major       = self.request.query_params.get("major", None)
        limit       = self.request.query_params.get("limit", None)

        if school is not None:
            queryset = queryset.filter(school=school)
        if major is not None:
            queryset = queryset.filter(major=major)
        if name is not None:
            queryset = queryset.filter(name__contains=name)
        if college is not None:
            queryset = queryset.filter(college__contains=college)
        if title is not None:
            queryset = queryset.filter(title__startswith=title)
        if limit is not None:
            try:
                queryset = queryset[0:int(limit)]
            except ValueError as err:
                error_pack = {"errmsg": "invalid query param: limit"}
                return Response(error_pack, status=status.HTTP_400_BAD_REQUEST)
        else:
            queryset = queryset[:200]

        serializer = CourseMetaSerializer(queryset, many=True)
        return Response(serializer.data)


# TODO Support for tag serch
class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    query_parameters = ["school", "major", "year", "title",
                        "semester", "professor", "limit"]
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def list(self, request, *args, **kwargs):
        queryset = Course.objects.all()

        # TODO Better way?
        # TODO Query parameter Vaildation
        school      = self.request.query_params.get("school", None)
        title       = self.request.query_params.get("title", None)
        crn         = self.request.query_params.get("crn", None)
        major       = self.request.query_params.get("major", None)
        year        = self.request.query_params.get("year", None)
        semester    = self.request.query_params.get("semester", None)
        professor   = self.request.query_params.get("professor", None)
        tags        = self.request.query_params.get("tags", None)
        limit       = self.request.query_params.get("limit", None)

        if school is not None:
            queryset = queryset.filter(course_meta__school=school)
        if title is not None:
            queryset = queryset.filter(course_meta__title=title)
        if crn is not None:
            queryset = queryset.filter(crn__startswith=crn)
        if major is not None:
            queryset = queryset.filter(course_meta__major=major)
        if year is not None:
            queryset = queryset.filter(year=year)
        if semester is not None:
            queryset = queryset.filter(semester=semester)
        if professor is not None:
            queryset = queryset.filter(professor=professor)
        if limit is not None:
            try:
                queryset = queryset[0:int(limit)]
            except ValueError as err:
                error_pack = {"errmsg": "invalid query param: limit"}
                return Response(error_pack, status=status.HTTP_400_BAD_REQUEST)
        else:
            queryset = queryset[:200]

        serializer = CourseSerializer(queryset, many=True)
        return Response(serializer.data)


class QuestionViewSet(viewsets.ModelViewSet):
    query_parameters = ["courseid", "sortby", "descending", "limit"]
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    parser_classes = [FormParser]

    # TODO Tmp disable to ease debugging
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly, permissions.IsAdminUser]

    # GET method to get list of question related to the query
    def list(self, request, *args, **kwargs):
        queryset = Question.objects.all()

        # TODO Better way?
        # TODO Query parameter Validation according to API DOC
        coursemetaid    = self.request.query_params.get("coursemetaid", None)
        sortby          = self.request.query_params.get("sortby", None)
        descending      = self.request.query_params.get("descending", None)
        if descending is not None:
            if descending == "true":
                descending = True
            else:
                descending = False
        else:
            descending = True
        limit = self.request.query_params.get("limit", None)

        if coursemetaid is not None:
            queryset = queryset.filter(course_meta_id=coursemetaid)
        if sortby is not None:
            queryset = queryset.order_by(("-" if descending else "") + sortby)
        else:
            queryset = queryset.order_by(("-" if descending else "") + "like_count")
        if limit is not None:
            try:
                queryset = queryset[0:int(limit)]
            except ValueError as err:
                error_pack = {"errcode": 1000, "errmsg": "invalid query param: limit"}
                return Response(error_pack, status=status.HTTP_400_BAD_REQUEST)
        else:
            queryset = queryset[:50]

        serializer = QuestionSerializer(queryset, many=True)
        return Response(serializer.data)

    # Post method to create a question related to a course
    # TODO Use django form?
    def create(self, request, *args, **kwargs):
        question = request.data
        try:
            coursemetaid = question["coursemetaid"]
            title = question["title"]
            tags = question.get("tags", [])
            question = Question.objects.create(
                course_meta_id=coursemetaid,
                # TODO Remove this or 1 before release
                created_by_id=request.user.id or 1,
                title=title,
                tags=tags
            )
        except KeyError:
            # Invalid form key
            error_pack = {"errcode": 1000, "errmsg": "invalid form key"}
            return Response(error_pack, status=status.HTTP_400_BAD_REQUEST)
        question.save()
        error_pack = {"errcode": 0, "errmsg": ""}
        return Response(error_pack, status=status.HTTP_201_CREATED)





class NoteViewSet(viewsets.ModelViewSet):
    query_parameters = ["courseid", "questionid", "sortby", "descending", "limit"]

    queryset = Note.objects.all()
    serializer_class = NoteSerializer

    def list(self, request, *args, **kwargs):
        queryset = Note.objects.all()

        # TODO Better way?
        # TODO Query parameter Validation according to API DOC
        courseid    = self.request.query_params.get("courseid", None)
        questionid  = self.request.query_params.get("questionid", None)
        sortby      = self.request.query_params.get("sortby", None)
        descending  = self.request.query_params.get("descending", None)
        if descending is not None:
            if descending == "true":
                descending = True
            else:
                descending = False
        else:
            descending = True
        limit = self.request.query_params.get("limit", None)

        if courseid is not None:
            queryset = queryset.filter(course_id=courseid)
        if questionid is not None:
            queryset = queryset.filter(question_id=questionid)
        if sortby is not None:
            queryset = queryset.order_by(("-" if descending else "") + sortby)
        else:
            queryset = queryset.order_by(("-" if descending else "") + "like_count")
        if limit is not None:
            try:
                queryset = queryset[0:int(limit)]
            except ValueError as err:
                error_pack = {"errmsg": "invalid query param: limit"}
                return Response(error_pack, status=status.HTTP_400_BAD_REQUEST)
        else:
            queryset = queryset[:50]

        serializer = NoteSerializer(queryset, many=True)
        return Response(serializer.data)


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for retrieving list of posts related to a course
    or to retrieve post answer under a post
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def list(self, request, *args, **kwargs):
        queryset = Post.objects.all()

        # TODO Better way?
        # TODO Query parameter Validation according to API DOC
        courseid    = self.request.query_params.get("courseid", None)
        userid      = self.request.query_params.get("userid", None)
        sortby      = self.request.query_params.get("sortby", None)
        descending  = self.request.query_params.get("descending", None)
        if descending is not None:
            if descending == "true":
                descending = True
            else:
                descending = False
        else:
            descending = True
        limit = self.request.query_params.get("limit", None)

        if courseid is not None:
            queryset = queryset.filter(course_id=courseid)
        if userid is not None:
            queryset = queryset.filter(user_id=userid)
        if sortby is not None:
            queryset = queryset.order_by(("-" if descending else "") + sortby)
        else:
            queryset = queryset.order_by(("-" if descending else "") + "like_count")
        if limit is not None:
            try:
                queryset = queryset[0:int(limit)]
            except ValueError as err:
                error_pack = {"errmsg": "invalid query param: limit"}
                return Response(error_pack, status=status.HTTP_400_BAD_REQUEST)
        else:
            queryset = queryset[:1000]

        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def answers(self, request, pk=None):
        queryset = PostAnswer.objects.all()
        post_answers = get_list_or_404(queryset, post_id=pk)
        serializer = PostAnswerSerializer(post_answers, many=True)
        return Response(serializer.data)


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
