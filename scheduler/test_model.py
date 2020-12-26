from django.test import TestCase
from django.shortcuts import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from urllib.parse import urlencode
from scheduler.models import *
import json

# Create your tests here.


# Test model methods
# None have for now
class CourseMetaModelTests(APITestCase):
    pass


class CourseModelTests(APITestCase):
    pass


class QuestionModelTests(APITestCase):
    pass


class NoteModelTests(APITestCase):
    pass


class PostModelTests(APITestCase):
    pass


class PostAnswerModelTests(APITestCase):
    pass