# Generated by Django 3.1.3 on 2021-02-24 02:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0034_auto_20210224_0246'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schedule',
            name='last_edited',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='wishlist',
            name='last_edited',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
