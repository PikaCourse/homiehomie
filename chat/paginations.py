"""
filename:    paginations.py
created at:  02/6/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Paginator for chat application
"""

from rest_framework.pagination import PageNumberPagination


class ChatHistoryPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = "page_size"
    max_page_size = 500

