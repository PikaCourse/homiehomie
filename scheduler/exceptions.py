from django.utils.encoding import force_str
from django.utils.translation import gettext_lazy as _
from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException, ErrorDetail, ValidationError
from rest_framework import status


def custom_exception_hdr(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        # Validation error handled differently
        if isinstance(exc, ValidationError):
            for field in response.data:
                response.data[field] = map(str, response.data[field])
            response.data['status'] = response.status_code
            response.data['code'] = "valid_error"
        else:
            response.data['status'] = response.status_code
            response.data['code'] = response.data['detail'].code
            response.data['detail'] = str(response.data['detail'])
    return response


class InvalidForm(APIException):
    """
    Raise when the submitted form is invalid
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'invalid_form'
    default_detail = 'Invalid form'

    def __init__(self, detail=None, code=None):
        if detail is not None:
            self.detail = force_str(detail)
        super().__init__(detail, code)


class InvalidPathParam(APIException):
    """
    Raise when the path parameters does not meet with specification
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'invalid_path'
    default_detail = 'Invalid path param'

    def __init__(self, detail=None, code=None):
        if detail is not None:
            self.detail = force_str(detail)
        super().__init__(detail, code)


class InvalidQueryValue(APIException):
    """
    Raise when the query value not matched with validation
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'invalid_value'
    default_detail = 'Invalid query value'

    def __init__(self, detail=None, code=None):
        if detail is not None:
            self.detail = force_str(detail)
        super().__init__(detail, code)


class MissingQueryKey(APIException):
    """
    Raise when a required key is missing for query
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'miss_key'
    default_detail = 'Missing required query key'

    def __init__(self, detail=None, code=None):
        if detail is not None:
            self.detail = force_str(detail)
        super().__init__(detail, code)
