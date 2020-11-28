# Generated by Django 3.1.3 on 2020-11-28 02:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0005_course_location'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='department',
        ),
        migrations.AddField(
            model_name='course',
            name='capacity',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='course',
            name='college',
            field=models.CharField(blank=True, default='', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='course',
            name='credit_hours',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='course',
            name='type',
            field=models.CharField(default='lecture', max_length=10),
        ),
        migrations.AlterField(
            model_name='course',
            name='location',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='course',
            name='tags',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AlterField(
            model_name='course',
            name='time',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
        migrations.AlterField(
            model_name='note',
            name='tags',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AlterField(
            model_name='post',
            name='tags',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AlterField(
            model_name='question',
            name='tags',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='tags',
            field=models.JSONField(blank=True, default=list),
        ),
    ]