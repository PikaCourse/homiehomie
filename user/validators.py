"""
filename:    validators.py
created at:  01/8/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Custom validator for Course Wiki user viewset
"""

from rest_framework import serializers
from rest_framework.utils.representation import smart_repr

class UniqueOrOwnerValidator:
    """
    Validate the value is unique or the one not unique is the user himself
    Makesure that the user request is authenticated first
    """
    requires_context = True

    def __init__(self, queryset, db_owner_id_field="id"):
        self.queryset = queryset
        self.db_owner_id_field = db_owner_id_field

    def __call__(self, value, serializer_field):
        assert (hasattr(serializer_field, "context") and isinstance(serializer_field.context, dict)), \
            "Please pass in context for this validator as a dictionary"
        assert "request" in serializer_field.context, "Please ensure the request object is passed in"

        request = serializer_field.context["request"]
        assert (not request.user.is_anonymous), "User should be authenticated before using this validator"

        field_name = serializer_field.field_name
        kwargs = {field_name: value}
        if self.queryset.filter(**kwargs).exists():
            # Try fetch the record and see if the user is the owner
            user_db = self.queryset.get(**kwargs)
            if getattr(user_db, self.db_owner_id_field, None) != request.user.id:
                raise serializers.ValidationError(f"{field_name} not unique and not owner")

    def __repr__(self):
        return f"<{self.__class__.__name__})>"
