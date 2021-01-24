"""
filename:    utils.py
created at:  01/24/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Util functions
"""

from scheduler.models import Course, CourseMeta
from courseocean_webapi.course import GenericCourseAPI
from django_rq import job


@job('default')
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

    # Test if the course meta exist
    try:
        course_meta = CourseMeta.objects.get(title=course_title, school=school)
    except CourseMeta.DoesNotExist:
        return "course not found"

    # Test if the course meta have been updated recently
    if course_meta.update_recently():
        return "ignored"
    else:
        try:
            api_client = GenericCourseAPI(school)
        except AssertionError:
            return "assert fail, might not be implemented yet"
        for course_section in api_client.get_course_section(course_title, year, semester):
            # Find the course section existing in the database and update its information
            #  if cannot find any, insert as a new record

            # TODO What if a university delete a course section?

            # Get basic queryset of all sections belong to this course and the given term
            queryset = Course.objects.filter(course_meta_id=course_meta.id, year=year, semester=semester)

            course_section["course_meta_id"] = course_meta.id
            course_section.pop("title")  # title key not used

            # Update by reference
            if course_section["crn"] is not None:
                # Find and update by CRN, if not, create a new one
                queryset.update_or_create(defaults=course_section, crn=course_section["crn"])
            elif course_section["section"] is not None:
                # Find and update by section, if not, create a new one
                queryset.update_or_create(defaults=course_section, section=course_section["section"])
            else:
                raise Exception(f"No reference key existed for course {course_meta} sections")
        return "success"
