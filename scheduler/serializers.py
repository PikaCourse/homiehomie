from rest_framework import serializers
from scheduler.models import *
from django.utils import timezone


class CourseMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseMeta
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        depth = 1


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class PostAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAnswer
        fields = '__all__'


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

    def update(self, instance, validated_data):
        """
        Update the instance
        :param instance:
        :param validated_data:
        :return:
        """
        # Update instance last_edited field
        instance.last_edited = timezone.now()
        return super().update(instance, validated_data)


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

    def update(self, instance, validated_data):
        """
        Update the instance
        :param instance:
        :param validated_data:
        :return:
        """
        # Update instance last_edited field
        instance.last_edited = timezone.now()
        return super().update(instance, validated_data)
