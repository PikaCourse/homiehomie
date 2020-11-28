# Generated by Django 3.1.3 on 2020-11-28 02:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0008_auto_20201128_0224'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='capacity',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='course',
            name='professor',
            field=models.CharField(blank=True, default='', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='course',
            name='school',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='course',
            name='semester',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]