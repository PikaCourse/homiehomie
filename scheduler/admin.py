from django.contrib import admin
from scheduler.models import *

# Register your models here.
admin.site.register(Schedule)
admin.site.register(CourseMeta)
admin.site.register(Course)
admin.site.register(Question)
admin.site.register(Note)
admin.site.register(Post)
admin.site.register(PostAnswer)
