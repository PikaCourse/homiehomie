# Development Note on Django and Django Rest Framework

## Serializer

Like django form, handle parsing model db data and
validating incoming user payload to store data into db. However
itself does not check for the permission and authentication,
which are left to view and viewset to handle.
