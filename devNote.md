# Development Note on Django and Django Rest Framework

## Serializer

Like django form, handle parsing model db data and
validating incoming user payload to store data into db. However
itself does not check for the permission and authentication,
which are left to view and viewset to handle.

## Token generator

Django handle token or one-time link not by storing the link directly but
by use a hash value constitutes of user data fields and timestamp. The user
data fields are meant to be modified after the user has performed the action
which why the token is created. For instance, the default `PasswordResetTokenGenerator`
uses user `login_timestamp` and `password` as after user resets his/her password,
both fields will be changed. 

The timestamp part allows the Django to track how many minutes has passed
since the token issued and thus can expire it.
