# Generated by Django 3.1.3 on 2020-12-25 21:02

from django.db import migrations, models
import user.models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_auto_20201225_2102'),
        ('scheduler', '0005_course_section'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='created_by',
            field=models.ForeignKey(on_delete=models.SET(user.models.Student.get_sentinel_user), to='user.student'),
        ),
        migrations.AlterField(
            model_name='post',
            name='poster',
            field=models.ForeignKey(on_delete=models.SET(user.models.Student.get_sentinel_user), to='user.student'),
        ),
        migrations.AlterField(
            model_name='postanswer',
            name='postee',
            field=models.ForeignKey(on_delete=models.SET(user.models.Student.get_sentinel_user), to='user.student'),
        ),
        migrations.AlterField(
            model_name='question',
            name='created_by',
            field=models.ForeignKey(on_delete=models.SET(user.models.Student.get_sentinel_user), to='user.student'),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='user',
            field=models.ForeignKey(on_delete=models.SET(user.models.Student.get_sentinel_user), to='user.student'),
        ),
    ]
