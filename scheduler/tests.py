from django.test import TestCase
from django.shortcuts import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from urllib.parse import urlencode
from scheduler.models import *
import json

# Create your tests here.


# Test model methods
# None have for now
class CourseMetaModelTests(APITestCase):
    pass


class CourseModelTests(APITestCase):
    pass


class QuestionModelTests(APITestCase):
    pass


class NoteModelTests(APITestCase):
    pass


class PostModelTests(APITestCase):
    pass


class PostAnswerModelTests(APITestCase):
    pass


# TODO Test view
# TODO Test API properly respond, use Django rest framework test class
class EmptyViewSetTests(APITestCase):
    """
    All tests here test when the database is empty
    """
    def test_empty_course_meta_list(self):
        """
        If no instance in db, should expect an empty array of course meta
        :return:
        """
        url = reverse("api:coursesmeta-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(response.data, [])

    def test_empty_course_meta_retrieve(self):
        """
        If no instance in db, should expect an empty array of course meta
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:coursesmeta-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': f'course meta not found'})

    def test_empty_course_list(self):
        """
        If no instance in db, should expect an empty array of course
        :return:
        """
        url = reverse("api:courses-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(response.data, [])

    def test_empty_course_retrieve(self):
        """
        If no instance in db, should expect 404
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:courses-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'course not found'})

    def test_empty_question_list(self):
        """
        If no instance in db, should expect an empty array of question
        :return:
        """
        url = reverse("api:questions-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(response.data, [])

    def test_empty_question_retrieve(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'question not found'})

    # TODO
    def test_empty_question_create_success(self):
        """
        Expect a 201 response
        First create a course meta object in db
        Then create a question related to it
        Then check whether the question has the expected fields
        :return:
        """
        # Create a course meta object in db
        course_meta = CourseMeta.objects.create(title="TEST 101",
                                  name="test course",
                                  school="Test University",)
        url = reverse("api:questions-list")
        response = self.client.post(url,
                                    data=urlencode({'course_meta': course_meta.id, 'title': 'Test question', 'tags': ['tags']}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, {'errcode': 0, 'errmsg': 'successfully created question', 'question': 1})

        # Assert model param match
        question = Question.objects.get(id=response.data['question'])
        self.assertEqual(question.course_meta_id, course_meta.id)
        self.assertEqual(question.title, 'Test question')


    def test_empty_question_create_missing_course_meta(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'question not found'})

    def test_empty_question_create_missing_title(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'question not found'})

    # TODO
    def test_empty_question_update(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'question not found'})

    def test_empty_question_partial_update(self):
        """
        Partial_update/PATCH not supported, should expect 405 method not allowed
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data, {'errcode': 5000, 'errmsg': 'method not allowed'})

    # TODO
    def test_empty_question_destroy(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'question not found'})

    def test_empty_note_list(self):
        """
        If no instance in db, should expect an empty array of note
        :return:
        """
        url = reverse("api:questions-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(response.data, [])

    def test_empty_note_retrieve(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'note not found'})

    def test_empty_post_list(self):
        """
        If no instance in db, should expect an empty array of post
        :return:
        """
        url = reverse("api:posts-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(response.data, [])

    def test_empty_post_retrieve(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'post not found'})

    def test_empty_post_answer_list(self):
        """
        If no instance in db, should expect 404 since post does not exist
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-answers", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'post not found'})

    def test_empty_post_answer_retrieve(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1, 'answerid': 1}
        url = reverse("api:posts-detail-answer", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'post not found'})


class CourseMetaViewSetTests(APITestCase):
    """
    Viewset testcase for CourseMetaViewSet
    """
    fixtures = ['test_coursemeta.json']

    """
    Begin valid view testing
    Support list and retrieve (GET)
    """
    # ListView testing


    # TODO Test return object format

    # TODO Test proper single filtering
    def test_get_course_meta_list_filter_by_school(self):
        """
        Prepopulated database with data and test if it can be search by school name
        :return:
        """

    # TODO Test proper multiple filter constraint

    # TODO Test improper: nonexisting filter search

    # TODO Test improper: filter fields constraint

    # DetailView/RetrieveView testing


    """
    Begin invalid view testing/invalid http method
    POST/PUT/DELETE should not be supported since course_meta only
    gets updated from db directly
    """
    # CreateView testing

    # UpdateView testing

    # PartialUpdateView testing

    # DestroyView testing



class CourseViewSetTests(APITestCase):
    """
    Viewset testcase for CourseViewSet
    """

    """
    Begin valid view testing
    Support list and retrieve (GET)
    """

    # ListView testing
    def test_get_empty_course_list(self):
        """
        If no instance in db, should expect an empty array of course info
        :return:
        """
        response = self.client.get(reverse("api:course-list"))
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(response.data, [])

    # TODO Test proper single filtering
    def test_get_course_list_filter_by_school(self):
        """
        Prepopulated database with data and test if it can be search by school name
        :return:
        """

    # TODO Test proper multiple filter constraint

    # TODO Test improper: nonexisting filter search

    # TODO Test improper: filter fields constraint

    # DetailView/RetrieveView testing

    """
    Begin invalid view testing/invalid http method
    POST/PUT/DELETE should not be supported since course only
    gets updated from db directly
    """
    # CreateView testing

    # UpdateView testing

    # PartialUpdateView testing

    # DestroyView testing


class QuestionViewSetTests(APITestCase):
    """
    Viewset testcase for QuestionViewSet
    """

    """
    Begin valid view testing
    Support list and retrieve (GET)
    """

    # ListView testing
    # TODO Test empty db

    # TODO Test proper return object structure

    # TODO Test proper single filtering

    # TODO Test proper multiple filter constraint

    # TODO Test improper: nonexisting filter search

    # TODO Test improper: filter fields constraint

    # DetailView/RetrieveView testing

    # TODO Rest of tests need to add permission check after introducing user
    # CreateView testing

    # UpdateView testing

    # DestroyView testing
    # Should be redirect to user instance called 'deleted'

    """
    Begin invalid view testing/invalid http method
    PATCH should not be supported since PUT is enough and to prevent
    django rest framework automatic method on ModelViewSet
    """
    # PartialUpdateView testing



class NoteViewSetTests(APITestCase):
    """
    Viewset testcase for NoteViewSet
    """

    """
    Begin valid view testing
    Support list and retrieve (GET)
    """

    # ListView testing
    # TODO Test empty db

    # TODO Test proper return object structure

    # TODO Test proper single filtering

    # TODO Test proper multiple filter constraint

    # TODO Test improper: nonexisting filter search

    # TODO Test improper: filter fields constraint

    # DetailView/RetrieveView testing

    # TODO Rest of tests need to add permission check after introducing user
    # CreateView testing

    # UpdateView testing

    # DestroyView testing

    """
    Begin invalid view testing/invalid http method
    PATCH should not be supported since PUT is enough and to prevent
    django rest framework automatic method on ModelViewSet
    """
    # PartialUpdateView testing


class PostViewSetTests(APITestCase):
    """
    Viewset testcase for PostViewSet
    """

    """
    Begin valid view testing
    Support list and retrieve (GET)
    """

    # ListView testing
    # TODO Test empty db

    # TODO Test proper return object structure

    # TODO Test proper single filtering

    # TODO Test proper multiple filter constraint

    # TODO Test improper: nonexisting filter search

    # TODO Test improper: filter fields constraint

    # DetailView/RetrieveView testing

    # TODO Rest of tests need to add permission check after introducing user
    # CreateView testing

    # UpdateView testing

    # DestroyView testing

    """
    Begin invalid view testing/invalid http method
    PATCH should not be supported since PUT is enough and to prevent
    django rest framework automatic method on ModelViewSet
    """
    # PartialUpdateView testing


class PostAnswerViewSetTests(APITestCase):
    """
    Viewset testcase for PostAnswerViewSet
    """

    """
    Begin valid view testing
    Support list and retrieve (GET)
    """

    # ListView testing
    # TODO Test empty db

    # TODO Test proper return object structure

    # TODO Test proper single filtering

    # TODO Test proper multiple filter constraint

    # TODO Test improper: nonexisting filter search

    # TODO Test improper: filter fields constraint

    # DetailView/RetrieveView testing

    # TODO Rest of tests need to add permission check after introducing user
    # CreateView testing

    # UpdateView testing

    # DestroyView testing

    """
    Begin invalid view testing/invalid http method
    PATCH should not be supported since PUT is enough and to prevent
    django rest framework automatic method on ModelViewSet
    """
    # PartialUpdateView testing


# TODO Test permission
