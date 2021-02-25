"""
filename:    paginations.py
created at:  02/22/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Pagination classes for schedule
"""

from rest_framework.pagination import PageNumberPagination


class CourseMetaPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "limit"
    max_page_size = 500


class CoursePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "limit"
    max_page_size = 500


class TagPagination(PageNumberPagination):
    page_size = 200
    page_size_query_param = "limit"
    max_page_size = 2000


class PostPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = "limit"
    max_page_size = 500


class PostAnswerPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "limit"
    max_page_size = 500
