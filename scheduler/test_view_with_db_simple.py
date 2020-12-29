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
import json
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


def check_order(test_case, arr, key, descending=True):
    prev_count = None
    for obj in arr:
        if prev_count is None:
            prev_count = obj[key]
            continue
        else:
            cur_count = obj[key]
            if descending:
                test_case.assertLessEqual(cur_count, prev_count, msg=f"Key: {key}\tdescending: {descending}\t"
                                                                     f"Prev: {prev_count}\tCur: {cur_count}")
            else:
                test_case.assertGreaterEqual(cur_count, prev_count, msg=f"Key: {key}\tdescending: {descending}\t"
                                                                     f"Prev: {prev_count}\tCur: {cur_count}")
            prev_count = cur_count


def check_post_success(test_case, url, detail_url_name, test_data, json_fields=("tags",), ignore_fields=[]):
    test_data = test_data.copy()
    # Encode any json fields
    for json_field in json_fields:
        test_data[json_field] = json.dumps(test_data[json_field])
    test_data_encoded = urlencode(test_data)
    # Decode for assertion
    for json_field in json_fields:
        test_data[json_field] = json.loads(test_data[json_field])

    # Send post
    response = test_case.client.post(url,
                                data=test_data_encoded,
                                content_type='application/x-www-form-urlencoded')
    # Assert code and msg
    test_case.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=f"Message: {response.data}")

    # Test if the post is successful
    id = response.data["question"]
    path_params = {"pk": id}
    url = reverse(detail_url_name, kwargs=path_params)
    response = test_case.client.get(url)
    test_case.assertEqual(response.status_code, status.HTTP_200_OK)
    obj = response.data
    for key in test_data:
        if key in ignore_fields:
            continue
        test_case.assertEqual(obj[key], test_data[key], msg=f"Field: {key}")


def check_post_error(test_case, url, test_data, error_class=InvalidForm):
    """
    Expecting error on post submission
    :param test_case:
    :param url:
    :param test_data:
    :param error_class:
    :return:
    """
    test_form_encoded = urlencode(test_data)
    response = test_case.client.post(url,
                                data=test_form_encoded,
                                content_type='application/x-www-form-urlencoded')
    test_case.assertEqual(response.status_code, error_class.status_code, msg=f"Test Data: {test_data}")
    test_case.assertEqual(response.data, get_packet_details(error_class()))


def check_put_success(test_case, detail_url_name, path_params, test_data, json_fields=("tags",), ignore_fields=[]):
    """
    Create a successful put request
    :param test_case:
    :param detail_url_name:
    :param pk:
    :param test_data:
    :param json_fields:
    :param ignore_fields:
    :return:
    """
    url = reverse(detail_url_name, kwargs=path_params)
    test_data = test_data.copy()
    # Encode any json fields
    for json_field in json_fields:
        test_data[json_field] = json.dumps(test_data[json_field])
    test_data_encoded = urlencode(test_data)
    # Decode for assertion
    for json_field in json_fields:
        test_data[json_field] = json.loads(test_data[json_field])

    # Send put request
    response = test_case.client.put(url,
                                    data=test_data_encoded,
                                    content_type='application/x-www-form-urlencoded')

    # Assert code and msg
    test_case.assertEqual(response.status_code, status.HTTP_200_OK, msg=f"Message: {response.data}")

    # Test if the put actually change the data
    response = test_case.client.get(url)
    test_case.assertEqual(response.status_code, status.HTTP_200_OK)
    obj = response.data
    for key in test_data:
        if key in ignore_fields:
            continue
        test_case.assertEqual(obj[key], test_data[key], msg=f"Field: {key}")


def check_put_error(test_case, detail_url_name, path_params, test_data, error_class=NotFound):
    """
    Expecting error on post submission
    :param test_case:
    :param detail_url_name:
    :param path_params:
    :param test_data:
    :param error_class:
    :return:
    """
    url = reverse(detail_url_name, kwargs=path_params)
    test_form_encoded = urlencode(test_data)
    response = test_case.client.put(url,
                                    data=test_form_encoded,
                                    content_type='application/x-www-form-urlencoded')
    test_case.assertEqual(response.status_code, error_class.status_code, msg=f"Test Data: {test_data}")
    test_case.assertEqual(response.data, get_packet_details(error_class()))


def check_delete_success(test_case, detail_url_name, path_params):
    """
    Test successful delete
    :param test_case:
    :param detail_url_name:
    :param path_params:
    :return:
    """
    url = reverse(detail_url_name, kwargs=path_params)

    # Make sure the instance is in the db
    response = test_case.client.get(url)
    test_case.assertEqual(response.status_code, status.HTTP_200_OK)

    # Perform delete operation
    response = test_case.client.delete(url)
    test_case.assertEqual(response.status_code, status.HTTP_200_OK)

    # Check db via get to see if the instance is deleted
    response = test_case.client.get(url)
    test_case.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


def check_delete_error(test_case, detail_url_name, path_params, error_class=NotFound):
    """
    Test unsuccessful delete
    :param test_case:
    :param detail_url_name:
    :param path_params:
    :return:
    """
    url = reverse(detail_url_name, kwargs=path_params)

    # Perform delete operation
    response = test_case.client.delete(url)
    test_case.assertEqual(response.status_code, error_class.status_code)
    test_case.assertEqual(response.data, get_packet_details(error_class()))


def check_method_not_allowed(test_case, url, method):
    """
    Check if proper exception is raised for not allowed HTTP methods
    :param test_case:
    :param url:
    :param method:
    :return:
    """
    if method == "POST":
        response = test_case.client.post(url)
    elif method == "PUT":
        response = test_case.client.put(url)
    elif method == "PATCH":
        response = test_case.client.patch(url)
    elif method == "DELETE":
        response = test_case.client.delete(url)
    else:
        raise ValueError(f"Invalid HTTP method name: {method}")
    test_case.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
    test_case.assertEqual(response.data,
                          get_packet_details(MethodNotAllowed(method)))

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

        # Perform 100 random query and test if the result is expected
        count = 0
        for _ in range(100):
            # Randomly select keys from the test_dict to perform query
            num_pair = random.randint(1, len(test_query_keys))
            query_keys = random.sample(test_query_keys, num_pair)
            query_params = {}
            for query_key in query_keys:
                options = test_query_values[query_key]
                query_params[query_key] = options[random.randrange(len(options))]
            response = self.client.get(url, query_params)

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            if "limit" in query_params:
                self.assertLessEqual(len(response.data), query_params["limit"])
            if response.data is not []:
                # Check course meta id
                if "coursemetaid" in query_params:
                    test_meta_id = query_params["coursemetaid"]
                    for obj in response.data:
                        self.assertEqual(obj["course_meta"], test_meta_id)
                # check order
                check_order(self, response.data,
                            query_params.get("sortby", "like_count"),
                            query_params.get("descending", True))
            else:
                count += 1

    def test_question_list_non_existing_filter(self):
        """
        Since there are 20 entries in the fixtures, expected 20 entries
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
                     'tags': []}

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

    # UpdateView testing
    def test_question_update(self):
        """
        Test successful update question
        :return:
        """
        detail_url_name = "api:questions-detail"
        path_params = {"pk": 1}
        test_data = {"title": "Changed", "tags": ["changed", "changed tag"]}

        check_put_success(self, detail_url_name, path_params, test_data)

    def test_question_update_invalid_pk(self):
        """
        Test with invalid pk or question id, expect errors
        :return:
        """
        detail_url_name = "api:questions-detail"
        test_data = {"title": "Changed", "tags": ["changed", "changed tag"]}

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
        test_data = {"title": "Changed", "tags": ["changed", "changed tag"]}

        # Try 20 form submission with missing fields
        for _ in range(20):
            num_pair = random.randint(0, len(test_data.keys()) - 1)
            form_fields = random.sample(test_data.keys(), num_pair)
            form = {form_field: test_data[form_field] for form_field in form_fields}

            check_put_error(self, detail_url_name, path_params, form, error_class=InvalidForm)

    def test_question_update_invalid_field_constraint(self):
        """
        Test against form field constraint
        :return:
        """
        detail_url_name = "api:questions-detail"
        path_params = {"pk": 1}

        # Empty title
        form = {"title": "", "tags": ["changed", "changed tag"]}
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
