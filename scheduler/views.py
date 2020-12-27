from django.shortcuts import render, get_list_or_404, get_object_or_404
from django.db.models import Model
from scheduler.models import *
from scheduler.forms import *
from scheduler.serializers import *
from scheduler.utils import *
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser, FormParser

from datetime import datetime

# Create your views here.
# TODO Add isOwnerOrReadOnly Permission

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
                limit = int(limit)
                if limit <= 0:
                    raise ValueError
                queryset = queryset[0:int(limit)]
            except ValueError as err:
                raise InvalidQueryValue()
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
                limit = int(limit)
                if limit <= 0:
                    raise ValueError
                queryset = queryset[0:int(limit)]
            except ValueError as err:
                raise InvalidQueryValue()
        else:
            queryset = queryset[:200]

        serializer = CourseSerializer(queryset, many=True)
        return Response(serializer.data)


class QuestionViewSet(viewsets.ModelViewSet):
    query_parameters = ["courseid", "sortby", "descending", "limit"]
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    parser_classes = [FormParser]
    http_method_names = ['get', 'post', 'head', 'put', 'delete']

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
                limit = int(limit)
                if limit <= 0:
                    raise ValueError
                queryset = queryset[0:int(limit)]
            except ValueError as err:
                raise InvalidQueryValue()
        else:
            queryset = queryset[:50]

        serializer = QuestionSerializer(queryset, many=True)
        return Response(serializer.data)

    # POST method to create a question related to a course
    # TODO Consider mixin? refer to django rest framework ModelViewset API
    def create(self, request, *args, **kwargs):
        question = request.data
        f = QuestionCreationForm(question, request=request)
        if f.is_valid():
            question = f.save(debug=True)
            error_pack = {"code": 'success', "detail": "successfully created question",
                          "status": status.HTTP_201_CREATED, "question": question.id}
            return Response(error_pack, status=status.HTTP_201_CREATED)
        raise InvalidFormKey()

    # PUT method used to update existing question
    # TODO Add permission control to allow only owner or admin to modify
    def update(self, request, pk=None, *args, **kwargs):
        # TODO Verify the user is the owner
        question = request.data
        try:
            old_question = Question.objects.get(id=pk)

            # Update question
            f = QuestionModificationForm(question, instance=old_question)
            if f.is_valid():
                question = f.save()
                error_pack = {"errcode": 0, "errmsg": "successfully updated question", "question": question.id}
                return Response(error_pack, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            # Invalid question id
            raise NotFound()
        raise InvalidFormKey()


class NoteViewSet(viewsets.ModelViewSet):
    query_parameters = ["courseid", "questionid", "sortby", "descending", "limit"]

    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    http_method_names = ['get', 'post', 'head', 'put', 'delete']

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
                limit = int(limit)
                if limit <= 0:
                    raise ValueError
                queryset = queryset[0:int(limit)]
            except ValueError as err:
                raise InvalidQueryValue()
        else:
            queryset = queryset[:50]

        serializer = NoteSerializer(queryset, many=True)
        return Response(serializer.data)

    # POST method to create a question related to a course
    # TODO Use django form?
    # TODO Consider mixin? refer to django rest framework ModelViewset API
    def create(self, request, *args, **kwargs):
        note = request.data
        f = NoteCreationForm(note, request=request)
        if f.is_valid():
            note = f.save(debug=True)
            error_pack = {"code": 'success', "detail": "successfully created note",
                          "status": status.HTTP_201_CREATED, "note": note.id}
            return Response(error_pack, status=status.HTTP_201_CREATED)
        raise InvalidFormKey()

    # PUT method used to update existing question
    def update(self, request, pk=None, *args, **kwargs):
        # TODO Verify the user is the owner
        note = request.data
        try:
            old_note = Note.objects.get(id=pk)

            # Update note
            f = NoteModificationForm(note, instance=old_note)
            if f.is_valid():
                note = f.save()
                error_pack = {"code": "success", "detail": "successfully updated note",
                              "note": note.id, "status": status.HTTP_200_OK}
                return Response(error_pack, status=status.HTTP_200_OK)
        except Note.DoesNotExist:
            # Invalid note id
            raise NotFound()
        raise InvalidFormKey()


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for retrieving list of posts related to a course
    or to retrieve post answer under a post
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    http_method_names = ['get', 'post', 'head', 'put', 'delete']

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

    # POST method to create a post related to a course
    # TODO Use django form?
    # TODO Consider mixin? refer to django rest framework ModelViewset API
    def create(self, request, *args, **kwargs):
        post = request.data
        f = PostCreationForm(post, request=request)
        if f.is_valid():
            post = f.save(debug=True)
            error_pack = {"code": "success", "errmsg": "successfully created post",
                          "post": post.id, "status": status.HTTP_201_CREATED}
            return Response(error_pack, status=status.HTTP_201_CREATED)
        raise InvalidFormKey()

    # PUT method used to update existing question
    def update(self, request, pk=None, *args, **kwargs):
        # TODO Verify the user is the owner
        post = request.data
        try:
            old_post = Post.objects.get(id=pk)

            # Update note
            f = PostModificationForm(post, instance=old_post)
            if f.is_valid():
                post = f.save()
                error_pack = {"errcode": 0, "errmsg": "successfully updated post", "post": post.id}
                return Response(error_pack, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            # Invalid note id
            raise NotFound()
        raise InvalidFormKey()

    @action(detail=True, methods=['get'])
    def answers(self, request, pk=None):
        queryset = PostAnswer.objects.all()
        post_answers = get_list_or_404(queryset, post_id=pk)
        serializer = PostAnswerSerializer(post_answers, many=True)
        return Response(serializer.data)

    @answers.mapping.post
    def create_answer(self, request, pk=None):
        answer = request.data

        try:
            # Set post id from path param
            post = Post.objects.get(id=pk)
            f = PostAnswerCreationForm(answer, request=request, post=post)
            if f.is_valid():
                answer = f.save(debug=True)
                error_pack = {"errcode": 0, "errmsg": "successfully created post answer", "answer": answer.id}
                return Response(error_pack, status=status.HTTP_201_CREATED)
        except Post.DoesNotExist:
            # Invalid post id path
            raise NotFound()
        raise InvalidFormKey()

    @action(detail=True, methods=['get'], url_path="answers/(?P<answerid>\d+)")
    def detail_answer(self, request, pk=None, answerid=None):
        queryset = PostAnswer.objects.all()
        post_answer = get_object_or_404(queryset, id=answerid)
        serializer = PostAnswerSerializer(post_answer, many=False)
        return Response(serializer.data)

    @detail_answer.mapping.put
    def modify_answer(self, request, pk=None, answerid=None):
        answer = request.data
        try:
            old_answer = PostAnswer.objects.get(id=answerid)

            # Check post answer and the post is linked
            if eval(pk) != old_answer.post_id:
                raise ValidationError("mismatch between given post id and answer post id",
                                      code="mismatch")
            # Update post answer
            f = PostAnswerModificationForm(answer, instance=old_answer)
            if f.is_valid():
                answer = f.save()
                post = Post.objects.get(id=pk)
                post.last_answered = answer.last_edited
                post.save()
                error_pack = {"errcode": 0, "errmsg": "successfully modified post answer", "answer": answer.id}
                return Response(error_pack, status=status.HTTP_200_OK)

        except Post.DoesNotExist:
            # Invalid post id
            raise NotFound()
        except PostAnswer.DoesNotExist:
            # Invalid question answer id
            raise NotFound()
        # Invalid form key
        raise InvalidFormKey()

    @detail_answer.mapping.delete
    def destroy_answer(self, request, pk=None, answerid=None):
        answer = request.data
        try:
            old_answer = PostAnswer.objects.get(id=answerid)

            # Check post answer and the post is linked
            if eval(pk) != old_answer.post_id:
                raise ValidationError("mismatch between given post id and answer post id",
                                      code="mismatch")
            # Delete post answer
            old_answer.delete()
            error_pack = {"code": "success", "detail": "successfully deleted post answer",
                          "answer": answer.id, "status": status.HTTP_200_OK}
            return Response(error_pack, status=status.HTTP_200_OK)
        except PostAnswer.DoesNotExist:
            # Invalid question answer id
            raise NotFound()

        # Invalid form key
        raise InvalidFormKey()


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    http_method_names = ['get', 'post', 'head', 'put']
