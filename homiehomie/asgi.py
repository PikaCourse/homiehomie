"""
ASGI config for homiehomie_test project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import homiehomie.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'homiehomie.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            homiehomie.routing.websocket_urlpatterns
        )
    ),
})
