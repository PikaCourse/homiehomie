# Generated by Django 3.1.3 on 2020-12-25 17:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0004_post_last_answered'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='section',
            field=models.CharField(max_length=50, null=True),
        ),
    ]