# Generated by Django 3.1.3 on 2021-02-23 04:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0032_auto_20210223_0404'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='name',
            field=models.CharField(max_length=20, unique=True),
        ),
    ]
