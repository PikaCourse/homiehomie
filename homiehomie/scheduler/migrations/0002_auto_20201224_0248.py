# Generated by Django 3.1.3 on 2020-12-24 02:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
        ('scheduler', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseMeta',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('major', models.CharField(default='', max_length=100, null=True)),
                ('college', models.CharField(blank=True, max_length=100, null=True)),
                ('title', models.CharField(default='', max_length=300)),
                ('name', models.CharField(default='', max_length=300)),
                ('credit_hours', models.IntegerField(default=0)),
                ('school', models.CharField(max_length=100)),
                ('description', models.CharField(blank=True, default='empty course description', max_length=2048, null=True)),
                ('tags', models.JSONField(blank=True, default=list, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('last_edited', models.DateTimeField(auto_now_add=True)),
                ('like_count', models.IntegerField(default=0)),
                ('star_count', models.IntegerField(default=0)),
                ('dislike_count', models.IntegerField(default=0)),
                ('title', models.CharField(max_length=200)),
                ('content', models.TextField()),
                ('tags', models.JSONField(blank=True, default=list)),
            ],
        ),
        migrations.RemoveField(
            model_name='course',
            name='major',
        ),
        migrations.RemoveField(
            model_name='course',
            name='name',
        ),
        migrations.AddField(
            model_name='course',
            name='capacity',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AddField(
            model_name='course',
            name='crn',
            field=models.CharField(default='', max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='course',
            name='location',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='course',
            name='professor',
            field=models.CharField(blank=True, default='', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='course',
            name='semester',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='course',
            name='time',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
        migrations.AddField(
            model_name='course',
            name='type',
            field=models.CharField(default='lecture', max_length=10),
        ),
        migrations.AddField(
            model_name='course',
            name='year',
            field=models.DecimalField(decimal_places=0, default=2020, max_digits=4),
        ),
        migrations.CreateModel(
            name='Schedule',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('last_edited', models.DateTimeField(auto_now_add=True)),
                ('is_star', models.BooleanField(default=False)),
                ('year', models.DecimalField(decimal_places=0, default=2020, max_digits=4)),
                ('semester', models.CharField(max_length=20)),
                ('name', models.CharField(max_length=200)),
                ('note', models.TextField()),
                ('coursesid', models.JSONField(default=list)),
                ('tags', models.JSONField(blank=True, default=list)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.student')),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('last_answered', models.DateTimeField(auto_now_add=True)),
                ('like_count', models.IntegerField(default=0)),
                ('star_count', models.IntegerField(default=0)),
                ('dislike_count', models.IntegerField(default=0)),
                ('is_pin', models.BooleanField(default=False)),
                ('pin_order', models.IntegerField(default=0)),
                ('title', models.CharField(max_length=200)),
                ('tags', models.JSONField(blank=True, default=list)),
                ('course_meta', models.ForeignKey(default=-1, on_delete=django.db.models.deletion.PROTECT, to='scheduler.coursemeta')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='user.student')),
            ],
        ),
        migrations.CreateModel(
            name='PostAnswer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('last_edited', models.DateTimeField(auto_now_add=True)),
                ('like_count', models.IntegerField(default=0)),
                ('star_count', models.IntegerField(default=0)),
                ('dislike_count', models.IntegerField(default=0)),
                ('content', models.TextField()),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='scheduler.post')),
                ('postee', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='user.student')),
            ],
        ),
        migrations.AddField(
            model_name='post',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='scheduler.course'),
        ),
        migrations.AddField(
            model_name='post',
            name='poster',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='user.student'),
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('last_edited', models.DateTimeField(auto_now_add=True)),
                ('like_count', models.IntegerField(default=0)),
                ('star_count', models.IntegerField(default=0)),
                ('dislike_count', models.IntegerField(default=0)),
                ('title', models.CharField(max_length=200)),
                ('content', models.TextField(blank=True)),
                ('tags', models.JSONField(blank=True, default=list)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='scheduler.course')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='user.student')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='scheduler.question')),
            ],
        ),
        migrations.AddField(
            model_name='course',
            name='course_meta',
            field=models.ForeignKey(default=-1, on_delete=django.db.models.deletion.CASCADE, to='scheduler.coursemeta'),
        ),
    ]