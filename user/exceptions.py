"""
filename:    exceptions.py
created at:  01/7/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Custom exceptions for user views
"""

from django.utils.encoding import force_str
from django.utils.translation import gettext_lazy as _
from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException, ErrorDetail
from rest_framework import status
