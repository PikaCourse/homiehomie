# Generated by Django 3.1.3 on 2020-11-27 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0003_auto_20201126_1816'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='course',
            field=models.CharField(default='', max_length=300),
        ),
    ]