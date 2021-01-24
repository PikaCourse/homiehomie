"""
filename:    utils.py
created at:  01/24/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Util functions
"""

from scheduler.models import Course, CourseMeta
import sys


def update_course(school, course_title, year, semester):
    """
    Update course instance in the database via wrapper apis function to help
    keeping course information update to date

    :param school:
    :param course_title:
    :param year:
    :param semester:
    :return:
    """