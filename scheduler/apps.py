from django.apps import AppConfig


class SchedulerConfig(AppConfig):
    name = 'scheduler'

    def ready(self):
        from scheduler import signals
