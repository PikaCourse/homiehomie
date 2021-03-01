"""
filename:    test_model.py
created at:  01/9/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Test the functions related to user model
"""

from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from user.models import Student


class StudentModelTests(APITestCase):
    """
    Model testcase for Student model
    """

    def test_student_created_on_new_user(self):
        """
        Test if a student record is created properly
         when a new user is created
        :return:
        """

        # Check that the initial db student instance count
        old_count = Student.objects.count()
        expected_count = old_count + 1
        user = User.objects.create_user(username="tester", password="password")
        count = Student.objects.count()
        self.assertEqual(count, expected_count, msg=f"Mismatch between student count: Expecting: {expected_count}\t"
                                                    f"Actual: {count}")
        # Get the student list, assert only one student and matched id
        student_set = Student.objects.filter(user_id=user.id)
        self.assertEqual(student_set.count(), 1, msg=f"Multiple new students created while expecting one")

        student = student_set[0]
        self.assertEqual(student.user_id, user.id, msg=f"Mismatched user id: Expecting: {user.id}\t"
                                                       f"Actual: {student.user_id}")

