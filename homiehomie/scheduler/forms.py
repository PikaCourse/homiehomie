# Form used by scheduler to modify or update information

from homiehomie.scheduler.models import *
from django.forms import ModelForm
from django.utils.translation import ugettext as _
from django.utils import timezone

# TODO User id verification/authentication

class QuestionCreationForm(ModelForm):
    class Meta:
        model = Question
        fields = ["course_meta", "title", "tags"]

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request", None)
        super(QuestionCreationForm, self).__init__(*args, **kwargs)

    def save(self, commit=True, debug=False):
        # NOTE Did not check for if the user is valid or authenticated
        # Defer the work to view
        question = super().save(commit=False)
        if debug:
            question.created_by_id = self.request.user.id if self.request.user.id is not None else 1
        else:
            question.created_by_id = self.request.user.id

        if commit:
            question.save()
        return question


class QuestionModificationForm(ModelForm):
    class Meta:
        model = Question
        fields = ["title", "tags"]

    def save(self, commit=True):
        # NOTE Did not check for if the user has the permission,
        # defer work to view
        question = super().save(commit=False)
        question.last_edited = timezone.now()

        if commit:
            question.save()
        return question


class NoteCreationForm(ModelForm):
    class Meta:
        model = Note
        fields = ["course", "question", "title", "content", "tags"]

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request", None)
        super(NoteCreationForm, self).__init__(*args, **kwargs)

    def save(self, commit=True, debug=False):
        # NOTE Did not check for if the user is valid or authenticated
        # Defer the work to view

        # Note: if not commit, need to manually update the question
        # last_answered field and save it
        note = super().save(commit=False)
        if debug:
            note.created_by_id = self.request.user.id if self.request.user.id is not None else 1
        else:
            note.created_by_id = self.request.user.id
        question = Question.objects.get(id=note.question_id)
        question.last_answered = timezone.now()
        if commit:
            note.save()
            question.save()
        return note


class NoteModificationForm(ModelForm):
    class Meta:
        model = Note
        fields = ["title", "content", "tags"]

    def save(self, commit=True):
        # NOTE Did not check for if the user is valid or authenticated
        # Defer the work to view

        # Note: if not commit, need to manually update the question
        # last_answered field and save it
        note = super().save(commit=False)
        note.last_edited = timezone.now()
        question = Question.objects.get(id=note.question_id)
        question.last_answered = timezone.now()
        if commit:
            note.save()
            question.save()
        return note


class PostCreationForm(ModelForm):
    class Meta:
        model = Post
        fields = ["course", "title", "content", "tags"]

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request", None)
        super(PostCreationForm, self).__init__(*args, **kwargs)

    def save(self, commit=True, debug=False):
        # NOTE Did not check for if the user is valid or authenticated
        # Defer the work to view
        post = super().save(commit=False)
        if debug:
            post.poster_id = self.request.user.id if self.request.user.id is not None else 1
        else:
            post.poster_id = self.request.user.id
        if commit:
            post.save()
        return post


class PostModificationForm(ModelForm):
    class Meta:
        model = Post
        fields = ["title", "content", "tags"]

    def save(self, commit=True):
        # NOTE Did not check for if the user is valid or authenticated
        # Defer the work to view
        post = super().save(commit=False)
        post.last_edited = timezone.now()
        if commit:
            post.save()
        return post


class PostAnswerCreationForm(ModelForm):
    class Meta:
        model = PostAnswer
        fields = ["content"]

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request", None)
        self.post = kwargs.pop("post", None)
        super(PostAnswerCreationForm, self).__init__(*args, **kwargs)

    def save(self, commit=True, debug=False):
        # NOTE Did not check for if the user is valid or authenticated
        # Defer the work to view
        answer = super().save(commit=False)
        if debug:
            answer.postee_id = self.request.user.id if self.request.user.id is not None else 1
        else:
            answer.postee_id = self.request.user.id
        answer.post_id = self.post.id
        self.post.last_answered = timezone.now()
        if commit:
            answer.save()
            self.post.save()
        return answer

class PostAnswerModificationForm(ModelForm):
    class Meta:
        model = PostAnswer
        fields = ["content"]

    def save(self, commit=True):
        # NOTE Did not check for if the user is valid or authenticated
        # Defer the work to view
        answer = super().save(commit=False)
        answer.last_edited = timezone.now()
        if commit:
            answer.save()
        return answer
