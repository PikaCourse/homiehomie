"""
filename:    prod.py
created at:  01/2/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Production server setting for project
"""

# Production setting file
from decouple import config, Csv
from homiehomie.settings_d.default import *

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='127.0.0.1', cast=Csv(post_process=tuple))

DEBUG = config('DEBUG', default=False, cast=bool)

DATABASES = {
    'default': dj_database_url.parse(config("DATABASE_URL")),
}

# Disable Browsable api view in production
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [
    'rest_framework.renderers.JSONRenderer',
    # 'rest_framework.renderers.BrowsableAPIRenderer',
]

REST_FRAMEWORK['DEFAULT_THROTTLE_CLASSES'] = [
    'rest_framework.throttling.AnonRateThrottle',
    'rest_framework.throttling.UserRateThrottle',
    'rest_framework.throttling.ScopedRateThrottle'
]

REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
    'anon': '5000/day',
    'user': '50000/day',
    'user.register': '20/day',
    'user.verify_email': '5/hour'
}
