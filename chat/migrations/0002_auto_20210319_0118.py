# Generated by Django 3.1.3 on 2021-03-19 01:18

from django.db import migrations, models
import django.db.models.deletion
import user.models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_auto_20210301_0351'),
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='coursechatmessage',
            name='course_meta',
        ),
        migrations.RenameModel(
            old_name='CourseChatMessage',
            new_name='ChatMessage',
        ),
        migrations.CreateModel(
            name='ChatRoom',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=140)),
                ('group_name', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('last_active', models.DateTimeField(auto_now=True)),
                ('is_private', models.BooleanField(default=False)),
                ('is_DM', models.BooleanField(default=False)),
                ('meta', models.JSONField(default=dict)),
                ('admin', models.ForeignKey(on_delete=models.SET(user.models.Student.get_tester_user), to='user.student')),
                ('participants', models.ManyToManyField(blank=True, related_name='chat_room_participants', to='user.Student')),
                ('supervisors', models.ManyToManyField(blank=True, related_name='chat_room_supervisors', to='user.Student')),
            ],
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='chat_room',
            field=models.ForeignKey(default=-1, on_delete=django.db.models.deletion.CASCADE, to='chat.chatroom'),
        ),
    ]
