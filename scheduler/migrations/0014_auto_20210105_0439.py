# Generated by Django 3.1.3 on 2021-01-05 04:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0013_auto_20210105_0123'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='title',
            field=models.CharField(default=None, max_length=200, null=True),
        ),
    ]
