# Generated by Django 3.1.3 on 2020-12-24 04:06

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0003_question_last_edited'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='last_answered',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
