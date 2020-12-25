from django.test import TestCase
from django.shortcuts import reverse
from rest_framework.test import APITestCase
from scheduler.models import *

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
class CourseMetaViewSetTests(APITestCase):
    """
    Viewset testcase for CourseMetaViewSet
    """
    """
    Begin valid view testing
    Support list and retrieve (GET)
    """
    # ListView testing
    def test_get_empty_course_meta_list(self):
        """
        If no instance in db, should expect an empty array of course meta
        :return:
        """
        response = self.client.get(reverse("api:coursemeta-list"))
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(response.data, [])

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
