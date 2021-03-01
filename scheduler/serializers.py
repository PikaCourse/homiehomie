from rest_framework import serializers
from scheduler.models import *
from django.utils import timezone
from homiehomie.utils import CreatableSlugRelatedField


class CourseMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseMeta
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        depth = 1


# TODO Forbid updating tag
#   can only add tag
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name", "count",)


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    # tags = TagSerializer(many=True)
    tags = CreatableSlugRelatedField(many=True, slug_field="name", queryset=Tag.objects.all())

    class Meta:
        model = Post
        exclude = ("like", "star", "dislike", )
        read_only_fields = ("created_at", "last_edited", "last_answered",
                            "like_count", "star_count", "dislike_count", "poster")

    def create(self, validated_data):
        """
        Create an instance based on validated data
        :param validated_data:
        :return:
        """
        # Inject user info
        user_id = self.context["request"].user.id
        validated_data["poster_id"] = user_id

        instance = super().create(validated_data)

        # Update count of tag by 1
        Tag.increment_tags(Tag.objects.filter(post=instance))
        return instance

    def update(self, instance, validated_data):
        """
        Update an instance and change tag count accordingly
        :param instance:
        :param validated_data:
        :return:
        """
        Tag.decrement_tags(Tag.objects.filter(post=instance))
        new_instance = super().update(instance, validated_data)
        Tag.increment_tags(Tag.objects.filter(post=new_instance))
        return new_instance


class PostAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAnswer
        fields = '__all__'
        read_only_fields = ("post", "postee", "created_at", "last_edited",
                            "like_count", "dislike_count")

    def create(self, validated_data):
        # Inject user info
        user_id = self.context["request"].user.id
        validated_data["postee_id"] = user_id

        # Inject post info
        post_id = self.context["post"].id
        validated_data["post_id"] = post_id
        return super().create(validated_data)


# TODO Validate that the courses in the schedule matched
#  with the year and semester
class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        exclude = ("student", )
        read_only_fields = ("id", "last_edited", "created_at")

    def validate_year(self, year):
        """
        Validate that the year is within plus or minus 4 years from now
        :param year:
        :return:
        """
        current_year = timezone.now().year
        if abs(current_year - year) > 4:
            raise serializers.ValidationError("invalid schedule year, are you trying to go "
                                              "back to the future?")
        return year

    def create(self, validated_data):
        """
        Create a instance based on the validated data
        :param validated_data:
        :return:
        """
        # Authentication and permission leave to view methods
        # Need the user to be authenticated
        user_id = self.context["request"].user.id
        # Since user and student are one to one
        validated_data["student_id"] = user_id
        return super().create(validated_data)


class WishListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishList
        exclude = ("student", )
        read_only_fields = ("id", "last_edited", "created_at")

    def validate(self, data):
        """
        Object-level validation on object data
        :param data:
        :return:
        """
        # Check if there already exists a wishlist from the user upon creation
        if self.context["request"]._request.method == "POST":
            user = self.context["request"].user
            if WishList.objects.filter(student__user=user).exists():
                raise serializers.ValidationError("wishlist already exists")
        return data

    def create(self, validated_data):
        """
        Create a instance based on the validated data
        :param validated_data:
        :return:
        """
        # Authentication and permission leave to view methods
        # Need the user to be authenticated
        user_id = self.context["request"].user.id
        validated_data["student_id"] = user_id
        return super().create(validated_data)
