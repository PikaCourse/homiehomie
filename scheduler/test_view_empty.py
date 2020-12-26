"""
Test cases testing again empty database view operations
"""
from django.shortcuts import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from urllib.parse import urlencode


class EmptyCourseMetaViewSetTests(APITestCase):
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
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(response.data, [])

    def test_empty_course_meta_retrieve(self):
        """
        If no instance in db, should expect an empty array of course meta
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:coursesmeta-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': f'course meta not found'})


class EmptyCourseViewSetTests(APITestCase):
    """
    All tests here test when the database is empty
    """
    def test_empty_course_list(self):
        """
        If no instance in db, should expect an empty array of course
        :return:
        """
        url = reverse("api:courses-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(response.data, [])

    def test_empty_course_retrieve(self):
        """
        If no instance in db, should expect 404
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:courses-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'course not found'})


class EmptyQuestionViewSetTests(APITestCase):
    """
    All tests here test when the database is empty
    """
    def test_empty_question_list(self):
        """
        If no instance in db, should expect an empty array of question
        :return:
        """
        url = reverse("api:questions-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(response.data, [])

    def test_empty_question_retrieve(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'question not found'})

    def test_empty_question_create(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key'})

    def test_empty_question_create_missing_course_meta(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key'})

    def test_empty_question_create_missing_title(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key'})

    def test_empty_question_update(self):
        """
        Since no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid question id'})

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

    def test_empty_question_destroy(self):
        """
        Since no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:questions-detail", kwargs=params)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid question id'})


class EmptyNoteViewSetTests(APITestCase):
    """
    All tests here test when the database is empty
    """
    def test_empty_note_list(self):
        """
        If no instance in db, should expect an empty array of note
        :return:
        """
        url = reverse("api:notes-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(response.data, [])

    def test_empty_note_retrieve(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:notes-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'note not found'})

    def test_empty_note_create(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key or question id'})

    def test_empty_note_create_missing_course(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key or question id'})

    def test_empty_note_create_missing_question(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key or question id'})

    def test_empty_note_create_missing_title(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key or question id'})

    def test_empty_note_create_missing_content(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key or question id'})

    def test_empty_note_create_missing_tags(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key or question id'})

    def test_empty_note_update(self):
        """
        Since no instance in db, should expect 400 bad request
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:notes-detail", kwargs=params)
        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid note id'})

    def test_empty_note_partial_update(self):
        """
        Partial_update/PATCH not supported, should expect 405 method not allowed
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:notes-detail", kwargs=params)
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data, {'errcode': 5000, 'errmsg': 'method not allowed'})

    def test_empty_note_destroy(self):
        """
        Since no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:notes-detail", kwargs=params)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid note id'})


class EmptyPostViewSetTests(APITestCase):
    """
    All tests here test when the database is empty
    """
    def test_empty_post_list(self):
        """
        If no instance in db, should expect an empty array of post
        :return:
        """
        url = reverse("api:posts-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(response.data, [])

    def test_empty_post_retrieve(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-detail", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'post not found'})

    def test_empty_post_create(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key or course id'})

    def test_empty_post_create_missing_course(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key or course id'})

    def test_empty_post_create_missing_title(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key or course id'})

    def test_empty_post_create_missing_content(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key or course id'})

    def test_empty_post_create_missing_tags(self):
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
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid form key or course id'})

    def test_empty_post_update(self):
        """
        Since no instance in db, should expect 400 bad request
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-detail", kwargs=params)
        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid post id'})

    def test_empty_post_partial_update(self):
        """
        Partial_update/PATCH not supported, should expect 405 method not allowed
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-detail", kwargs=params)
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data, {'errcode': 5000, 'errmsg': 'method not allowed'})

    def test_empty_post_destroy(self):
        """
        Since no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:notes-detail", kwargs=params)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'post not found'})

    def test_empty_post_answer_list(self):
        """
        If no instance in db, should expect 404 since post does not exist
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-answers", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'post not found'})

    def test_empty_post_answer_retrieve(self):
        """
        If no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1, 'answerid': 1}
        url = reverse("api:posts-detail-answer", kwargs=params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'post not found'})

    def test_empty_post_answer_create(self):
        """
        Expect a 400 response since no valid post id exists
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-answers", kwargs=params)
        response = self.client.post(url,
                                    data=urlencode({'content': 'Test content'}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid post id'})

    def test_empty_post_answer_create_missing_content(self):
        """
        Expect a 400 response due to invalid post id since it should check it first
        :return:
        """
        params = {'pk': 1}
        url = reverse("api:posts-answers", kwargs=params)
        response = self.client.post(url,
                                    data=urlencode({}),
                                    content_type='application/x-www-form-urlencoded')
        # Assert response code and msg
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid post id'})

    def test_empty_post_answer_update(self):
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
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid post answer id'})

    def test_empty_post_answer_partial_update(self):
        """
        Partial_update/PATCH not supported, should expect 405 method not allowed
        :return:
        """
        params = {'pk': 1, 'answerid': 1}
        url = reverse("api:posts-detail-answer", kwargs=params)
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data, {'errcode': 5000, 'errmsg': 'method not allowed'})

    def test_empty_post_answer_destroy(self):
        """
        Since no instance in db, should expect 404 not found
        :return:
        """
        params = {'pk': 1, 'answerid': 1}
        url = reverse("api:posts-detail-answer", kwargs=params)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'errcode': 1000, 'errmsg': 'invalid post answer id'})