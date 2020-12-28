from django.utils.encoding import force_str
from django.utils.translation import gettext_lazy as _
from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException, ErrorDetail
from rest_framework import status


def custom_exception_hdr(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        response.data['status'] = response.status_code
        response.data['code'] = response.data['detail'].code
        response.data['detail'] = str(response.data['detail'])
    return response


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


class InvalidFormKey(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'invalid_key'
    default_detail = 'Invalid form key'

    def __init__(self, detail=None, code=None):
        if detail is not None:
            self.detail = force_str(detail)
        super().__init__(detail, code)
