# Generated by Django 3.1.3 on 2020-11-28 02:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0006_auto_20201128_0215'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='college',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
