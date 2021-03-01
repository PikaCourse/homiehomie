"""
filename:    filters.py
created at:  02/28/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Filter control for user module
"""

from django_filters import rest_framework as filters


class NotificationFilter(filters.FilterSet):
    is_read = filters.BooleanFilter()
    order_by = filters.OrderingFilter(
        fields=(
            ("created_at", "created_at"),
        )
    )