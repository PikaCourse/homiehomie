# Generated by Django 3.1.3 on 2020-11-27 19:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0004_course_course'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='location',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]