"""
filename:    filters.py
created at:  02/22/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Filters used by scheduler API
"""

from scheduler.models import *
from django_filters import rest_framework as filters


class CourseMetaFilter(filters.FilterSet):
    school = filters.CharFilter(lookup_expr="istartswith")
    major = filters.CharFilter(lookup_expr="istartswith")
    name = filters.CharFilter(lookup_expr="icontains")
    college = filters.CharFilter(lookup_expr="icontains")
    title = filters.CharFilter(lookup_expr="icontains")
    year = filters.NumberFilter(field_name="course__year", distinct=True)
    semester = filters.CharFilter(field_name="course__semester", distinct=True)


class CourseFilter(filters.FilterSet):
    school = filters.CharFilter(field_name="course_meta__school", lookup_expr="istartswith")
    major = filters.CharFilter(field_name="course_meta__major", lookup_expr="istartswith")
    name = filters.CharFilter(field_name="course_meta__name", lookup_expr="icontains")
    college = filters.CharFilter(field_name="course_meta__college", lookup_expr="icontains")
    title = filters.CharFilter(field_name="course_meta__title", lookup_expr="icontains")
    year = filters.NumberFilter(field_name="year")
    semester = filters.CharFilter(field_name="semester")
    crn = filters.CharFilter(lookup_expr="istartswith")
    professor = filters.CharFilter(lookup_expr="istartswith")


class PostFilter(filters.FilterSet):
    pass
