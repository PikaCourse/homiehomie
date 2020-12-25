from django.db import models

# from django.contrib.auth.models import User
from homiehomie.user.models import Student


# Create your models here.
class CourseMeta(models.Model):
    """
    Course meta data model

    Fields explanation:
    major:          Course major name
    college:        Course providing college
    title:          Course title
    name:           Course name
    credit_hours:   Course credit hours
    school:         Course provider
    description:    Course description
    tags:           User tagging

    Example data record:
    major:          CS
    college:        College of Science
    title:          CS 38100
    name:           Algorithm
    credit_hours:   3
    school:         Purdue University
    description:    Doing some algorithms
    tags:           ["hard", "interesting", "time-consuming", "math"]
    """
    created_at = models.DateTimeField(auto_now_add=True)
    major = models.CharField(max_length=100, default="", null=True)
    college = models.CharField(max_length=100, null=True, blank=True)
    title = models.CharField(max_length=300, default="")
    name = models.CharField(max_length=300, default="")
    credit_hours = models.IntegerField(default=0)
    school = models.CharField(max_length=100)
    description = models.CharField(max_length=2048, default="empty course description", blank=True, null=True)
    tags = models.JSONField(default=list, blank=True, null=True)

    def __str__(self):
        return "_".join([self.school, self.title, self.name])


class Course(models.Model):
    """
    Course data model

    Fields explanation:
    course_meta:    Many to one mapping to course meta info
    crn:            Course registration number, only number that identified course in a school
    time:           Course time period, in form of array of JSON containing weekday (0~6),
                    start_at (HH:MM), end_at (HH:MM)
    type:           Course type: lecture, lab, recitation, research, online, other
    professor:      Course instructor
    year:           Course providing year
    semester:       Course providing semester, possible value: spring, fall, summer
    location:       Course classroom location
    capacity:       Course classroom capacity


    Example Data record:
    course_meta:    1
    crn:            13247-LE1
    time:           [
                        {
                            "weekday": 1,   // Tue
                            "start_at": "13:30",
                            "end_at": "14:45"
                        },
                        {
                            "weekday": 3,   // Thursday
                            "start_at": "13:30",
                            "end_at": "14:45"
                        }
                    ]
    type:           lecture
    professor:      Tester Test
    year:           2020
    semester:       fall
    location:       ARMS-124
    capacity:       100
    """
    course_meta = models.ForeignKey(CourseMeta, on_delete=models.CASCADE, default=-1)
    created_at = models.DateTimeField(auto_now_add=True)
    crn = models.CharField(max_length=50, default="", null=True)
    time = models.JSONField(default=list, blank=True, null=True)
    section = models.CharField(max_length=50, null=True)
    type = models.CharField(max_length=10, default="lecture")
    professor = models.CharField(max_length=100, default="", null=True, blank=True)
    year = models.DecimalField(max_digits=4, decimal_places=0, default=2020)
    semester = models.CharField(max_length=20, null=True, blank=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    capacity = models.IntegerField(default=0, null=True, blank=True)

    def __str__(self):
        return "_".join([str(self.year), str(self.semester), str(self.course_meta)])


class Question(models.Model):
    """
    Question Data model
    course_meta:    Course meta this question is referred to
    created_at:     The time this question is created
    created_by:     The user who create the question
    last_edited:    The most recent time this question is edited
    last_answered:  The most recent time this question is answered
    like_count:     Like count
    star_count:     Star/favorite count
    dislike_count:  Dislike count
    is_pin:         Is this question pinned by admin?
    pin_order:      Dictate the order of the question, 0 is the first element
    title:          Question text
    tags:           User tagging
    """
    course_meta = models.ForeignKey(CourseMeta, on_delete=models.PROTECT, default=-1)    # Prevent deleting course object
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(Student, on_delete=models.PROTECT)
    last_edited = models.DateTimeField(auto_now_add=True)
    last_answered = models.DateTimeField(auto_now_add=True)
    like_count = models.IntegerField(default=0)
    star_count = models.IntegerField(default=0)
    dislike_count = models.IntegerField(default=0)
    is_pin = models.BooleanField(default=False)
    pin_order = models.IntegerField(default=0)
    title = models.CharField(max_length=200)
    tags = models.JSONField(default=list, blank=True)

    def __str__(self):
        return "_".join([str(self.course_meta), self.title])


# TODO Enable referring to past editing via git?
class Note(models.Model):
    """
    Share note Data model
    course:         Course this note is referred to
    question:       Question this note is referred to
    created_at:     The time this question is created
    created_by:     The user who create the question
    last_edited:    The most recent time this note is edited
    like_count:     Like count
    star_count:     Star/favorite count
    dislike_count:  Dislike count
    title:          Note title
    content:        Note content in markdown
    tags:           User tagging
    """
    course = models.ForeignKey(Course, on_delete=models.PROTECT)    # Prevent deleting course object
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(Student, on_delete=models.PROTECT)
    last_edited = models.DateTimeField(auto_now_add=True)
    like_count = models.IntegerField(default=0)
    star_count = models.IntegerField(default=0)
    dislike_count = models.IntegerField(default=0)
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)    # In markdown
    tags = models.JSONField(default=list, blank=True)

    def __str__(self):
        return "_".join([str(self.course), self.question.title, self.title])


class Post(models.Model):
    """
    Post Data model
    course:         Course this note is referred to
    poster:         User that post this post
    created_at:     The time this post is created
    last_edited:    The most recent time this post is edited
    last_answered:  The most recent time this post is answered
    like_count:     Like count
    star_count:     Star/favorite count
    dislike_count:  Dislike count
    title:          Post title
    content:        Post content in markdown
    tags:           User tagging
    """
    course = models.ForeignKey(Course, on_delete=models.PROTECT)    # Prevent deleting course object
    poster = models.ForeignKey(Student, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    last_edited = models.DateTimeField(auto_now_add=True)
    last_answered = models.DateTimeField(auto_now_add=True)
    like_count = models.IntegerField(default=0)
    star_count = models.IntegerField(default=0)
    dislike_count = models.IntegerField(default=0)
    title = models.CharField(max_length=200)
    content = models.TextField()  # In markdown
    tags = models.JSONField(default=list, blank=True)

    def __str__(self):
        return "_".join([str(self.course), self.title])


class PostAnswer(models.Model):
    """
    Post answer/followup Data model
    post:           Post this answer is referred to
    postee:         User that answer the post
    created_at:     The time this answer is created
    last_edited:    The most recent time this answer is edited
    like_count:     Like count
    star_count:     Star/favorite count
    dislike_count:  Dislike count
    content:        Post answer content in markdown
    tags:           User tagging
    """
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    postee = models.ForeignKey(Student, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    last_edited = models.DateTimeField(auto_now_add=True)
    like_count = models.IntegerField(default=0)
    star_count = models.IntegerField(default=0)
    dislike_count = models.IntegerField(default=0)
    content = models.TextField()  # In markdown

    def __str__(self):
        return "_".join([str(self.post), str(self.postee)])


class Schedule(models.Model):
    """
    Course scheduled created by USER
    user:           User creating this schedule
    created_at:     The time this schedule is created
    last_edited:    The most recent time this schedule is edited
    is_star:        Is this schedule starred by user?
    year:           Year of the schedule for
    semester:       Semester of the schedule
    name:           Name of the schedule
    note:           Note of the schedule
    tags:           User tagging

    coursesid:      Access all the courses in this schedule via id array
    """
    user = models.ForeignKey(Student, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    last_edited = models.DateTimeField(auto_now_add=True)
    is_star = models.BooleanField(default=False)
    year = models.DecimalField(max_digits=4, decimal_places=0, default=2020)
    semester = models.CharField(max_length=20)
    name = models.CharField(max_length=200)
    note = models.TextField()
    coursesid = models.JSONField(default=list)
    tags = models.JSONField(default=list, blank=True)

    def __str__(self):
        return str(self.user) + "_" + str(self.year) + "_" + self.semester + "_" + self.name


