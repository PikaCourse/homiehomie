"""
Test cases testing again empty database view operations
"""
from django.shortcuts import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.exceptions import *
from scheduler.exceptions import *
from scheduler.test_utils import *
from urllib.parse import urlencode


class EmptyCourseMetaViewSetTests(APITestCase):
    """
    All tests here test when the database is empty
    """
    def test_course_meta_list(self):
        """
        If no instance in db, should expect an empty array of course meta
        :return:
        """
        url = reverse("api:coursesmeta-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(response.data, [])

    def test_course_meta_retrieve(self):
        """
        If no instance in db, should expect an empty array of course meta
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:coursesmeta-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    # CreateView testing
    def test_course_meta_create(self):
        """
        Create/POST not supported, should expect 405 method not allowed
        :return:
        """
        url = reverse("api:coursesmeta-list")
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data,
                         get_packet_details(MethodNotAllowed('POST')))

        # UpdateView testing

    def test_course_meta_update(self):
        """
        Update/PUT not supported, should expect 405 method not allowed
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:coursesmeta-detail", kwargs=params)
        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data,
                         get_packet_details(MethodNotAllowed('PUT')))

        # PartialUpdateView testing

    def test_course_meta_partial_update(self):
        """
        Update/PUT not supported, should expect 405 method not allowed
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:coursesmeta-detail", kwargs=params)
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data,
                         get_packet_details(MethodNotAllowed('PATCH')))

        # DestroyView testing

    def test_course_meta_destroy(self):
        """
        Update/PUT not supported, should expect 405 method not allowed
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:coursesmeta-detail", kwargs=params)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data,
                         get_packet_details(MethodNotAllowed('DELETE')))


class EmptyCourseViewSetTests(APITestCase):
    """
    All tests here test when the database is empty
    """
    def test_course_list(self):
        """
        If no instance in db, should expect an empty array of course
        :return:
        """
        url = reverse("api:courses-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(response.data, [])

    def test_course_retrieve(self):
        """
        If no instance in db, should expect 404
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:courses-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))


class EmptyQuestionViewSetTests(APITestCase):
    """
    All tests here test when the database is empty
    """
    def test_question_list(self):
        """
        If no instance in db, should expect an empty array of question
        :return:
        """
        url = reverse("api:questions-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(response.data, [])

    def test_question_retrieve(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    def test_question_create(self):
        """
        Expect a 400 response since no valid course meta id exists
        :return:
        """
        url = reverse("api:questions-list")
        response = self.client.post(url,
                                    data=urlencode({'course_meta': 1, 'title': 'Test question', 'tags': ['tags']}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_question_create_missing_course_meta(self):
        """
        Expect a 400 response due to invalid form key
        :return:
        """
        url = reverse("api:questions-list")
        response = self.client.post(url,
                                    data=urlencode({'title': 'Test question', 'tags': ['tags']}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_question_create_missing_title(self):
        """
        Expect a 400 response due to invalid form key
        :return:
        """
        url = reverse("api:questions-list")
        response = self.client.post(url,
                                    data=urlencode({'course_meta': 1, 'tags': ['tags']}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_question_update(self):
        """
        Since no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    def test_question_partial_update(self):
        """
        Partial_update/PATCH not supported, should expect 405 method not allowed
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data,
                         get_packet_details(MethodNotAllowed('PATCH')))

    def test_question_destroy(self):
        """
        Since no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))


class EmptyNoteViewSetTests(APITestCase):
    """
    All tests here test when the database is empty
    """
    def test_note_list(self):
        """
        If no instance in db, should expect an empty array of note
        :return:
        """
        url = reverse("api:notes-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(response.data, [])

    def test_note_retrieve(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:notes-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    def test_note_create(self):
        """
        Expect a 400 response since no valid course id or question id exists
        :return:
        """
        url = reverse("api:notes-list")
        response = self.client.post(url,
                                    data=urlencode({'course': 1, 'question': 1, 'title': 'Test note',
                                                    'content': 'Test content', 'tags': ['tags']}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_note_create_missing_course(self):
        """
        Expect a 400 response due to invalid form key
        :return:
        """
        url = reverse("api:notes-list")
        response = self.client.post(url,
                                    data=urlencode({'question': 1, 'title': 'Test note',
                                                    'content': 'Test content', 'tags': ['tags']}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_note_create_missing_question(self):
        """
        Expect a 400 response due to invalid form key
        :return:
        """
        url = reverse("api:notes-list")
        response = self.client.post(url,
                                    data=urlencode({'title': 'Test title', 'course': 1,
                                                    'content': 'Test content', 'tags': ['tags']}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_note_create_missing_title(self):
        """
        Expect a 400 response due to invalid form key
        :return:
        """
        url = reverse("api:notes-list")
        response = self.client.post(url,
                                    data=urlencode({'question': 1, 'course': 1,
                                                    'content': 'Test content', 'tags': ['tags']}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_note_create_missing_content(self):
        """
        Expect a 400 response due to invalid form key
        :return:
        """
        url = reverse("api:notes-list")
        response = self.client.post(url,
                                    data=urlencode({'question': 1, 'course': 1,
                                                    'title': 'Test title', 'tags': ['tags']}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_note_create_missing_tags(self):
        """
        Expect a 400 response due to invalid form key
        :return:
        """
        url = reverse("api:notes-list")
        response = self.client.post(url,
                                    data=urlencode({'question': 1, 'course': 1,
                                                    'content': 'Test content', 'title': 'Test title'}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_note_update(self):
        """
        Since no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:notes-detail", kwargs=params)
        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    def test_note_partial_update(self):
        """
        Partial_update/PATCH not supported, should expect 405 method not allowed
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:notes-detail", kwargs=params)
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data, get_packet_details(MethodNotAllowed('PATCH')))

    def test_note_destroy(self):
        """
        Since no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:notes-detail", kwargs=params)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))


class EmptyPostViewSetTests(APITestCase):
    """
    All tests here test when the database is empty
    """
    def test_post_list(self):
        """
        If no instance in db, should expect an empty array of post
        :return:
        """
        url = reverse("api:posts-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(response.data, [])

    def test_post_retrieve(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    def test_post_create(self):
        """
        Expect a 400 response since no valid course id exists
        :return:
        """
        url = reverse("api:posts-list")
        response = self.client.post(url,
                                    data=urlencode({'course': 1, 'title': 'Test post',
                                                    'content': 'Test content', 'tags': ['tags']}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_post_create_missing_course(self):
        """
        Expect a 400 response due to invalid form key
        :return:
        """
        url = reverse("api:posts-list")
        response = self.client.post(url,
                                    data=urlencode({'title': 'Test post',
                                                    'content': 'Test content', 'tags': ['tags']}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_post_create_missing_title(self):
        """
        Expect a 400 response due to invalid form key
        :return:
        """
        url = reverse("api:posts-list")
        response = self.client.post(url,
                                    data=urlencode({'course': 1,
                                                    'content': 'Test content', 'tags': ['tags']}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_post_create_missing_content(self):
        """
        Expect a 400 response due to invalid form key
        :return:
        """
        url = reverse("api:posts-list")
        response = self.client.post(url,
                                    data=urlencode({'course': 1,
                                                    'title': 'Test title', 'tags': ['tags']}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_post_create_missing_tags(self):
        """
        Expect a 400 response due to invalid form key
        :return:
        """
        url = reverse("api:posts-list")
        response = self.client.post(url,
                                    data=urlencode({'course': 1,
                                                    'content': 'Test content', 'title': 'Test title'}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidForm()))

    def test_post_update(self):
        """
        Since no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-detail", kwargs=params)
        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    def test_post_partial_update(self):
        """
        Partial_update/PATCH not supported, should expect 405 method not allowed
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-detail", kwargs=params)
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data, get_packet_details(MethodNotAllowed("PATCH")))

    def test_post_destroy(self):
        """
        Since no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:notes-detail", kwargs=params)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    def test_post_answer_list(self):
        """
        If no instance in db, should expect 404 since post does not exist
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-answers", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    def test_post_answer_retrieve(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1, 'answerid': 1}
        url = reverse("api:posts-detail-answer", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    def test_post_answer_create(self):
        """
        Expect a 404 response since no valid post id exists
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-answers", kwargs=params)
        response = self.client.post(url,
                                    data=urlencode({'content': 'Test content'}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    def test_post_answer_create_missing_content(self):
        """
        Expect a 404 response due to empty db
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-answers", kwargs=params)
        response = self.client.post(url,
                                    data=urlencode({}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    def test_post_answer_update(self):
        """
        Since no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1, 'answerid': 1}
        url = reverse("api:posts-detail-answer", kwargs=params)
        response = self.client.put(url,
                                    data=urlencode({'content': 'Test content'}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    def test_post_answer_partial_update(self):
        """
        Partial_update/PATCH not supported, should expect 405 method not allowed
        :return:
        """
        params = {'pk': 1, 'answerid': 1}
        url = reverse("api:posts-detail-answer", kwargs=params)
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data, get_packet_details(MethodNotAllowed("PATCH")))

    def test_post_answer_destroy(self):
        """
        Since no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1, 'answerid': 1}
        url = reverse("api:posts-detail-answer", kwargs=params)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))
