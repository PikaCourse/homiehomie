from django.shortcuts import render, get_list_or_404, get_object_or_404
from django.db.models import Model
from django.utils.decorators import method_decorator
from scheduler.models import *
from scheduler.forms import *
from scheduler.serializers import *
from scheduler.exceptions import *
from scheduler.permissions import *
from scheduler.permissions import ReadOnly
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.decorators import action
from rest_framework.decorators import permission_classes as rest_permission_classes
from rest_framework.parsers import JSONParser, FormParser
from datetime import datetime


"""
API Definition below
"""


class CourseMetaViewSet(viewsets.ReadOnlyModelViewSet):
    query_parameters = ["school", "major", "limit"]
    queryset = CourseMeta.objects.all()
    serializer_class = CourseMetaSerializer
    permission_classes = [ReadOnly]

    def list(self, request, *args, **kwargs):
        queryset = CourseMeta.objects.all()

        # TODO Better way?
        # TODO Query parameter Vaildation
        # TODO Consider using: https://www.django-rest-framework.org/api-guide/filtering/
        school      = self.request.query_params.get("school", None)
        college     = self.request.query_params.get("college", None)
        title       = self.request.query_params.get("title", None)
        name        = self.request.query_params.get("name", None)
        major       = self.request.query_params.get("major", None)
        limit       = self.request.query_params.get("limit", None)

        if school is not None:
            queryset = queryset.filter(school__istartswith=school)
        if major is not None:
            queryset = queryset.filter(major__istartswith=major)
        if name is not None:
            queryset = queryset.filter(name__icontains=name)
        if college is not None:
            queryset = queryset.filter(college__icontains=college)
        if title is not None:
            queryset = queryset.filter(title__icontains=title)

        # TODO Add support for other sorting?
        queryset = queryset.order_by("title")
        if limit is not None:
            try:
                limit = int(limit)
                if limit <= 0:
                    raise ValueError
                queryset = queryset[0:int(limit)]
            except ValueError as err:
                raise InvalidQueryValue()
        else:
            queryset = queryset[:20]
        serializer = CourseMetaSerializer(queryset, many=True)
        return Response(serializer.data)


# TODO Support for tag serch
class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    query_parameters = ["school", "major", "year", "title",
                        "semester", "professor", "limit"]
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [ReadOnly]

    def list(self, request, *args, **kwargs):
        queryset = Course.objects.all()

        # TODO Better way?
        # TODO Query parameter Validation with validator?
        school      = self.request.query_params.get("school", None)
        title       = self.request.query_params.get("title", None)
        name        = self.request.query_params.get("name", None)
        crn         = self.request.query_params.get("crn", None)
        major       = self.request.query_params.get("major", None)
        year        = self.request.query_params.get("year", None)
        semester    = self.request.query_params.get("semester", None)
        professor   = self.request.query_params.get("professor", None)
        tags        = self.request.query_params.get("tags", None)
        limit       = self.request.query_params.get("limit", None)

        if school is not None:
            queryset = queryset.filter(course_meta__school__istartswith=school)
        if title is not None:
            queryset = queryset.filter(course_meta__title__icontains=title)
        if name is not None:
            queryset = queryset.filter(course_meta__name__icontains=name)
        if crn is not None:
            queryset = queryset.filter(crn__istartswith=crn)
        if major is not None:
            queryset = queryset.filter(course_meta__major__istartswith=major)
        if year is not None:
            try:
                year = int(year)
                if year < 1970 or year > 2100:
                    raise ValueError
                queryset = queryset.filter(year=year)
            except ValueError:
                raise InvalidQueryValue()
        if semester is not None:
            queryset = queryset.filter(semester__iexact=semester)
        if professor is not None:
            queryset = queryset.filter(professor__istartswith=professor)

        # TODO Support other sorting?
        queryset = queryset.order_by("course_meta__title")
        if limit is not None:
            try:
                limit = int(limit)
                if limit <= 0:
                    raise ValueError
                queryset = queryset[0:int(limit)]
            except ValueError as err:
                raise InvalidQueryValue()
        else:
            queryset = queryset[:20]

        serializer = CourseSerializer(queryset, many=True)
        return Response(serializer.data)


class QuestionViewSet(viewsets.ModelViewSet):
    query_parameters = ["courseid", "sortby", "descending", "limit"]
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    parser_classes = [FormParser]
    http_method_names = ['get', 'post', 'head', 'put', 'delete']
    permission_classes = [QuestionViewSetPermission]

    # TODO Better way to valdiate query param
    # Supported fields for sortby option
    supported_sortby_options = ["like_count", "star_count", "dislike_count"]

    # GET method to get list of question related to the query
    def list(self, request, *args, **kwargs):
        queryset = Question.objects.all()

        # TODO Better way?
        # TODO Query parameter Validation according to API DOC
        coursemetaid    = self.request.query_params.get("coursemetaid", None)
        sortby          = self.request.query_params.get("sortby", None)
        descending      = self.request.query_params.get("descending", None)
        limit = self.request.query_params.get("limit", None)

        if descending is not None:
            if str(descending).lower() == "true":
                descending = True
            elif str(descending).lower() == "false":
                descending = False
            else:
                raise InvalidQueryValue()
        else:
            descending = True
        if coursemetaid is not None:
            try:
                queryset = queryset.filter(course_meta_id=coursemetaid)
            except ValueError:
                raise InvalidQueryValue()
        if sortby is not None:
            if sortby not in self.supported_sortby_options:
                raise InvalidQueryValue()
            queryset = queryset.order_by("-is_pin", "pin_order", ("-" if descending else "") + sortby, "-last_answered")
        else:
            queryset = queryset.order_by("-is_pin", "pin_order", ("-" if descending else "") + "like_count", "-last_answered")
        # Also sub order by created time, the newest is at top
        if limit is not None:
            try:
                limit = int(limit)
                if limit <= 0:
                    raise ValueError
                queryset = queryset[0:limit]
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
        raise InvalidForm()

    # PUT method used to update existing question
    def update(self, request, pk=None, *args, **kwargs):
        question = request.data

        # Get the object via DRF
        old_question = self.get_object()

        # Update question
        f = QuestionModificationForm(question, instance=old_question)
        if f.is_valid():
            question = f.save()
            error_pack = {"code": "success", "detail": "successfully updated question",
                          "question": question.id, "status": status.HTTP_200_OK}
            return Response(error_pack, status=status.HTTP_200_OK)
        raise InvalidForm()

    # Override existing delete method provided by DRF for customized return error packet
    def destroy(self, request, *args, **kwargs):
        question = self.get_object()
        self.perform_destroy(question)
        error_pack = {"code": "success", "detail": "successfully deleted question",
                      "question": question.id, "status": status.HTTP_200_OK}
        return Response(error_pack)


class NoteViewSet(viewsets.ModelViewSet):
    query_parameters = ["courseid", "questionid", "sortby", "descending", "limit"]

    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    parser_classes = [FormParser]
    http_method_names = ['get', 'post', 'head', 'put', 'delete']
    permission_classes = [NoteViewSetPermission]

    # TODO Better way to valdiate query param, use serializer
    # Supported fields for sortby option
    supported_sortby_options = ["like_count", "star_count", "dislike_count"]

    def list(self, request, *args, **kwargs):
        queryset = Note.objects.all()

        # TODO Better way?
        # TODO Query parameter Validation according to API DOC
        courseid    = self.request.query_params.get("courseid", None)
        questionid  = self.request.query_params.get("questionid", None)
        sortby      = self.request.query_params.get("sortby", None)
        descending  = self.request.query_params.get("descending", None)
        if descending is not None:
            if descending.lower() == "true":
                descending = True
            elif descending.lower() == "false":
                descending = False
            else:
                raise InvalidQueryValue()
        else:
            descending = True
        limit = self.request.query_params.get("limit", None)

        if courseid is not None:
            try:
                courseid = int(courseid)
            except ValueError:
                raise InvalidQueryValue()
            queryset = queryset.filter(course_id=courseid)
        if questionid is not None:
            try:
                questionid = int(questionid)
            except ValueError:
                raise InvalidQueryValue()
            queryset = queryset.filter(question_id=questionid)
        if sortby is not None:
            if sortby not in self.supported_sortby_options:
                raise InvalidQueryValue()
            queryset = queryset.order_by(("-" if descending else "") + sortby, "-last_edited")
        else:
            queryset = queryset.order_by(("-" if descending else "") + "like_count", "-last_edited")
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
            # Verify that the course and question point to same course meta
            course = f.cleaned_data["course"]
            question = f.cleaned_data["question"]
            if course.course_meta_id != question.course_meta_id:
                raise InvalidForm()
            else:
                note = f.save(debug=True)
                error_pack = {"code": 'success', "detail": "successfully created note",
                              "status": status.HTTP_201_CREATED, "note": note.id}
                return Response(error_pack, status=status.HTTP_201_CREATED)
        raise InvalidForm()

    # PUT method used to update existing question
    def update(self, request, pk=None, *args, **kwargs):
        # TODO Verify the user is the owner
        note = request.data
        old_note = self.get_object()

        # Update note
        f = NoteModificationForm(note, instance=old_note)
        if f.is_valid():
            note = f.save()
            error_pack = {"code": "success", "detail": "successfully updated note",
                          "note": note.id, "status": status.HTTP_200_OK}
            return Response(error_pack, status=status.HTTP_200_OK)
        raise InvalidForm()

    # Override existing delete method provided by DRF for customized return error packet
    def destroy(self, request, *args, **kwargs):
        note = self.get_object()
        self.perform_destroy(note)
        error_pack = {"code": "success", "detail": "successfully deleted note",
                      "note": note.id, "status": status.HTTP_200_OK}
        return Response(error_pack)


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for retrieving list of posts related to a course
    or to retrieve post answer under a post
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    parser_classes = [FormParser]
    http_method_names = ['get', 'post', 'head', 'put', 'delete']
    permission_classes = [PostViewSetPermission]

    # TODO Better way to valdiate query param
    # Supported fields for sortby option
    supported_sortby_options = ["like_count", "star_count", "dislike_count"]

    def list(self, request, *args, **kwargs):
        queryset = Post.objects.all()

        # TODO Better way?
        # TODO Query parameter Validation according to API DOC
        courseid    = self.request.query_params.get("courseid", None)
        userid      = self.request.query_params.get("userid", None)
        sortby      = self.request.query_params.get("sortby", None)
        descending  = self.request.query_params.get("descending", None)
        if descending is not None:
            if descending.lower() == "true":
                descending = True
            elif descending.lower() == "false":
                descending = False
            else:
                raise InvalidQueryValue()
        else:
            descending = True
        limit = self.request.query_params.get("limit", None)

        if courseid is not None:
            try:
                courseid = int(courseid)
                queryset = queryset.filter(course_id=courseid)
            except ValueError:
                raise InvalidQueryValue()
        if userid is not None:
            try:
                userid = int(userid)
                queryset = queryset.filter(poster__user_id=userid)
            except ValueError:
                raise InvalidQueryValue()
        if sortby is not None:
            if sortby not in self.supported_sortby_options:
                raise InvalidQueryValue()
            queryset = queryset.order_by(("-" if descending else "") + sortby)
        else:
            queryset = queryset.order_by(("-" if descending else "") + "like_count")
        if limit is not None:
            try:
                limit = int(limit)
                if limit <= 0:
                    raise ValueError
                queryset = queryset[0:limit]
            except ValueError as err:
                raise InvalidQueryValue()
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
        raise InvalidForm()

    # PUT method used to update existing question
    def update(self, request, pk=None, *args, **kwargs):
        # TODO Verify the user is the owner
        post = request.data
        old_post = self.get_object()

        # Update note
        f = PostModificationForm(post, instance=old_post)
        if f.is_valid():
            post = f.save()
            error_pack = {"code": "success", "detail": "successfully updated post",
                          "post": post.id, "status": status.HTTP_200_OK}
            return Response(error_pack, status=status.HTTP_200_OK)
        raise InvalidForm()

    # Override existing delete method provided by DRF for customized return error packet
    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        self.perform_destroy(post)
        error_pack = {"code": "success", "detail": "successfully deleted post",
                      "post": post.id, "status": status.HTTP_200_OK}
        return Response(error_pack)

    # TODO Check object permission manually?
    # TODO Make post answer a separate viewset
    @action(detail=True, methods=['get'])
    @method_decorator(rest_permission_classes([PostAnswerViewSetPermission]))
    def answers(self, request, pk=None):
        queryset = PostAnswer.objects.all()

        # Verify that post with id pk exist in db
        post = self.get_object()

        # Parse Params
        queryset = queryset.filter(post_id=pk)
        sortby = self.request.query_params.get("sortby", None)
        descending = self.request.query_params.get("descending", None)
        limit = self.request.query_params.get("limit", None)

        # TODO Better way to do the query params validation
        if descending is not None:
            if str(descending).lower() == "true":
                descending = True
            elif str(descending).lower() == "false":
                descending = False
            else:
                raise InvalidQueryValue()
        else:
            descending = True
        if sortby is not None:
            if sortby not in self.supported_sortby_options:
                raise InvalidQueryValue()
            queryset = queryset.order_by(("-" if descending else "") + sortby)
        else:
            queryset = queryset.order_by(("-" if descending else "") + "like_count")
        if limit is not None:
            try:
                limit = int(limit)
                if limit <= 0:
                    raise ValueError
                queryset = queryset[0:limit]
            except ValueError as err:
                raise InvalidQueryValue()
        else:
            queryset = queryset[:50]


        serializer = PostAnswerSerializer(queryset, many=True)
        return Response(serializer.data)

    @answers.mapping.post
    @method_decorator(rest_permission_classes([PostAnswerViewSetPermission]))
    def create_answer(self, request, pk=None):
        answer = request.data

        try:
            # Set post id from path param
            post = Post.objects.get(id=pk)
            f = PostAnswerCreationForm(answer, request=request, post=post)
            if f.is_valid():
                answer = f.save(debug=True)
                error_pack = {"code": "success", "detail": "successfully created post answer",
                              "post": post.id, "answer": answer.id, "status": status.HTTP_201_CREATED}
                return Response(error_pack, status=status.HTTP_201_CREATED)
        except Post.DoesNotExist:
            # Invalid post id path
            raise NotFound()
        raise InvalidForm()

    @action(detail=True, methods=['get'], url_path="answers/(?P<answerid>[^/.]+)")
    @method_decorator(rest_permission_classes([PostAnswerViewSetPermission]))
    def detail_answer(self, request, pk=None, answerid=None):
        # TODO Check for post id as well
        # TODO Verify that the post answer and post is related
        queryset = PostAnswer.objects.all()
        post_answer = get_object_or_404(queryset, id=answerid, post_id=pk)
        serializer = PostAnswerSerializer(post_answer, many=False)
        return Response(serializer.data)

    @detail_answer.mapping.put
    @method_decorator(rest_permission_classes([PostAnswerViewSetPermission]))
    def modify_answer(self, request, pk=None, answerid=None):
        answer = request.data
        try:
            # Cannot use self.get_object since it is not in PostAnswer viewset
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
                error_pack = {"code": "success", "detail": "successfully modified post answer",
                              "post": post.id, "answer": answer.id, "status": status.HTTP_200_OK}
                return Response(error_pack, status=status.HTTP_200_OK)

        except Post.DoesNotExist:
            # Invalid post id
            raise NotFound()
        except PostAnswer.DoesNotExist:
            # Invalid question answer id
            raise NotFound()
        except ValidationError:
            raise NotFound()
        # Invalid form key
        raise InvalidForm()

    @detail_answer.mapping.delete
    @method_decorator(rest_permission_classes([PostAnswerViewSetPermission]))
    def destroy_answer(self, request, pk=None, answerid=None):
        # No request body
        try:
            answerid = int(answerid)
            old_answer = PostAnswer.objects.get(id=answerid)
            post = self.get_object()

            # Check post answer and the post is linked
            if post.id != old_answer.post_id:
                raise ValidationError("mismatch between given post id and answer post id",
                                      code="mismatch")
            # Delete post answer
            old_answer.delete()
            error_pack = {"code": "success", "detail": "successfully deleted post answer",
                          "answer": answerid, "status": status.HTTP_200_OK}
            return Response(error_pack, status=status.HTTP_200_OK)
        except PostAnswer.DoesNotExist:
            # Invalid question answer id
            raise NotFound()
        except ValueError:
            raise NotFound()
        except ValidationError:
            raise NotFound()

        # Invalid form key
        raise InvalidForm()


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    http_method_names = ['get', 'post', 'head', 'put']
