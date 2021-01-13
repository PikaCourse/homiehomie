# Generated by Django 3.1.3 on 2021-01-13 02:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_student_is_verified'),
        ('scheduler', '0024_auto_20210112_0313'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wishlist',
            name='student',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='user.student'),
        ),
    ]