"""
filename:    paginations.py
created at:  02/28/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Paging control for user module
"""

from rest_framework.pagination import PageNumberPagination


class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "limit"
    max_page_size = 500
