"""
filename:    utils.py
created at:  02/23/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Global helper class and func
"""

from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.utils.encoding import smart_text


class CreatableSlugRelatedField(serializers.SlugRelatedField):
    """
    Create new instance if the object not exist in db
    """

    def to_internal_value(self, data):
        try:
            return self.get_queryset().get_or_create(**{self.slug_field: data})[0]
        except ObjectDoesNotExist:
            self.fail('does_not_exist', slug_name=self.slug_field, value=smart_text(data))
        except (TypeError, ValueError):
            self.fail('invalid')
