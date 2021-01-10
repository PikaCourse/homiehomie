from rest_framework import status
from rest_framework.exceptions import *
from scheduler.exceptions import *
from django.shortcuts import reverse
from urllib.parse import urlencode
from datetime import datetime
import json
import random

"""
Some helper functions to help testing
"""


def get_packet_details(exc):
    """
    Helper function in test to return the expected exception error packet
    :param exc: expected exception instance
    :return:
    """
    packet = dict()
    packet['code'] = exc.get_codes()
    packet['detail'] = str(exc.detail)
    packet['status'] = exc.status_code
    return packet


def check_fields(test_case, obj, fields):
    for field in fields:
        test_case.assertTrue(field in obj, msg=f"field name: {field}")


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
    """
    TODO Change to v2
    Perform a series of random query with valid keys and values
    and see if the returned results match with the given constraint
    :param test_case:   test_case instance
    :param url:         test list url
    :param test_dict:   test data
    :return:
    """
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


def check_multi_query_v2(test_case, url, test_query_keys, test_query_values, query_key_mapping, query_num=100):
    """
    V2 of checking multi query return result
    :param test_case:           test_case instance
    :param url:                 test list url
    :param test_query_keys:     possible query keys
    :param test_query_values:   all possible query values for the keys
    :param query_key_mapping:   dict mapping query key to field in return object for checking,
                                e.g. {"coursemetaid": "course_meta"}
                                key is the query key name and value is the object field match with query key
    :param query_num:           number of queries to perform
    :return:
    """

    count = 0
    for _ in range(query_num):
        # Randomly select keys from the test_dict to perform query
        num_pair = random.randint(1, len(test_query_keys))
        query_keys = random.sample(test_query_keys, num_pair)
        query_params = {}
        for query_key in query_keys:
            options = test_query_values[query_key]
            query_params[query_key] = options[random.randrange(len(options))]
        response = test_case.client.get(url, query_params)

        test_case.assertEqual(response.status_code, status.HTTP_200_OK)
        if "limit" in query_params:
            test_case.assertLessEqual(len(response.data), query_params["limit"])
        if response.data is not []:
            for obj in response.data:
                # Check field for each obj in returned list
                for field in query_key_mapping:
                    # iterate through keys that required matching check
                    if field in query_params:
                        # if the field is used in query
                        test_expected_val = query_params[field]
                        test_case.assertEqual(obj[query_key_mapping[field]], test_expected_val)
            # check order
            check_order(test_case, response.data,
                        query_params.get("sortby", "like_count"),
                        query_params.get("descending", True))
        else:
            count += 1
    test_case.assertNotEqual(count, query_num)


def check_query_filter_error(test_case, url, query_params=None, error_class=InvalidQueryValue):
    """
    Check if proper error is raised for a given get request
    :param test_case:
    :param url:
    :param query_params:
    :param error_class:
    :return:
    """
    response = test_case.client.get(url, query_params)
    test_case.assertEqual(response.status_code, error_class.status_code,
                          msg=f"URL: {url}\tQuery: {query_params}\t"
                              f"Data: {response.data}")
    test_case.assertEqual(response.data, get_packet_details(error_class()))


def check_order(test_case, arr, key, descending=True):
    prev_count = None
    pinned_list = []
    for obj in arr:
        if "is_pin" in obj and obj["is_pin"]:
            test_case.assertIsNone(prev_count, msg="Pinned question should come first in sequence")
            pinned_list.append(obj)
            continue
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

    # Pin order with less value should be in front place
    # meaning that the pinned list should be in ascending order
    prev_order = None
    for pinned_obj in pinned_list:
        if prev_order is None:
            prev_order = pinned_obj["pin_order"]
            continue
        else:
            cur_order = pinned_obj["pin_order"]
            test_case.assertLessEqual(cur_order, prev_order, msg=f"Key: pin_order\t"
                                                                 f"Prev: {prev_order}\tCur: {cur_order}")


def check_post_success(test_case, url, detail_url_name, test_data,
                       json_fields=("tags",), ignore_fields=[], id_fields="question",
                       detail_pk_name="pk", detail_path_params={}):
    """
    Create a post request and expect successful output
    :param test_case:           API test case instance
    :param url:                 Post URL
    :param detail_url_name:     Retrieve URL, will be used to check if the content created is correct
    :param test_data:           Test data/request content
    :param json_fields:         JSON field name list that need json encode
    :param ignore_fields:       Fields to ignore in retrieve object check, used to test if extra fields will not affect
                                post
    :param id_fields:           name of the returned object field that contain the pk of the created instance
    :param detail_pk_name:      Path pk to the instance
    :param detail_path_params:  Additional path param to be used by checker to verify the successful creation
                                of instance
    :return:
    """
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
    test_case.assertEqual(response.status_code, status.HTTP_201_CREATED,
                          msg=f"Message: {response.data}\tURL: {url}")
    post_result = response.data

    # Checker: Test if the post is successful
    id = response.data[id_fields]
    path_params = detail_path_params
    path_params[detail_pk_name] = id
    url = reverse(detail_url_name, kwargs=path_params)
    response = test_case.client.get(url)
    test_case.assertEqual(response.status_code, status.HTTP_200_OK)
    obj = response.data
    for key in test_data:
        if key in ignore_fields:
            continue
        test_case.assertEqual(obj[key], test_data[key], msg=f"Field: {key}")

    return post_result


def check_post_error(test_case, url, test_data, error_class=InvalidForm):
    """
    Expecting error on post submission
    Note anything in test_data that is json should be encoded first
    :param test_case:
    :param url:
    :param test_data:
    :param error_class:
    :return:
    """
    test_data = test_data.copy()
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
    put_result = response.data

    # Test if the put actually change the data
    response = test_case.client.get(url)
    test_case.assertEqual(response.status_code, status.HTTP_200_OK)
    obj = response.data
    for key in test_data:
        if key in ignore_fields:
            continue
        test_case.assertEqual(obj[key], test_data[key], msg=f"Field: {key}")

    return put_result


def check_put_error(test_case, detail_url_name=None, path_params={}, url=None, test_data={}, error_class=NotFound):
    """
    Expecting error on put submission
    :param test_case:
    :param detail_url_name:
    :param path_params:
    :param url:
    :param test_data:
    :param error_class:
    :return:
    """
    if url is None:
        url = reverse(detail_url_name, kwargs=path_params)

    test_form_encoded = urlencode(test_data)
    response = test_case.client.put(url,
                                    data=test_form_encoded,
                                    content_type='application/x-www-form-urlencoded')
    test_case.assertEqual(response.status_code, error_class.status_code, msg=f"Test Data: {test_data}\tURL: {url}")
    test_case.assertEqual(response.data, get_packet_details(error_class()), msg=f"Response: {response}\tURL: {url}")


def check_put_error_v2(test_case, detail_url_name=None, path_params={}, url=None, test_data={},
                       error_code="not_found", status_code=status.HTTP_404_NOT_FOUND):
    """
    Expecting error on put submission
    :param test_case:
    :param detail_url_name:
    :param path_params:
    :param url:
    :param test_data:
    :param error_code:
    :param status_code:
    :return:
    """
    if url is None:
        url = reverse(detail_url_name, kwargs=path_params)

    test_form_encoded = urlencode(test_data)
    response = test_case.client.put(url,
                                    data=test_form_encoded,
                                    content_type='application/x-www-form-urlencoded')
    test_case.assertEqual(response.status_code, status_code, msg=f"Test Data: {test_data}\tURL: {url}")
    test_case.assertEqual(response.data["code"], error_code, msg=f"Response: {response}\tURL: {url}")


def check_put_missing_fields(test_case, detail_url_name, path_params, test_data, blank_fields=("content",), num_put=20):
    """
    Perform `num_put` times put request with missing at least one of the field
    in the `test_data`, which should be valid

    :param test_case:
    :param detail_url_name:
    :param path_params:
    :param test_data:
    :param blank_fields:
    :param num_put:
    :return:
    """
    # Get a copy of valid test data and remove the blank fields
    # Since they are no use of this test
    test_data = test_data.copy()
    for blank_field in blank_fields:
        test_data.pop(blank_field)

    # Performing the put request
    count = 0
    for _ in range(num_put):
        # Randomly select a subset of fields to submit
        num_pair = random.randint(0, len(test_data.keys()) - 1)
        form_fields = random.sample(test_data.keys(), num_pair)
        form = {form_field: test_data[form_field] for form_field in form_fields}

        check_put_error(test_case, detail_url_name, path_params, test_data=form, error_class=InvalidForm)
        count += 1
    test_case.assertGreater(count, 0)


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


def check_delete_error(test_case, detail_url_name=None, path_params={}, url=None, error_class=NotFound):
    """
    Test unsuccessful delete
    :param test_case:
    :param detail_url_name:
    :param path_params:
    :param url:
    :param error_class:
    :return:
    """
    if url is None:
        url = reverse(detail_url_name, kwargs=path_params)

    # Perform delete operation
    response = test_case.client.delete(url)
    test_case.assertEqual(response.status_code, error_class.status_code)
    test_case.assertEqual(response.data, get_packet_details(error_class()), msg=f"URL: {url}")


def check_delete_error_v2(test_case, detail_url_name=None, path_params={}, url=None,
                          error_code="not_found", status_code=status.HTTP_404_NOT_FOUND):
    """
    Test unsuccessful delete with error specified as error code and status code
    :param test_case:
    :param detail_url_name:
    :param path_params:
    :param url:
    :param error_code:
    :param status_code:
    :return:
    """

    if url is None:
        url = reverse(detail_url_name, kwargs=path_params)
    # Perform delete operation
    response = test_case.client.delete(url)
    test_case.assertEqual(response.status_code, status_code)
    test_case.assertEqual(response.data["code"], error_code)


def check_method_not_allowed(test_case, url, method):
    """
    Check if proper exception is raised for not allowed HTTP methods
    :param test_case:
    :param url:
    :param method:
    :return:
    """
    if method == "GET":
        response = test_case.client.get(url)
    elif method == "POST":
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
