# Generated by Django 3.1.3 on 2021-01-12 03:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0023_schedule_events'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schedule',
            name='courses',
            field=models.ManyToManyField(blank=True, to='scheduler.Course'),
        ),
    ]
