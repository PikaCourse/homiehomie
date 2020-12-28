"""
Test cases testing again non-empty database view operations using fixtures loading
Perform operations on small dataset of few entries
"""

from django.shortcuts import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.exceptions import *
from scheduler.utils import *
from urllib.parse import urlencode
import random

COURSE_META_NUM_ENTRIES = 20
COURSE_NUM_ENTRIES = 22
QUESTION_NUM_ENTRIES = 6
NOTE_NUM_ENTRIES = 8
POST_NUM_ENTRIES = 4
POST_ANSWER_NUM_ENTRIES = 8


"""
Some helper functions to help testing
"""


def check_fields(test_case, obj, fields):
    for field in fields:
        test_case.assertTrue(field in obj)


def check_query_exact(test_case, url, test_dict):
    """
    Check for single query exact match
    :param test_case:
    :param url:
    :param test_dict:
    :return:
    """
    for filter_param in test_dict:
        filter_val = test_dict[filter_param]
        response = test_case.client.get(url, {filter_param: filter_val})

        test_case.assertEqual(response.status_code, status.HTTP_200_OK)
        test_case.assertNotEqual(response.data, [], msg=f"Query key: {filter_param}\tQuery value: {filter_val}")
        for obj in response.data:
            try:
                test_case.assertEqual(obj[filter_param], filter_val)
            except KeyError:
                test_case.assertEqual(obj["course_meta"][filter_param], filter_val)


def check_query_iexact(test_case, url, test_dict):
    """
    Check for single query case insensitive match
    :param test_case:
    :param url:
    :param test_dict:
    :return:
    """
    # Test Upper
    for filter_param in test_dict:
        filter_val = test_dict[filter_param].upper()
        response = test_case.client.get(url, {filter_param: filter_val})

        test_case.assertEqual(response.status_code, status.HTTP_200_OK)
        test_case.assertNotEqual(response.data, [],
                                 msg=f"Upper exact: Query key: {filter_param}\tQuery value: {filter_val}")
        for obj in response.data:
            try:
                test_case.assertEqual(str(obj[filter_param]).lower(), filter_val.lower())
            except KeyError:
                test_case.assertEqual(str(obj["course_meta"][filter_param]).lower(), filter_val.lower())

    # Test Lower
    for filter_param in test_dict:
        filter_val = test_dict[filter_param].lower()
        response = test_case.client.get(url, {filter_param: filter_val})

        test_case.assertEqual(response.status_code, status.HTTP_200_OK)
        test_case.assertNotEqual(response.data, [],
                                 msg=f"Lower exact: Query key: {filter_param}\tQuery value: {filter_val}")
        for obj in response.data:
            try:
                test_case.assertEqual(str(obj[filter_param]).lower(), filter_val.lower())
            except KeyError:
                test_case.assertEqual(str(obj["course_meta"][filter_param]).lower(), filter_val.lower())


def check_query_contains(test_case, url, test_dict):
    for filter_param in test_dict:
        filter_val = test_dict[filter_param][1:4]
        response = test_case.client.get(url, {filter_param: filter_val})

        test_case.assertEqual(response.status_code, status.HTTP_200_OK)
        test_case.assertNotEqual(response.data, [], msg=f"Query key: {filter_param}\tQuery value: {filter_val}")
        for obj in response.data:
            try:
                test_case.assertIn(filter_val, obj[filter_param])
            except KeyError:
                test_case.assertIn(filter_val, obj["course_meta"][filter_param])


def check_query_icontains(test_case, url, test_dict):
    for filter_param in test_dict:
        filter_val = test_dict[filter_param][1:4].lower()
        response = test_case.client.get(url, {filter_param: filter_val})

        test_case.assertEqual(response.status_code, status.HTTP_200_OK)
        test_case.assertNotEqual(response.data, [], msg=f"Query key: {filter_param}\tQuery value: {filter_val}")
        for obj in response.data:
            try:
                test_case.assertIn(filter_val.upper(), str(obj[filter_param]).upper())
            except KeyError:
                test_case.assertIn(filter_val.upper(), str(obj["course_meta"][filter_param]).upper())


def check_query_startswith(test_case, url, test_dict):
    for filter_param in test_dict:
        filter_val = test_dict[filter_param][:4]
        response = test_case.client.get(url, {filter_param: filter_val})

        test_case.assertEqual(response.status_code, status.HTTP_200_OK)
        test_case.assertNotEqual(response.data, [])
        for obj in response.data:
            try:
                test_case.assertIn(filter_val, str(obj[filter_param]))
            except KeyError:
                test_case.assertIn(filter_val, str(obj["course_meta"][filter_param]))

        filter_val = test_dict[filter_param][1:4]
        response = test_case.client.get(url, {filter_param: filter_val})

        test_case.assertEqual(response.status_code, status.HTTP_200_OK)
        test_case.assertListEqual([], response.data, msg=f"Query key: {filter_param}\tQuery value: {filter_val}")


def check_query_istartswith(test_case, url, test_dict):
    for filter_param in test_dict:
        filter_val = test_dict[filter_param][:4].lower()
        response = test_case.client.get(url, {filter_param: filter_val})

        test_case.assertEqual(response.status_code, status.HTTP_200_OK)
        test_case.assertNotEqual(response.data, [])
        for obj in response.data:
            try:
                test_case.assertIn(filter_val.upper(), str(obj[filter_param]).upper())
            except KeyError:
                test_case.assertIn(filter_val.upper(), str(obj["course_meta"][filter_param]).upper())

        filter_val = test_dict[filter_param][1:4].lower()
        response = test_case.client.get(url, {filter_param: filter_val})

        test_case.assertEqual(response.status_code, status.HTTP_200_OK)
        test_case.assertListEqual([], response.data, msg=f"Query key: {filter_param}\tQuery value: {filter_val}")


def check_multi_query(test_case, url, test_dict):
    # Perform 100 random query and test if the result is expected
    count = 0
    for _ in range(100):
        # Randomly select keys from the test_dict to perform query
        num_pair = random.randint(1, len(test_dict.keys()))
        query_keys = random.sample(test_dict.keys(), num_pair)
        query_params = {query_key: test_dict[query_key] for query_key in query_keys}
        query_params["limit"] = random.randint(1, 4)
        response = test_case.client.get(url, query_params)

        test_case.assertEqual(response.status_code, status.HTTP_200_OK)
        test_case.assertLessEqual(len(response.data), query_params["limit"])
        query_params.pop("limit")
        if response.data is not []:
            for obj in response.data:
                for query_key in query_params:
                    try:
                        test_case.assertIn(test_dict[query_key].lower(), str(obj[query_key]).lower())
                    except KeyError:
                        # If key not in the return object
                        test_case.assertIn(test_dict[query_key].lower(), str(obj["course_meta"][query_key]).lower())
        else:
            count += 1

    # Prevent returning all empty list
    # Still might have a tiny chance that all queries pick conflict each other
    # For instance, for a five keys dict with 1 key conflicts with other 2 keys
    # Each single time, the probability of conflict is 12/31 since only major might conflict
    # with college and name
    # After 100 passes, the probability that all of the passes are conflict is 6.052784633E-42
    # Which should be nearly impossible, assuming the pseudorandom algor is fairly uniform
    test_case.assertNotEqual(100, count)

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
        Prepopulated database with data and test if it can be search by school name
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
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data,
                         get_packet_details(MethodNotAllowed('POST')))

    # UpdateView testing
    def test_course_update(self):
        """
        Update/PUT not supported, should expect 405 method not allowed
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:courses-detail", kwargs=params)
        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data,
                         get_packet_details(MethodNotAllowed('PUT')))

    # PartialUpdateView testing
    def test_course_partial_update(self):
        """
        Update/PUT not supported, should expect 405 method not allowed
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:courses-detail", kwargs=params)
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data,
                         get_packet_details(MethodNotAllowed('PATCH')))

    # DestroyView testing
    def test_course_destroy(self):
        """
        Update/PUT not supported, should expect 405 method not allowed
        :return:
        """
        params = {"pk": 1}
        url = reverse("api:courses-detail", kwargs=params)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.data,
                         get_packet_details(MethodNotAllowed('DELETE')))


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
    # TODO Test empty db

    # TODO Test proper return object structure

    # TODO Test proper single filtering

    # TODO Test proper multiple filter constraint

    # TODO Test improper: nonexisting filter search

    # TODO Test improper: filter fields constraint

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
    # TODO Test empty db

    # TODO Test proper return object structure

    # TODO Test proper single filtering

    # TODO Test proper multiple filter constraint

    # TODO Test improper: nonexisting filter search

    # TODO Test improper: filter fields constraint
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

    # DetailView/RetrieveView testing

    # TODO Rest of tests need to add permission check after introducing user
    # CreateView testing

    # TODO Check adding note with question and course point to different coursemeta

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

    fixtures = ['scheduler/test_coursemeta_simple.json',
                'scheduler/test_course_simple.json',
                'scheduler/test_post_simple.json',
                'scheduler/test_post_answer_simple.json',
                'user/test_user_simple.json',
                'user/test_student_simple.json']

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
