from django.apps import AppConfig
import homiehomie.user.signals

class UserConfig(AppConfig):
    name = 'user'

    def ready(self):
        pass