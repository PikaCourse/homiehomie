"""
Test cases testing again non-empty database view operations using fixtures loading
Perform operations on small dataset of few entries
"""

from django.shortcuts import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.exceptions import *
from scheduler.exceptions import *
from scheduler.test_utils import *
from urllib.parse import urlencode
from datetime import datetime
import json
import random

COURSE_META_NUM_ENTRIES = 20
COURSE_NUM_ENTRIES = 22
QUESTION_NUM_ENTRIES = 6
NOTE_NUM_ENTRIES = 8
POST_NUM_ENTRIES = 4
POST_ANSWER_NUM_ENTRIES_1 = 4 # num of post answer related to first post
POST_ANSWER_NUM_ENTRIES = 8
USER_NUM_ENTRIES = 2


"""
Begin TestCase Cases
"""


class CourseMetaViewSetTests(APITestCase):
    """
    Viewset testcase for CourseMetaViewSet
    """
    fixtures = ['scheduler/test_coursemeta_simple.json']

    """
    Begin valid view testing
    Support list and retrieve (GET)
    """
    # ListView testing
    def test_course_meta_list_length(self):
        """
        Since there are 20 entries in the fixtures, expected 20 entries
        :return:
        """
        url = reverse("api:coursesmeta-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), COURSE_META_NUM_ENTRIES)

    def test_course_meta_list_format(self):
        """
        Test whether the objects in the returned list has the fields
        specified in API documentation
        :return:
        """
        url = reverse("api:coursesmeta-list")
        fields = ["id", "title", "name", "major",
                  "college", "credit_hours", "school",
                  "description", "tags"]
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for obj in response.data:
            check_fields(self, obj, fields)

    def test_course_meta_list_single_filter_not_exist(self):
        """
        Prepopulated database with data
        Test if return empty list for non existing filter value
        :return:
        """
        url = reverse("api:coursesmeta-list")

        # Test VT
        test_array = ["school", "major", "college", "name", "title"]
        for filter_param in test_array:
            filter_val = "Test" + filter_param.capitalize()
            response = self.client.get(url, {filter_param: filter_val})

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertListEqual(response.data, [])

    def test_course_meta_list_single_filter(self):
        """
        Prepopulated database with data and test if it can be search by school name
        Test if return proper list for existing filter value
        :return:
        """
        url = reverse("api:coursesmeta-list")

        # Query key-value pairs used for testing
        test_dict = {
            "school": "Virgina Tech",
            "major": "ECE",
            "college": "College of Engineering",
            "title": "AAEC-4804",
            "name": "Introduction to Artificial Intelligence"
        }

        # Test full name search
        check_query_exact(self, url, test_dict)

    def test_course_meta_list_single_filter_ignore_case(self):
        """
        Prepopulated database with data and test if it can be search by school name
        Test if query is case insensitive
        :return:
        """
        url = reverse("api:coursesmeta-list")

        # Query key-value pairs used for testing
        test_dict = {
            "school": "Virgina Tech",
            "major": "ECE",
            "college": "College of Engineering",
            "title": "AAEC-4804",
            "name": "Introduction to Artificial Intelligence"
        }

        check_query_iexact(self, url, test_dict)

    def test_course_meta_list_single_filter_contain(self):
        """
        Prepopulated database with data and test if it can be search by school name
        Test if some query key support contains search as specified in API doc
        :return:
        """
        url = reverse("api:coursesmeta-list")

        # Query key-value pairs used for testing
        test_dict = {
            "college": "College of Engineering",
            "name": "Introduction to Artificial Intelligence"
        }

        # Test
        check_query_contains(self, url, test_dict)

    def test_course_meta_list_single_filter_contain_ignore_case(self):
        """
        Prepopulated database with data and test if it can be search by school name
        Test if some query key support contains search as specified in API doc
        :return:
        """
        url = reverse("api:coursesmeta-list")

        # Query key-value pairs used for testing
        test_dict = {
            "college": "College of Engineering",
            "name": "Introduction to Artificial Intelligence"
        }

        # Test
        check_query_icontains(self, url, test_dict)

    def test_course_meta_list_single_filter_startswith(self):
        """
        Prepopulated database with data and test if it can be search by school name
        Test if some query key support startswith search as specified in API doc
        :return:
        """
        url = reverse("api:coursesmeta-list")

        # Query key-value pairs used for testing
        test_dict = {
            "title": "AAEC-4804"
        }

        # Test Upper
        check_query_startswith(self, url, test_dict)

    def test_course_meta_list_single_filter_startswith_ignore_case(self):
        """
        Prepopulated database with data and test if it can be search by school name
        Test if some query key support startswith search as specified in API doc
        :return:
        """
        url = reverse("api:coursesmeta-list")

        # Query key-value pairs used for testing
        test_dict = {
            "title": "AAEC-4804"
        }

        # Test Upper
        check_query_istartswith(self, url, test_dict)

    def test_course_meta_list_single_filter_limit(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:coursesmeta-list")

        test_limit = 5
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(test_limit, len(response.data))

    def test_course_meta_list_single_filter_limit_invalid_zero(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:coursesmeta-list")

        # Test limit 0
        test_limit = 0
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_course_meta_list_single_filter_limit_invalid_negative(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:coursesmeta-list")

        # Test limit -1
        test_limit = -1
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_course_meta_list_single_filter_limit_invalid_not_integer(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:coursesmeta-list")
        # Test limit float
        test_limit = 3.545
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

        # Test limit not a number
        test_limit = "limit?"
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_course_meta_list_multi_filter(self):
        """
        Prepopulated database with data
        Test if return proper list for existing filter value
        :return:
        """
        url = reverse("api:coursesmeta-list")

        # Query key-value pairs used for testing
        test_dict = {
            "school": "Purdue University",
            "major": "CS",
            "college": "engin",
            "title": "ECE 3",
            "name": "Introduction "
        }

        check_multi_query(self, url, test_dict)

    # Should ignore non existing filter
    def test_course_meta_list_non_existing_filter(self):
        """
        Since there are 20 entries in the fixtures, expected 20 entries
        :return:
        """
        url = reverse("api:coursesmeta-list")
        response = self.client.get(url, {"nonexisted": "Purdue"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), COURSE_META_NUM_ENTRIES)

    # DetailView/RetrieveView testing
    def test_course_meta_retrieve(self):
        """
        Test accessing single course meta object
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:coursesmeta-detail", kwargs=path_params)
        fields = ["id", "title", "name", "major",
                  "college", "credit_hours", "school",
                  "description", "tags"]

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        obj = response.data
        check_fields(self, obj, fields)

    def test_course_meta_retrieve_not_found(self):
        """
        Test accessing single course meta object with invalid id
        expecting a 404 not found
        :return:
        """
        path_params = {"pk": 25}
        url = reverse("api:coursesmeta-detail", kwargs=path_params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

        path_params = {"pk": -1}
        url = reverse("api:coursesmeta-detail", kwargs=path_params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    """
    Begin invalid view testing/invalid http method
    POST/PUT/DELETE should not be supported since course_meta only
    gets updated from db directly
    """
    # CreateView testing
    def test_course_meta_create(self):
        """
        Create/POST not supported, should expect 405 method not allowed
        :return:
        """
        url = reverse("api:coursesmeta-list")
        check_method_not_allowed(self, url, "POST")

    # UpdateView testing
    def test_course_meta_update(self):
        """
        Update/PUT not supported, should expect 405 method not allowed
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:coursesmeta-detail", kwargs=params)
        check_method_not_allowed(self, url, "PUT")

    # PartialUpdateView testing
    def test_course_meta_partial_update(self):
        """
        Update/PUT not supported, should expect 405 method not allowed
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:coursesmeta-detail", kwargs=params)
        check_method_not_allowed(self, url, "PATCH")

    # DestroyView testing
    def test_course_meta_destroy(self):
        """
        Update/PUT not supported, should expect 405 method not allowed
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:coursesmeta-detail", kwargs=params)
        check_method_not_allowed(self, url, "DELETE")


class CourseViewSetTests(APITestCase):
    """
    Viewset testcase for CourseViewSet
    """
    fixtures = ['scheduler/test_coursemeta_simple.json',
                'scheduler/test_course_simple.json']

    """
    Begin valid view testing
    Support list and retrieve (GET)
    """
    def test_course_list_length(self):
        """
        Since there are 23 entries in the fixtures, expected 23 entries
        :return:
        """
        url = reverse("api:courses-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), COURSE_NUM_ENTRIES)

    # ListView testing
    def test_course_list_format(self):
        """
        Check whether the returned object has the same format as described in API doc
        :return:
        """
        url = reverse("api:courses-list")
        fields = ["id", "crn", "time", "capacity", "registered",
                  "type", "professor", "year", "semester",
                  "location", "course_meta"]
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for obj in response.data:
            check_fields(self, obj, fields)

    def test_course_list_single_filter_not_exist(self):
        """
        Prepopulated database with data
        Test if return empty list for non existing filter value
        :return:
        """
        url = reverse("api:courses-list")

        # Test VT
        test_array = ["school", "major", "title", "semester", "professor"]
        for filter_param in test_array:
            filter_val = "Test" + filter_param.capitalize()
            response = self.client.get(url, {filter_param: filter_val})

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertListEqual(response.data, [])

    def test_course_list_single_filter(self):
        """
        Prepopulated database with data
        Test if return proper list for existing filter value
        :return:
        """
        url = reverse("api:courses-list")

        # Query key-value pairs used for testing
        test_dict = {
            "school": "Virgina Tech",
            "major": "ECE",
            "title": "ECE 27000",
            "semester": "fall",
            "professor": "SC Blank"
        }

        # Test full name search
        check_query_exact(self, url, test_dict)

    def test_course_list_single_filter_ignore_case(self):
        """
        Prepopulated database with data
        Test if query is case insensitive
        :return:
        """
        url = reverse("api:courses-list")

        # Query key-value pairs used for testing
        test_dict = {
            "school": "Virgina Tech",
            "major": "ECE",
            "title": "ECE 27000",
            "semester": "fall",
            "professor": "SC Blank"
        }

        # Test Upper
        check_query_iexact(self, url, test_dict)

    def test_course_list_single_filter_startswith(self):
        """
        Prepopulated database with data and test if it can be search by school name
        Test if some query key support startswith search as specified in API doc
        :return:
        """
        url = reverse("api:courses-list")

        # Query key-value pairs used for testing
        test_dict = {
            "school": "Virgina Tech",
            "major": "ECE",
            "title": "ECE 27000"
        }

        check_query_startswith(self, url, test_dict)

    def test_course_list_single_filter_startswith_ignore_case(self):
        """
        Prepopulated database with data and test if it can be search by school name
        Test if some query key support startswith search as specified in API doc
        :return:
        """
        url = reverse("api:courses-list")

        # Query key-value pairs used for testing
        test_dict = {
            "school": "Virgina Tech",
            "major": "ECE",
            "title": "ECE 27000"
        }

        check_query_istartswith(self, url, test_dict)

    # Limit key constraint checker
    def test_course_list_single_filter_limit(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:courses-list")

        test_limit = 5
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(test_limit, len(response.data))

    def test_course_list_single_filter_limit_invalid_zero(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:courses-list")

        # Test limit 0
        test_limit = 0
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_course_list_single_filter_limit_invalid_negative(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:courses-list")

        # Test limit -1
        test_limit = -1
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_course_list_single_filter_limit_invalid_not_integer(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:courses-list")
        # Test limit float
        test_limit = 3.545
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

        # Test limit not a number
        test_limit = "limit?"
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    # Year key constraint checker
    def test_course_list_single_filter_year(self):
        """
        Test whether the filter year is working
        :return:
        """
        url = reverse("api:courses-list")

        test_year = 2018
        response = self.client.get(url, {"year": test_year})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data, [])
        for obj in response.data:
            self.assertEqual(int(obj["year"]), test_year)

    def test_course_list_single_filter_year_not_exist(self):
        """
        Test whether the response is proper when no course in system
        match the year requirement
        Expecting 200 and empty queryset
        :return:
        """
        url = reverse("api:courses-list")

        test_year = 1970
        response = self.client.get(url, {"year": test_year})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_course_list_single_filter_year_invalid_lt(self):
        """
        Test whether the response is proper when the given year is less than limit (1970)
        :return:
        """
        url = reverse("api:courses-list")

        test_year = 1960
        response = self.client.get(url, {"year": test_year})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_course_list_single_filter_year_invalid_gt(self):
        """
        Test whether the response is proper when the given year is greater than limit (2100)
        :return:
        """
        url = reverse("api:courses-list")

        test_year = 2110
        response = self.client.get(url, {"year": test_year})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_course_list_single_filter_year_invalid_not_integer(self):
        """
        Test whether the response is proper when the given year is not an integer
        :return:
        """
        url = reverse("api:courses-list")

        test_year = 3.1415926
        response = self.client.get(url, {"year": test_year})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

        test_year = "I am invalid"
        response = self.client.get(url, {"year": test_year})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_course_list_multi_filter(self):
        url = reverse("api:courses-list")

        # Query key-value pairs used for testing
        test_dict = {
            "school": "Virgina Tech",
            "major": "CS",
            "title": "ECE 2",
            "semester": "fall",
            "professor": "SC Blank"
        }

        check_multi_query(self, url, test_dict)

    # Should ignore non existing filter
    def test_course_list_non_existing_filter(self):
        """
        Since there are 22 entries in the fixtures, expected 22 entries
        :return:
        """
        url = reverse("api:courses-list")
        response = self.client.get(url, {"nonexisted": "Purdue"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), COURSE_NUM_ENTRIES)

    # DetailView/RetrieveView testing
    def test_course_retrieve(self):
        """
        Test accessing single course object
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:courses-detail", kwargs=path_params)
        fields = ["id", "crn", "time", "capacity", "registered",
                  "type", "professor", "year", "semester",
                  "location", "course_meta"]

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        obj = response.data
        check_fields(self, obj, fields)

    def test_course_retrieve_not_found(self):
        """
        Test accessing single course object with invalid id
        expecting a 404 not found
        :return:
        """
        path_params = {"pk": 100}
        url = reverse("api:courses-detail", kwargs=path_params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

        path_params = {"pk": -1}
        url = reverse("api:courses-detail", kwargs=path_params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    """
    Begin invalid view testing/invalid http method
    POST/PUT/DELETE should not be supported since course only
    gets updated from db directly
    """
    # CreateView testing
    def test_course_create(self):
        """
        Create/POST not supported, should expect 405 method not allowed
        :return:
        """
        url = reverse("api:courses-list")
        check_method_not_allowed(self, url, "POST")

    # UpdateView testing
    def test_course_update(self):
        """
        Update/PUT not supported, should expect 405 method not allowed
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:courses-detail", kwargs=params)
        check_method_not_allowed(self, url, "PUT")

    # PartialUpdateView testing
    def test_course_partial_update(self):
        """
        Partial Update/PATCH not supported, should expect 405 method not allowed
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:courses-detail", kwargs=params)
        check_method_not_allowed(self, url, "PATCH")

    # DestroyView testing
    def test_course_destroy(self):
        """
        Update/PUT not supported, should expect 405 method not allowed
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:courses-detail", kwargs=params)
        check_method_not_allowed(self, url, "DELETE")


class QuestionViewSetTests(APITestCase):
    """
    Viewset testcase for QuestionViewSet
    """
    fixtures = ['scheduler/test_coursemeta_simple.json',
                'scheduler/test_course_simple.json',
                'scheduler/test_question_simple.json',
                'user/test_user_simple.json',
                'user/test_student_simple.json']

    """
    Begin valid view testing
    Support list and retrieve (GET)
    """

    # ListView testing
    def test_question_list_length(self):
        """
        Since there are 6 entries in the fixtures, expected 6 entries
        :return:
        """
        url = reverse("api:questions-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), QUESTION_NUM_ENTRIES)

    def test_question_list_format(self):
        """
        Test whether the objects iin the returned list has the fields
        specified by the API documentation
        :return:
        """
        url = reverse("api:questions-list")
        fields = ["id", "course_meta", "created_by", "created_at",
                  "last_answered", "last_edited", "like_count",
                  "star_count", "dislike_count", "is_pin", "pin_order",
                  "title", "tags"]
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for obj in response.data:
            check_fields(self, obj, fields)

    def test_question_single_filter_coursemetaid(self):
        """
        Test whether the backend respond properly according to
        the given coursemetaid
        :return:
        """
        test_course_meta_id = 1
        url = reverse("api:questions-list")
        response = self.client.get(url, {"coursemetaid": test_course_meta_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data, [])
        for obj in response.data:
            self.assertEqual(obj["course_meta"], test_course_meta_id)

    def test_question_single_filter_coursemetaid_invalid_out_range(self):
        """
        Test whether the backend respond properly according to
        the given coursemetaid
        Since out of possible range, expecting empty response
        :return:
        """
        test_course_meta_id = 25
        url = reverse("api:questions-list")
        response = self.client.get(url, {"coursemetaid": test_course_meta_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

        test_course_meta_id = -1
        url = reverse("api:questions-list")
        response = self.client.get(url, {"coursemetaid": test_course_meta_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_question_single_filter_coursemetaid_invalid_not_integer(self):
        """
        Test whether the backend respond properly according to
        the given coursemetaid
        Since not a number, expecting bad request and raise InvalidQueryValue exception
        :return:
        """
        test_course_meta_id = 3.23
        url = reverse("api:questions-list")
        response = self.client.get(url, {"coursemetaid": test_course_meta_id})
        self.assertEqual(response.status_code, InvalidQueryValue.default_code)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

        test_course_meta_id = "test"
        url = reverse("api:questions-list")
        response = self.client.get(url, {"coursemetaid": test_course_meta_id})
        self.assertEqual(response.status_code, InvalidQueryValue.default_code)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_question_single_filter_sortby_default(self):
        """
        Test whether the returned list is sorted by default to be
        descending and by like_count field
        :return:
        """
        url = reverse("api:questions-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data, [])
        check_order(self, arr=response.data, key="like_count", descending=True)

    def test_question_pair_filter_sortby_descending_possible_keys(self):
        """
        Check if sortby works for other valid options
        :return:
        """
        url = reverse("api:questions-list")
        sortby_options = ["like_count", "dislike_count", "star_count"]
        descending_options = [True, False]
        for sortby_option in sortby_options:
            for descending_option in descending_options:
                response = self.client.get(url, {"sortby": sortby_option, "descending": descending_option})
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertNotEqual(response.data, [])
                check_order(self, arr=response.data, key=sortby_option, descending=descending_option)

    def test_question_pair_filter_sortby_descending_invalid(self):
        """
        Check whether sortby raise exception for invalid sortby or descending value
        Expecting 400 and
        :return:
        """
        url = reverse("api:questions-list")
        test_sortby = "invalid"
        test_descending = "invalid"

        # Individual
        response = self.client.get(url, {"sortby": test_sortby})
        self.assertEqual(response.status_code, InvalidQueryValue.status_code)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

        response = self.client.get(url, {"descending": test_descending})
        self.assertEqual(response.status_code, InvalidQueryValue.status_code)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

        # Combined
        response = self.client.get(url, {"sortby": test_sortby, "descending": True})
        self.assertEqual(response.status_code, InvalidQueryValue.status_code)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

        response = self.client.get(url, {"sortby": "like_count", "descending": test_descending})
        self.assertEqual(response.status_code, InvalidQueryValue.status_code)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

        response = self.client.get(url, {"sortby": test_sortby, "descending": test_descending})
        self.assertEqual(response.status_code, InvalidQueryValue.status_code)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_question_list_single_filter_limit(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:questions-list")

        test_limit = 5
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(test_limit, len(response.data))

    def test_question_list_single_filter_limit_invalid_zero(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:questions-list")

        # Test limit 0
        test_limit = 0
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_question_list_single_filter_limit_invalid_negative(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:questions-list")

        # Test limit -1
        test_limit = -1
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_question_list_single_filter_limit_invalid_not_integer(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:questions-list")
        # Test limit float
        test_limit = 3.545
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

        # Test limit not a number
        test_limit = "limit?"
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_question_list_multi_filter(self):
        """
        Test that the query param works for multiple query key
        :return:
        """
        url = reverse("api:questions-list")
        test_query_keys = ["coursemetaid", "sortby", "descending", "limit"]
        test_query_values = {
            "coursemetaid": list(range(1, COURSE_META_NUM_ENTRIES + 1)),
            "sortby": ["like_count", "star_count", "dislike_count"],
            "descending": [True, False],
            "limit": list(range(1, QUESTION_NUM_ENTRIES + 1))
        }
        query_key_mapping = dict()
        query_key_mapping["coursemetaid"] = "course_meta"

        # Perform 100 random query and test if the result is expected
        check_multi_query_v2(self, url, test_query_keys, test_query_values, query_key_mapping)

    def test_question_list_non_existing_filter(self):
        """
        Since there are 6 entries in the fixtures, expected 6 entries
        :return:
        """
        url = reverse("api:questions-list")
        response = self.client.get(url, {"nonexisted": "Purdue"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), QUESTION_NUM_ENTRIES)

    # DetailView/RetrieveView testing
    def test_question_retrieve(self):
        """
        Test accessing single question object
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:questions-detail", kwargs=path_params)
        fields = ["id", "course_meta", "created_by", "created_at",
                  "last_answered", "last_edited", "like_count",
                  "star_count", "dislike_count", "is_pin", "pin_order",
                  "title", "tags"]

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        obj = response.data
        check_fields(self, obj, fields)

    def test_question_retrieve_not_found(self):
        """
        Test accessing single question object with invalid id
        expecting a 404 not found
        :return:
        """
        path_params = {"pk": 25}
        url = reverse("api:questions-detail", kwargs=path_params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

        path_params = {"pk": -1}
        url = reverse("api:questions-detail", kwargs=path_params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    # TODO Rest of tests need to add permission check after introducing user

    # CreateView testing
    def test_question_create(self):
        """
        Test success create view and able to access via get
        :return:
        """
        url = reverse("api:questions-list")
        detail_url_name = "api:questions-detail"
        # Encode json field
        test_data = {'course_meta': 1, 'title': 'Test question', 'tags': ["tags"]}

        check_post_success(self, url, detail_url_name, test_data, json_fields=["tags"])

    def test_question_create_extra_field(self):
        """
        Test success create view and able to access via get with extra fields
        :return:
        """
        url = reverse("api:questions-list")
        detail_url_name = "api:questions-detail"
        # Encode json field
        test_data = {'course_meta': 1, 'title': 'Test question',
                     'tags': ["tags"], "extra": "extra"}

        check_post_success(self, url, detail_url_name, test_data, json_fields=["tags"], ignore_fields=["extra"])

    def test_question_create_invalid_missing_fields(self):
        """
        Test invalid form with missing fields, should raise 400 error
        :return:
        """
        url = reverse("api:questions-list")
        detail_url_name = "api:questions-detail"
        # Encode json field
        test_data = {'course_meta': 1, 'title': 'Test question',
                     'tags': json.dumps(["test"])}

        # Try 20 form submission with missing fields
        for _ in range(20):
            num_pair = random.randint(0, len(test_data.keys()) - 1)
            form_fields = random.sample(test_data.keys(), num_pair)
            form = {form_field: test_data[form_field] for form_field in form_fields}

            check_post_error(self, url, form)

    def test_question_create_invalid_empty_fields(self):
        """
        Test empty fields (course_meta, title), should raise 400 error
        :return:
        """
        url = reverse("api:questions-list")
        detail_url_name = "api:questions-detail"
        # Encode json field
        test_data = {'course_meta': 1, 'title': 'Test question',
                     'tags': []}

        # Test empty course_meta
        form = {'course_meta': '', 'title': 'Test', 'tags': []}
        check_post_error(self, url, form)

        # Test empty title
        form = {'course_meta': 1, 'title': '', 'tags': []}
        check_post_error(self, url, form)

        # Test empty tags
        form = {'course_meta': 1, 'title': 'Test', 'tags': ''}
        check_post_error(self, url, form)

    def test_question_create_invalid_field_constraint(self):
        """
        Test field constraint
        :return:
        """
        url = reverse("api:questions-list")
        detail_url_name = "api:questions-detail"
        # Encode json field
        test_data = {'course_meta': 1, 'title': 'Test question',
                     'tags': "Not a json"}

        # Test not a json
        form = test_data
        check_post_error(self, url, form, error_class=InvalidForm)

    # UpdateView testing
    def test_question_update(self):
        """
        Test successful update question
        :return:
        """
        detail_url_name = "api:questions-detail"
        path_params = {"pk": 1}
        test_data = {"title": "Changed", "tags": ["changed", "changed tag"]}
        time_test = datetime.now()

        data = check_put_success(self, detail_url_name, path_params, test_data)

        # Check if the last edited fields get updated as well
        url = reverse("api:questions-detail", kwargs={"pk": data["question"]})
        response = self.client.get(url)
        time_question = datetime.fromisoformat(response.data["last_edited"][:-1])
        time_diff_seconds = (time_question - time_test).total_seconds()
        self.assertLessEqual(time_diff_seconds, 10, msg=f"Overtime")
        self.assertLessEqual(0, time_diff_seconds, msg=f"Question gets updated back in time")

    def test_question_update_invalid_pk(self):
        """
        Test with invalid pk or question id, expect errors
        :return:
        """
        detail_url_name = "api:questions-detail"
        test_data = {"title": "Changed", "tags": json.dumps(["changed", "changed tag"])}

        # Out of range
        path_params = {"pk": 100}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=NotFound)

        # Not an integer
        path_params = {"pk": 3.44}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=InvalidPathParam)

        # Not an integer
        path_params = {"pk": "I am invalid"}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=InvalidPathParam)

    def test_question_update_extra_field(self):
        """
        Test update question with extra field, which should be ignored
        :return:
        """
        detail_url_name = "api:questions-detail"
        path_params = {"pk": 1}
        test_data = {"title": "Changed", "tags": ["changed", "changed tag"], "extra": "extra"}

        check_put_success(self, detail_url_name, path_params, test_data, ignore_fields=["extra"])

    def test_question_update_invalid_missing_field(self):
        """
        Test with missing fields, expecting 400 error
        :return:
        """
        detail_url_name = "api:questions-detail"
        path_params = {"pk": 1}
        test_data = {"title": "Changed", "tags": json.dumps(["changed", "changed tag"])}

        # Try 20 form submission with missing fields
        check_put_missing_fields(self, detail_url_name, path_params, test_data,
                                 blank_fields=[], num_put=20)

    def test_question_update_invalid_field_constraint(self):
        """
        Test against form field constraint
        :return:
        """
        detail_url_name = "api:questions-detail"
        path_params = {"pk": 1}

        # Empty title
        form = {"title": "", "tags": json.dumps(["changed", "changed tag"])}
        check_put_error(self, detail_url_name, path_params, form, error_class=InvalidForm)

        # Not a json
        form = {"title": "Test", "tags": "Not json"}
        check_put_error(self, detail_url_name, path_params, form, error_class=InvalidForm)

    # DestroyView testing
    def test_question_destroy(self):
        """
        Test successful delete
        :return:
        """
        detail_url_name = "api:questions-detail"
        path_params = {"pk": 1}

        check_delete_success(self, detail_url_name, path_params)

    def test_question_destroy_invalid_not_existing(self):
        """
        Test invalid delete: out of range pk
        :return:
        """
        detail_url_name = "api:questions-detail"
        path_params = {"pk": 100}

        check_delete_error(self, detail_url_name, path_params)

    def test_question_destroy_invalid_path_params(self):
        """
        Test invalid delete: not an integer
        :return:
        """
        detail_url_name = "api:questions-detail"

        path_params = {"pk": 3.4}
        check_delete_error(self, detail_url_name, path_params, error_class=InvalidPathParam)

        ath_params = {"pk": "Not integer"}
        check_delete_error(self, detail_url_name, path_params, error_class=InvalidPathParam)

    """
    Begin invalid view testing/invalid http method
    PATCH should not be supported since PUT is enough and to prevent
    django rest framework automatic method on ModelViewSet
    """
    # PartialUpdateView testing
    def test_question_partial_update(self):
        """
        Partial update/PATCH not supported
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:questions-detail", kwargs=params)
        check_method_not_allowed(self, url, "PATCH")


class NoteViewSetTests(APITestCase):
    """
    Viewset testcase for NoteViewSet
    """
    fixtures = ['scheduler/test_coursemeta_simple.json',
                'scheduler/test_course_simple.json',
                'scheduler/test_question_simple.json',
                'scheduler/test_note_simple.json',
                'user/test_user_simple.json',
                'user/test_student_simple.json']

    """
    Begin valid view testing
    Support list and retrieve (GET)
    """

    # ListView testing
    def test_note_list_length(self):
        """
        Since there are 8 entries in the fixtures, expected 8 entries
        :return:
        """
        url = reverse("api:notes-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), NOTE_NUM_ENTRIES)

    def test_note_list_format(self):
        """
        Test whether the objects in the returned list has the fields
        specified by the API documentation
        :return:
        """
        url = reverse("api:notes-list")
        fields = ["course", "question", "id", "created_at",
                  "created_by", "last_edited", "like_count",
                  "star_count", "dislike_count", "title", "content",
                  "tags"]
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for obj in response.data:
            check_fields(self, obj, fields)

    def test_note_single_filter_courseid(self):
        """
        Test whether the backend respond properly according to
        the given courseid
        :return:
        """
        test_course_id = 1
        url = reverse("api:notes-list")
        response = self.client.get(url, {"courseid": test_course_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data, [])
        for obj in response.data:
            self.assertEqual(obj["course"], test_course_id)

    def test_note_single_filter_courseid_invalid_out_range(self):
        """
        Test out of range courseid, expecting empty return list
        :return:
        """
        test_course_id = 25
        url = reverse("api:notes-list")
        response = self.client.get(url, {"courseid": test_course_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

        test_course_id = -1
        url = reverse("api:notes-list")
        response = self.client.get(url, {"courseid": test_course_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_note_single_filter_courseid_invalid_not_integer(self):
        """
        Test whether the backend respond properly according to
        the given courseid
        Since not a number, expecting bad request and raise InvalidQueryValue exception
        :return:
        """
        url = reverse("api:notes-list")

        test_course_id = 3.23
        query_params = {"courseid": test_course_id}
        check_query_filter_error(self, url, query_params, error_class=InvalidQueryValue)

        test_course_id = "test"
        query_params = {"courseid": test_course_id}
        check_query_filter_error(self, url, query_params, error_class=InvalidQueryValue)

    def test_note_single_filter_sortby_default(self):
        """
        Test default return order
        :return:
        """
        url = reverse("api:notes-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data, [])
        check_order(self, arr=response.data, key="like_count", descending=True)

    def test_note_pair_filter_sortby_descending_possible_keys(self):
        """
        Check if sortby works for other valid options
        :return:
        """
        url = reverse("api:notes-list")
        sortby_options = ["like_count", "dislike_count", "star_count"]
        descending_options = [True, False]
        for sortby_option in sortby_options:
            for descending_option in descending_options:
                response = self.client.get(url, {"sortby": sortby_option, "descending": descending_option})
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertNotEqual(response.data, [])
                check_order(self, arr=response.data, key=sortby_option, descending=descending_option)

    def test_note_pair_filter_sortby_descending_invalid(self):
        """
        Check whether sortby raise exception for invalid sortby or descending value
        Expecting 400 and
        :return:
        """
        url = reverse("api:notes-list")
        test_sortby = "invalid"
        test_descending = "invalid"

        # Individual
        query_params_list = [
            {"sortby": test_sortby},
            {"descending": test_descending},
            {"sortby": test_sortby, "descending": True},
            {"sortby": "like_count", "descending": test_descending},
            {"sortby": test_sortby, "descending": test_descending}
        ]
        for query_params in query_params_list:
            check_query_filter_error(self, url, query_params, error_class=InvalidQueryValue)

    def test_note_list_single_filter_limit(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:notes-list")

        test_limit = 5
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(test_limit, len(response.data))

    def test_note_list_single_filter_limit_invalid_zero(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:notes-list")

        # Test limit 0
        test_limit = 0
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_note_list_single_filter_limit_invalid_negative(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:notes-list")

        # Test limit -1
        test_limit = -1
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_note_list_single_filter_limit_invalid_not_integer(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:notes-list")
        # Test limit float
        test_limit = 3.545
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

        # Test limit not a number
        test_limit = "limit?"
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_note_list_multi_filter(self):
        """
        Test that the query param works for multiple query key
        :return:
        """
        url = reverse("api:notes-list")
        test_query_keys = ["courseid", "sortby", "descending", "limit"]
        test_query_values = {
            "courseid": list(range(1, COURSE_NUM_ENTRIES + 1)),
            "sortby": ["like_count", "star_count", "dislike_count"],
            "descending": [True, False],
            "limit": list(range(1, NOTE_NUM_ENTRIES + 1))
        }

        query_key_mapping = dict()
        query_key_mapping["courseid"] = "course"

        # Perform 100 random query and test if the result is expected
        check_multi_query_v2(self, url, test_query_keys, test_query_values, query_key_mapping)

    def test_note_list_non_existing_filter(self):
        """
        Since there are 8 entries in the fixtures, expected 8 entries
        :return:
        """
        url = reverse("api:notes-list")
        response = self.client.get(url, {"nonexisted": "Purdue"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), NOTE_NUM_ENTRIES)

    # DetailView/RetrieveView testing
    def test_note_retrieve(self):
        """
        Test accessing single note object
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:notes-detail", kwargs=path_params)
        fields = ["course", "question", "id", "created_at",
                  "created_by", "last_edited", "like_count",
                  "star_count", "dislike_count", "title", "content",
                  "tags"]

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        obj = response.data
        check_fields(self, obj, fields)

    def test_note_retrieve_not_found(self):
        """
        Test accessing note question object with invalid id
        expecting a 404 not found
        :return:
        """
        path_params = {"pk": NOTE_NUM_ENTRIES + 1}
        url = reverse("api:notes-detail", kwargs=path_params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

        path_params = {"pk": -1}
        url = reverse("api:notes-detail", kwargs=path_params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    # TODO Rest of tests need to add permission check after introducing user
    # CreateView testing
    def test_note_create(self):
        """
        Test success create view and able to access via get
        :return:
        """
        url = reverse("api:notes-list")
        detail_url_name = "api:notes-detail"
        # Encode json field
        test_data = {'course': 1, 'question': 1, 'title': 'Test note tile',
                     'content': 'Test content', 'tags': ["tags"]}

        data = check_post_success(self, url, detail_url_name, test_data, json_fields=["tags"], id_fields="note")

        # Check if the linked question is updated properly
        url = reverse("api:notes-detail", kwargs={"pk": data["note"]})
        response = self.client.get(url)
        time_note = datetime.fromisoformat(response.data["last_edited"][:-1])

        url = reverse("api:questions-detail", kwargs={"pk": 1})
        response = self.client.get(url)
        time_question = datetime.fromisoformat(response.data["last_answered"][:-1])

        # Check if the update time is within 10 second and note should be edited first
        time_diff_seconds = (time_question - time_note).total_seconds()
        self.assertLessEqual(time_diff_seconds, 10, msg=f"Overtime")
        self.assertLessEqual(0, time_diff_seconds, msg=f"Question gets updated before note")

    def test_note_create_extra_field(self):
        """
        Test success create view and able to access via get with extra fields
        :return:
        """
        url = reverse("api:notes-list")
        detail_url_name = "api:notes-detail"
        # Encode json field
        test_data = {'course': 1, 'question': 1, 'title': 'Test note tile',
                     'content': 'Test content', 'tags': ["tags"], "extra": "extra"}

        check_post_success(self, url, detail_url_name, test_data, json_fields=["tags"], ignore_fields=["extra"], id_fields="note")

    def test_note_create_invalid_missing_fields(self):
        """
        Test invalid form with missing fields, should raise 400 error
        :return:
        """
        url = reverse("api:notes-list")
        detail_url_name = "api:notes-detail"
        # Encode json field
        test_data = {'course': 1, 'question': 1, 'title': 'Test note title',
                     'content': 'Test content', 'tags': json.dumps(["tags"])}

        # Try 20 form submission with missing fields
        for _ in range(20):
            num_pair = random.randint(0, len(test_data.keys()) - 1)
            form_fields = random.sample(test_data.keys(), num_pair)
            form = {form_field: test_data[form_field] for form_field in form_fields}
            if "content" in form:
                # Since content is allow to be empty
                # Meaning at least one other field is missing
                check_post_error(self, url, form)

    def test_note_create_invalid_empty_fields(self):
        """
        Test empty fields (course_meta, title), should raise 400 error
        :return:
        """
        url = reverse("api:notes-list")
        detail_url_name = "api:notes-detail"
        # Encode json field
        test_data = {'course': 1, 'question': 1, 'title': 'Test note title',
                     'content': 'Test content', 'tags': json.dumps(["tags"])}

        # Test empty fields
        for key in test_data:
            if key == "content":
                continue
            form = test_data.copy()
            form[key] = ""
            check_post_error(self, url, form)

    def test_note_create_invalid_field_constraints(self):
        """
        Test empty fields (course_meta, title), should raise 400 error
        :return:
        """
        url = reverse("api:notes-list")
        detail_url_name = "api:notes-detail"
        # Encode json field
        test_data = {'course': 1, 'question': 1, 'title': 'Test note title',
                     'content': 'Test content', 'tags': json.dumps(["tags"])}

        form = test_data
        form["tags"] = "Not json"
        check_post_error(self, url, form, error_class=InvalidForm)

    def test_note_create_invalid_mismatch_course_question(self):
        """
        Check adding note with question and course point to different coursemeta
        Should raise 400 invalid form error
        :return:
        """
        url = reverse("api:notes-list")
        detail_url_name = "api:notes-detail"
        # Encode json field
        test_data = {'course': 2, 'question': 1, 'title': 'Test note title',
                     'content': 'Test content', 'tags': json.dumps(["tags"])}
        check_post_error(self, url, test_data, error_class=InvalidForm)

    # UpdateView testing
    def test_note_update(self):
        """
        Test successful update note
        :return:
        """
        detail_url_name = "api:notes-detail"
        path_params = {"pk": 1}
        test_data = {"title": "Changed", "content": "Changed Content", "tags": ["changed", "changed tag"]}
        time_test = datetime.now()

        data = check_put_success(self, detail_url_name, path_params, test_data)

        # Check if the edited field get updated properly
        url = reverse("api:notes-detail", kwargs={"pk": data["note"]})
        response = self.client.get(url)
        time_note = datetime.fromisoformat(response.data["last_edited"][:-1])
        time_diff_seconds = (time_note - time_test).total_seconds()
        self.assertLessEqual(time_diff_seconds, 10, msg=f"Overtime")
        self.assertLessEqual(0, time_diff_seconds, msg=f"Note gets updated back in time")

        # Check if the linked question is updated properly
        url = reverse("api:questions-detail", kwargs={"pk": 1})
        response = self.client.get(url)
        time_question = datetime.fromisoformat(response.data["last_answered"][:-1])

        # Check if the update time is within 10 second and note should be edited first
        time_diff_seconds = (time_question - time_note).total_seconds()
        self.assertLessEqual(time_diff_seconds, 10, msg=f"Overtime")
        self.assertLessEqual(0, time_diff_seconds, msg=f"Question gets updated before note")

    def test_note_update_invalid_pk(self):
        """
        Test with invalid pk or note id, expect errors
        :return:
        """
        detail_url_name = "api:notes-detail"
        test_data = {"title": "Changed", "content": "Changed Content", "tags": json.dumps(["changed", "changed tag"])}

        # Out of range
        path_params = {"pk": 100}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=NotFound)

        # Not an integer
        path_params = {"pk": 3.44}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=InvalidPathParam)

        # Not an integer
        path_params = {"pk": "I am invalid"}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=InvalidPathParam)

    def test_note_update_extra_field(self):
        """
        Test update note with extra field, which should be ignored
        :return:
        """
        detail_url_name = "api:notes-detail"
        path_params = {"pk": 1}
        test_data = {"title": "Changed", "content": "Changed Content",
                     "tags": ["changed", "changed tag"], "extra": "extra"}

        check_put_success(self, detail_url_name, path_params, test_data, ignore_fields=["extra"])

    def test_note_update_invalid_missing_field(self):
        """
        Test with missing fields, expecting 400 error
        :return:
        """
        detail_url_name = "api:notes-detail"
        path_params = {"pk": 1}
        test_data = {"title": "Changed", "content": "Changed Content",
                     "tags": json.dumps(["changed", "changed tag"])}

        # Try 20 form submission with missing fields
        check_put_missing_fields(self, detail_url_name, path_params, test_data,
                                 blank_fields=["content"], num_put=20)

    def test_note_update_invalid_field_constraint(self):
        """
        Test against form field constraint
        :return:
        """
        detail_url_name = "api:notes-detail"
        path_params = {"pk": 1}

        # Empty title
        form = {"title": "", "content": "Changed Content", "tags": json.dumps(["changed", "changed tag"])}
        check_put_error(self, detail_url_name, path_params, form, error_class=InvalidForm)

        # Not a json
        form = {"title": "Test", "content": "Changed Content", "tags": "Not json"}
        check_put_error(self, detail_url_name, path_params, form, error_class=InvalidForm)

    # DestroyView testing
    def test_note_destroy(self):
        """
        Test successful delete
        :return:
        """
        detail_url_name = "api:notes-detail"
        path_params = {"pk": 1}

        check_delete_success(self, detail_url_name, path_params)

    def test_note_destroy_invalid_not_existing(self):
        """
        Test invalid delete: out of range pk
        :return:
        """
        detail_url_name = "api:notes-detail"
        path_params = {"pk": 100}

        check_delete_error(self, detail_url_name, path_params)

    def test_note_destroy_invalid_path_params(self):
        """
        Test invalid delete: not an integer
        :return:
        """
        detail_url_name = "api:notes-detail"

        path_params = {"pk": 3.4}
        check_delete_error(self, detail_url_name, path_params, error_class=InvalidPathParam)

        ath_params = {"pk": "Not integer"}
        check_delete_error(self, detail_url_name, path_params, error_class=InvalidPathParam)

    """
    Begin invalid view testing/invalid http method
    PATCH should not be supported since PUT is enough and to prevent
    django rest framework automatic method on ModelViewSet
    """
    # PartialUpdateView testing
    def test_note_partial_update(self):
        """
        Partial update/PATCH not supported
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:notes-detail", kwargs=params)
        check_method_not_allowed(self, url, "PATCH")


class PostViewSetTests(APITestCase):
    """
    Viewset testcase for PostViewSet
    """
    fixtures = ['scheduler/test_coursemeta_simple.json',
                'scheduler/test_course_simple.json',
                'scheduler/test_post_simple.json',
                'user/test_user_simple.json',
                'user/test_student_simple.json']

    """
    Begin valid view testing
    Support list and retrieve (GET)
    """

    # ListView testing
    def test_post_list_length(self):
        """
        Test if the returned list length matched with expected
        :return:
        """
        url = reverse("api:posts-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), POST_NUM_ENTRIES)

    def test_post_list_format(self):
        """
        Test whether the objects in the returned list has the fields
        specified by the API documentation
        :return:
        """
        url = reverse("api:posts-list")
        fields = ["course", "poster", "id", "created_at",
                  "last_edited", "last_answered", "like_count",
                  "star_count", "dislike_count", "title", "content",
                  "tags"]
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for obj in response.data:
            check_fields(self, obj, fields)

    def test_post_single_filter_courseid(self):
        """
        Test whether the backend respond properly according to
        the given courseid
        :return:
        """
        test_course_id = 1
        url = reverse("api:posts-list")
        response = self.client.get(url, {"courseid": test_course_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data, [])
        for obj in response.data:
            self.assertEqual(obj["course"], test_course_id)

    def test_post_single_filter_courseid_invalid_out_range(self):
        """
        Test out of range courseid, expecting empty return list
        :return:
        """
        test_course_id = COURSE_NUM_ENTRIES + 1
        url = reverse("api:posts-list")
        response = self.client.get(url, {"courseid": test_course_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

        test_course_id = -1
        url = reverse("api:posts-list")
        response = self.client.get(url, {"courseid": test_course_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_post_single_filter_courseid_invalid_not_integer(self):
        """
        Test whether the backend respond properly according to
        the given courseid
        Since not a number, expecting bad request and raise InvalidQueryValue exception
        :return:
        """
        url = reverse("api:posts-list")

        test_course_id = 3.23
        query_params = {"courseid": test_course_id}
        check_query_filter_error(self, url, query_params, error_class=InvalidQueryValue)

        test_course_id = "test"
        query_params = {"courseid": test_course_id}
        check_query_filter_error(self, url, query_params, error_class=InvalidQueryValue)

    def test_post_single_filter_userid(self):
        """
        Test whether the backend respond properly according to
        the given userid
        :return:
        """
        test_user_id = 1
        url = reverse("api:posts-list")
        response = self.client.get(url, {"userid": test_user_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data, [])
        for obj in response.data:
            self.assertEqual(obj["poster"], test_user_id)

    def test_post_single_filter_userid_invalid_out_range(self):
        """
        Test out of range userid, expecting empty return list
        :return:
        """
        test_user_id = USER_NUM_ENTRIES + 1
        url = reverse("api:posts-list")
        response = self.client.get(url, {"userid": test_user_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

        test_user_id = -1
        url = reverse("api:posts-list")
        response = self.client.get(url, {"userid": test_user_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_post_single_filter_userid_invalid_not_integer(self):
        """
        Test whether the backend respond properly according to
        the given courseid
        Since not a number, expecting bad request and raise InvalidQueryValue exception
        :return:
        """
        url = reverse("api:posts-list")

        test_user_id = 3.23
        query_params = {"userid": test_user_id}
        check_query_filter_error(self, url, query_params, error_class=InvalidQueryValue)

        test_user_id = "test"
        query_params = {"userid": test_user_id}
        check_query_filter_error(self, url, query_params, error_class=InvalidQueryValue)

    def test_post_single_filter_sortby_default(self):
        """
        Test default return order
        :return:
        """
        url = reverse("api:posts-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data, [])
        check_order(self, arr=response.data, key="like_count", descending=True)

    def test_post_pair_filter_sortby_descending_possible_keys(self):
        """
        Check if sortby works for other valid options
        :return:
        """
        url = reverse("api:posts-list")
        sortby_options = ["like_count", "dislike_count", "star_count"]
        descending_options = [True, False]
        for sortby_option in sortby_options:
            for descending_option in descending_options:
                response = self.client.get(url, {"sortby": sortby_option, "descending": descending_option})
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertNotEqual(response.data, [])
                check_order(self, arr=response.data, key=sortby_option, descending=descending_option)

    def test_post_pair_filter_sortby_descending_invalid(self):
        """
        Check whether sortby raise exception for invalid sortby or descending value
        Expecting 400 and
        :return:
        """
        url = reverse("api:posts-list")
        test_sortby = "invalid"
        test_descending = "invalid"

        # Individual
        query_params_list = [
            {"sortby": test_sortby},
            {"descending": test_descending},
            {"sortby": test_sortby, "descending": True},
            {"sortby": "like_count", "descending": test_descending},
            {"sortby": test_sortby, "descending": test_descending}
        ]
        for query_params in query_params_list:
            check_query_filter_error(self, url, query_params, error_class=InvalidQueryValue)

    def test_post_list_single_filter_limit(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:posts-list")

        test_limit = POST_NUM_ENTRIES - 1
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(test_limit, len(response.data))

    def test_post_list_single_filter_limit_invalid_zero(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:posts-list")

        # Test limit 0
        test_limit = 0
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_post_list_single_filter_limit_invalid_negative(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:posts-list")

        # Test limit -1
        test_limit = -1
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_post_list_single_filter_limit_invalid_not_integer(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        url = reverse("api:posts-list")
        # Test limit float
        test_limit = 3.545
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

        # Test limit not a number
        test_limit = "limit?"
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_post_list_multi_filter(self):
        """
        Test that the query param works for multiple query key
        :return:
        """
        url = reverse("api:posts-list")
        test_query_keys = ["courseid", "userid", "sortby", "descending", "limit"]
        test_query_values = {
            "courseid": list(range(1, COURSE_NUM_ENTRIES + 1)),
            "userid": list(range(1, USER_NUM_ENTRIES + 1)),
            "sortby": ["like_count", "star_count", "dislike_count"],
            "descending": [True, False],
            "limit": list(range(1, NOTE_NUM_ENTRIES + 1))
        }

        query_key_mapping = dict()
        query_key_mapping["courseid"] = "course"
        query_key_mapping["userid"] = "poster"

        # Perform 100 random query and test if the result is expected
        check_multi_query_v2(self, url, test_query_keys, test_query_values, query_key_mapping)

    def test_post_list_non_existing_filter(self):
        """
        Test if applying an extra filter will not affect the query
        :return:
        """
        url = reverse("api:posts-list")
        response = self.client.get(url, {"nonexisted": "Purdue"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), POST_NUM_ENTRIES)

    # DetailView/RetrieveView testing
    def test_post_retrieve(self):
        """
        Test accessing single post object
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-detail", kwargs=path_params)
        fields = ["course", "poster", "id", "created_at",
                  "last_edited", "last_answered", "like_count",
                  "star_count", "dislike_count", "title", "content",
                  "tags"]
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        obj = response.data
        check_fields(self, obj, fields)

    def test_post_retrieve_not_found(self):
        """
        Test accessing post object with invalid id
        expecting a 404 not found
        :return:
        """
        path_params = {"pk": POST_NUM_ENTRIES + 1}
        url = reverse("api:posts-detail", kwargs=path_params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

        path_params = {"pk": -1}
        url = reverse("api:posts-detail", kwargs=path_params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, get_packet_details(NotFound()))

    # TODO Rest of tests need to add permission check after introducing user
    # CreateView testing
    def test_post_create(self):
        """
        Test success create view and able to access via get
        :return:
        """
        url = reverse("api:posts-list")
        detail_url_name = "api:posts-detail"
        # Encode json field
        test_data = {'course': 1, 'title': 'Test post tile',
                     'content': 'Test content', 'tags': ["tags"]}

        check_post_success(self, url, detail_url_name, test_data, json_fields=["tags"], id_fields="post")

    def test_post_create_extra_field(self):
        """
        Test submit post request with extra field, should be ignored
        :return:
        """
        url = reverse("api:posts-list")
        detail_url_name = "api:posts-detail"
        # Encode json field
        test_data = {'course': 1, 'title': 'Test post tile',
                     'content': 'Test content', 'tags': ["tags"], "extra": "extra"}

        check_post_success(self, url, detail_url_name, test_data, json_fields=["tags"], ignore_fields=["extra"], id_fields="post")

    def test_post_create_invalid_missing_fields(self):
        """
        Test invalid form with missing fields, should raise 400 error
        :return:
        """
        url = reverse("api:posts-list")
        detail_url_name = "api:posts-detail"
        # Encode json field
        test_data = {'course': 1, 'title': 'Test post tile',
                     'content': 'Test content', 'tags': json.dumps(["tags"])}

        # Try 20 form submission with missing fields
        for _ in range(20):
            num_pair = random.randint(0, len(test_data.keys()) - 1)
            form_fields = random.sample(test_data.keys(), num_pair)
            form = {form_field: test_data[form_field] for form_field in form_fields}
            if "content" in form:
                # Since content is allow to be empty
                # Meaning at least one other field is missing
                check_post_error(self, url, form)

    def test_post_create_invalid_empty_fields(self):
        """
        Test empty fields (course_meta, title), should raise 400 error
        :return:
        """
        url = reverse("api:posts-list")
        detail_url_name = "api:posts-detail"
        # Encode json field
        test_data = {'course': 1, 'title': 'Test Post title',
                     'content': 'Test content', 'tags': json.dumps(["tags"])}

        # Test empty fields
        for key in test_data:
            if key == "content":
                continue
            form = test_data.copy()
            form[key] = ""
            check_post_error(self, url, form)

    def test_post_create_invalid_field_constraints(self):
        """
        Test field constraint, should raise InvalidForm exception
        :return:
        """
        url = reverse("api:posts-list")
        detail_url_name = "api:posts-detail"
        # Encode json field
        test_data = {'course': 1, 'title': 'Test note title',
                     'content': 'Test content', 'tags': json.dumps(["tags"])}

        form = test_data
        form["tags"] = "Not json"
        check_post_error(self, url, form, error_class=InvalidForm)

    # UpdateView testing
    def test_post_update(self):
        """
        Test successful update post
        :return:
        """
        detail_url_name = "api:posts-detail"
        path_params = {"pk": 1}
        test_data = {"title": "Changed", "content": "Changed Content", "tags": ["changed", "changed tag"]}
        time_test = datetime.now()

        data = check_put_success(self, detail_url_name, path_params, test_data)

        # Check if the last edited fields get updated as well
        url = reverse("api:posts-detail", kwargs={"pk": data["post"]})
        response = self.client.get(url)
        time_post = datetime.fromisoformat(response.data["last_edited"][:-1])
        time_diff_seconds = (time_post - time_test).total_seconds()
        self.assertLessEqual(time_diff_seconds, 10, msg=f"Overtime")
        self.assertLessEqual(0, time_diff_seconds, msg=f"Post gets updated back in time")

    def test_post_update_invalid_pk(self):
        """
        Test with invalid pk or post id, expecting errors
        :return:
        """
        detail_url_name = "api:posts-detail"
        test_data = {"title": "Changed Post title",
                     "content": "Changed Post Content", "tags": json.dumps(["changed", "changed tag"])}

        # Out of range
        path_params = {"pk": POST_NUM_ENTRIES + 1}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=NotFound)

        # Not an integer
        path_params = {"pk": 3.44}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=InvalidPathParam)

        # Not an integer
        path_params = {"pk": "I am invalid"}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=InvalidPathParam)

    def test_post_update_extra_field(self):
        """
        Test update post with extra field, which should be ignored
        :return:
        """
        detail_url_name = "api:posts-detail"
        path_params = {"pk": 1}
        test_data = {"title": "Changed", "content": "Changed Content",
                     "tags": ["changed", "changed tag"], "extra": "extra"}

        check_put_success(self, detail_url_name, path_params, test_data, ignore_fields=["extra"])

    def test_post_update_invalid_missing_field(self):
        """
        Test with missing fields, expecting 400 error
        :return:
        """
        detail_url_name = "api:posts-detail"
        path_params = {"pk": 1}
        test_data = {"title": "Changed", "content": "Changed Content",
                     "tags": json.dumps(["changed", "changed tag"])}

        # Try 20 form submission with missing fields
        check_put_missing_fields(self, detail_url_name, path_params, test_data, blank_fields=["content"], num_put=20)

    def test_post_update_invalid_field_constraint(self):
        """
        Test against form field constraint
        :return:
        """
        detail_url_name = "api:posts-detail"
        path_params = {"pk": 1}

        # Empty title
        form = {"title": "", "content": "Changed Content", "tags": json.dumps(["changed", "changed tag"])}
        check_put_error(self, detail_url_name, path_params, form, error_class=InvalidForm)

        # Not a json
        form = {"title": "Test", "content": "Changed Content", "tags": "Not json"}
        check_put_error(self, detail_url_name, path_params, form, error_class=InvalidForm)

    # DestroyView testing
    def test_post_destroy(self):
        """
        Test successful delete
        :return:
        """
        detail_url_name = "api:posts-detail"
        path_params = {"pk": 1}

        check_delete_success(self, detail_url_name, path_params)

    def test_post_destroy_invalid_not_existing(self):
        """
        Test invalid delete: out of range pk
        :return:
        """
        detail_url_name = "api:posts-detail"
        path_params = {"pk": 100}

        check_delete_error(self, detail_url_name, path_params)

    def test_post_destroy_invalid_path_params(self):
        """
        Test invalid delete: not an integer
        :return:
        """
        detail_url_name = "api:posts-detail"

        path_params = {"pk": 3.4}
        check_delete_error(self, detail_url_name, path_params, error_class=InvalidPathParam)

        path_params = {"pk": "Not an integer"}
        check_delete_error(self, detail_url_name, path_params, error_class=InvalidPathParam)

    """
    Begin invalid view testing/invalid http method
    PATCH should not be supported since PUT is enough and to prevent
    django rest framework automatic method on ModelViewSet
    """
    # PartialUpdateView testing
    def test_post_partial_update(self):
        """
        Partial update/PATCH not supported
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:posts-detail", kwargs=params)
        check_method_not_allowed(self, url, "PATCH")


class PostAnswerViewSetTests(APITestCase):
    """
    Viewset testcase for PostAnswerViewSet
    """

    fixtures = ['scheduler/test_coursemeta_simple.json',
                'scheduler/test_course_simple.json',
                'scheduler/test_post_simple.json',
                'scheduler/test_postanswer_simple.json',
                'user/test_user_simple.json',
                'user/test_student_simple.json']

    """
    Begin valid view testing
    Support list and retrieve (GET)
    """

    # ListView testing
    def test_post_answer_list_length(self):
        """
        Test if the returned list length matched with expected
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-answers", kwargs=path_params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), POST_ANSWER_NUM_ENTRIES_1)

    def test_post_answer_list_length_empty(self):
        """
        Test if the returned list length matched with expected
        Post 2 does not have post answer associated with,
        expecting empty list and 200 OK
        :return:
        """
        path_params = {"pk": 2}
        url = reverse("api:posts-answers", kwargs=path_params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_post_answer_list_format(self):
        """
        Test whether the objects in the returned list has the fields
        specified by the API documentation
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-answers", kwargs=path_params)
        fields = ["post", "postee", "created_at",
                  "last_edited", "like_count", "star_count",
                  "dislike_count", "content"]
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for obj in response.data:
            check_fields(self, obj, fields)

    def test_post_answer_list_invalid_post_id_out_of_range(self):
        """
        Test if provided incorrect pk the response will be not found
        :return:
        """
        path_params = {"pk": POST_NUM_ENTRIES + 1}
        url = reverse("api:posts-answers", kwargs=path_params)
        check_query_filter_error(self, url, error_class=NotFound)

        path_params = {"pk": -1}
        url = reverse("api:posts-answers", kwargs=path_params)
        check_query_filter_error(self, url, error_class=NotFound)

    def test_post_answer_list_invalid_post_id_not_integer(self):
        """
        Test if provided incorrect pk not following the constraint
        expecting InvalidPathParam error
        :return:
        """
        path_params = {"pk": 3.45}
        url = reverse("api:posts-answers", kwargs=path_params)
        check_query_filter_error(self, url, error_class=InvalidPathParam)

        path_params = {"pk": "I am not valid"}
        url = reverse("api:posts-answers", kwargs=path_params)
        check_query_filter_error(self, url, error_class=InvalidPathParam)

    def test_post_answer_single_filter_sortby_default(self):
        """
        Test default return order
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-answers", kwargs=path_params)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data, [])
        check_order(self, arr=response.data, key="like_count", descending=True)

    def test_post_answer_pair_filter_sortby_descending_possible_keys(self):
        """
        Check if sortby works for other valid options
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-answers", kwargs=path_params)
        sortby_options = ["like_count", "dislike_count", "star_count"]
        descending_options = [True, False]
        for sortby_option in sortby_options:
            for descending_option in descending_options:
                response = self.client.get(url, {"sortby": sortby_option, "descending": descending_option})
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertNotEqual(response.data, [])
                check_order(self, arr=response.data, key=sortby_option, descending=descending_option)

    def test_post_answer_pair_filter_sortby_descending_invalid(self):
        """
        Check whether sortby raise exception for invalid sortby or descending value
        Expecting 400 and raise InvalidQueryValue exception
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-answers", kwargs=path_params)
        test_sortby = "invalid"
        test_descending = "invalid"

        # Individual
        query_params_list = [
            {"sortby": test_sortby},
            {"descending": test_descending},
            {"sortby": test_sortby, "descending": True},
            {"sortby": "like_count", "descending": test_descending},
            {"sortby": test_sortby, "descending": test_descending}
        ]
        for query_params in query_params_list:
            check_query_filter_error(self, url, query_params, error_class=InvalidQueryValue)

    def test_post_answer_list_single_filter_limit(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-answers", kwargs=path_params)

        test_limit = POST_ANSWER_NUM_ENTRIES_1 - 1
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(test_limit, len(response.data))

    def test_post_answer_list_single_filter_limit_invalid_zero(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-answers", kwargs=path_params)

        # Test limit 0
        test_limit = 0
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_post_answer_list_single_filter_limit_invalid_negative(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-answers", kwargs=path_params)

        # Test limit -1
        test_limit = -1
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_post_answer_list_single_filter_limit_invalid_not_integer(self):
        """
        Prepopulated database with data
        Test whether the limit parameter is working
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-answers", kwargs=path_params)

        # Test limit float
        test_limit = 3.545
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

        # Test limit not a number
        test_limit = "limit?"
        response = self.client.get(url, {"limit": test_limit})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_packet_details(InvalidQueryValue()))

    def test_post_answer_list_multi_filter(self):
        """
        Test that the query param works for multiple query key
        :return:
        """
        url = reverse("api:posts-answers", kwargs={"pk": 1})
        test_query_keys = ["sortby", "descending", "limit"]
        test_query_values = {
            "sortby": ["like_count", "star_count", "dislike_count"],
            "descending": [True, False],
            "limit": list(range(1, POST_ANSWER_NUM_ENTRIES_1 + 1))
        }

        query_key_mapping = dict()

        # Perform 100 random query and test if the result is expected
        check_multi_query_v2(self, url, test_query_keys, test_query_values, query_key_mapping)

    def test_post_answer_list_non_existing_filter(self):
        """
        Test if applying an extra filter will not affect the query
        :return:
        """
        url = reverse("api:posts-answers", kwargs={"pk": 1})
        response = self.client.get(url, {"nonexisted": "Purdue"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), POST_ANSWER_NUM_ENTRIES_1)

    # DetailView/RetrieveView testing
    def test_post_answer_retrieve(self):
        """
        Test accessing single post answer object
        :return:
        """
        path_params = {"pk": 1, "answerid": 1}
        url = reverse("api:posts-detail-answer", kwargs=path_params)
        fields = ["post", "postee", "created_at",
                  "last_edited", "like_count", "star_count",
                  "dislike_count", "content"]
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        obj = response.data
        check_fields(self, obj, fields)

    def test_post_answer_retrieve_not_found(self):
        """
        Test accessing post object with invalid id
        expecting a 404 not found
        :return:
        """
        pk_list = [POST_NUM_ENTRIES + 1, -1, 1]
        answerid_list = [1, POST_ANSWER_NUM_ENTRIES_1 + 1, -1]
        for pk in pk_list:
            for answerid in answerid_list:
                path_params = {"pk": pk, "answerid": answerid}
                url = reverse("api:posts-detail-answer", kwargs=path_params)
                check_query_filter_error(self, url, error_class=NotFound)

    def test_post_answer_retrieve_invalid_not_link(self):
        """
        Test accessing a post answer id that does not point to the
        given post id, expecting 404 not found
        :return:
        """
        path_params = {"pk": 1, "answerid": 5}
        url = reverse("api:posts-detail-answer", kwargs=path_params)
        check_query_filter_error(self, url, error_class=NotFound)

    # TODO Rest of tests need to add permission check after introducing user
    # CreateView testing
    def test_post_answer_create(self):
        """
        Test success create view and able to access via get
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-answers", kwargs=path_params)
        detail_url_name = "api:posts-detail-answer"
        # Encode json field
        test_data = {'content': 'Test post content'}

        check_post_success(self, url, detail_url_name, test_data, json_fields=[], id_fields="answer",
                           detail_pk_name="answerid", detail_path_params=path_params)

    def test_post_answer_create_extra_field(self):
        """
        Test submit post request with extra field, should be ignored
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-answers", kwargs=path_params)
        detail_url_name = "api:posts-detail-answer"
        # Encode json field
        test_data = {'content': 'Test content', "extra": "extra"}

        check_post_success(self, url, detail_url_name, test_data, json_fields=[], ignore_fields=["extra"],
                           id_fields="answer", detail_pk_name="answerid", detail_path_params=path_params)

    def test_post_answer_create_invalid_missing_fields(self):
        """
        Test post request with missing field names
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-answers", kwargs=path_params)
        detail_url_name = "api:posts-detail-answer"
        # Encode json field
        test_data = {}

        check_post_error(self, url, test_data)

    def test_post_answer_create_invalid_empty_fields(self):
        """
        Test post request with empty field, expecting error since
        this is the only user enter field
        :return:
        """
        path_params = {"pk": 1}
        url = reverse("api:posts-answers", kwargs=path_params)
        detail_url_name = "api:posts-detail-answer"
        # Encode json field
        test_data = {'content': ''}

        check_post_error(self, url, test_data)

    # UpdateView testing
    def test_post_answer_update(self):
        """
        Test successful update post answer
        :return:
        """
        detail_url_name = "api:posts-detail-answer"
        path_params = {"pk": 1, "answerid": 1}
        test_data = {"content": "Changed Content"}
        time_test = datetime.now()

        check_put_success(self, detail_url_name, path_params, test_data, json_fields=[])

        # Check if the last edited fields get updated as well
        url = reverse("api:posts-detail-answer", kwargs=path_params)
        response = self.client.get(url)
        time_post_answer = datetime.fromisoformat(response.data["last_edited"][:-1])
        time_diff_seconds = (time_post_answer - time_test).total_seconds()
        self.assertLessEqual(time_diff_seconds, 10, msg=f"Overtime")
        self.assertLessEqual(0, time_diff_seconds, msg=f"Post answer gets updated back in time")

        # Check if the corresponding post last_answered field gets updated as well
        url = reverse("api:posts-detail", kwargs={"pk": 1})
        response = self.client.get(url)
        time_post = datetime.fromisoformat(response.data["last_answered"][:-1])

        # Check if the update time is within 10 second and note should be edited first
        time_diff_seconds = (time_post - time_post_answer).total_seconds()
        self.assertLessEqual(time_diff_seconds, 10, msg=f"Overtime")
        self.assertLessEqual(0, time_diff_seconds, msg=f"Post gets updated before answer")

    def test_post_answer_update_invalid_pk(self):
        """
        Test with invalid pk or answer id, expecting errors
        :return:
        """
        detail_url_name = "api:posts-detail-answer"
        test_data = {"content": "Changed answer Content"}

        # Out of range
        path_params = {"pk": 1, "answerid": POST_ANSWER_NUM_ENTRIES + 1}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=NotFound)

        # Mismatch
        path_params = {"pk": 1, "answerid": POST_ANSWER_NUM_ENTRIES_1 + 1}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=NotFound)

        # Not an integer
        path_params = {"pk": 1, "answerid": POST_ANSWER_NUM_ENTRIES_1 + 1}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=InvalidPathParam)

        # Not an integer
        path_params = {"pk": 1, "answerid": POST_ANSWER_NUM_ENTRIES_1 + 1}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=InvalidPathParam)

    def test_post_answer_update_extra_field(self):
        """
        Test update post answer with extra field, which should be ignored
        :return:
        """
        detail_url_name = "api:posts-detail-answer"
        path_params = {"pk": 1, "answerid": 1}
        test_data = {"content": "Changed Content", "extra": "extra"}

        check_put_success(self, detail_url_name, path_params, test_data, json_fields=[], ignore_fields=["extra"])

    def test_post_answer_update_invalid_missing_field(self):
        """
        Test update post answer with missing fields, expecting 400 InvalidForm
        :return:
        """
        detail_url_name = "api:posts-detail-answer"
        path_params = {"pk": 1, "answerid": 1}
        test_data = {}
        check_put_error(self, detail_url_name, path_params, test_data, error_class=InvalidForm)

    # DestroyView testing
    def test_post_answer_destroy(self):
        """
        Test successful delete
        :return:
        """
        detail_url_name = "api:posts-detail-answer"
        path_params = {"pk": 1, "answerid": 1}

        check_delete_success(self, detail_url_name, path_params)

    def test_post_answer_destroy_invalid_not_existing(self):
        """
        Test invalid delete: out of range pk
        :return:
        """
        detail_url_name = "api:posts-detail-answer"
        path_params = {"pk": 1, "answerid": 100}
        check_delete_error(self, detail_url_name, path_params)

    def test_post_answer_destroy_invalid_path_params(self):
        """
        Test invalid delete: not an integer, no linked
        :return:
        """
        detail_url_name = "api:posts-detail-answer"

        path_params = {"pk": 1, "answerid": 3.4}
        check_delete_error(self, detail_url_name, path_params, error_class=InvalidPathParam)

        path_params = {"pk": 1, "answerid": "Not an integer"}
        check_delete_error(self, detail_url_name, path_params, error_class=InvalidPathParam)

        path_params = {"pk": 1, "answerid": 5}
        check_delete_error(self, detail_url_name, path_params, error_class=NotFound)

    """
    Begin invalid view testing/invalid http method
    PATCH should not be supported since PUT is enough and to prevent
    django rest framework automatic method on ModelViewSet
    """
    # PartialUpdateView testing
    def test_post_answer_partial_update(self):
        """
        Partial update/PATCH not supported
        :return:
        """
        params = {"pk": 1, "answerid": 1}
        url = reverse("api:posts-detail-answer", kwargs=params)
        check_method_not_allowed(self, url, "PATCH")

    def test_post_answer_partial_update_no_match(self):
        """
        Partial update/PATCH not supported
        :return:
        """
        params = {"pk": 1, "answerid": 5}
        url = reverse("api:posts-detail-answer", kwargs=params)
        check_method_not_allowed(self, url, "PATCH")


# TODO Test permission
