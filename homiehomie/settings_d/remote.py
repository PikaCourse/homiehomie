"""
filename:    remote.py
created at:  01/2/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Local test setting connect to remote db
"""

from homiehomie.settings_d.default import *

ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

DEBUG = True

DATABASES = {
    'default': dj_database_url.parse(config("DATABASE_URL")),
}

# Email settings
EMAIL_PORT = config("EMAIL_PORT", default=1025, cast=int)
DEFAULT_FROM_EMAIL = "bot@remote.test"


# Redis queue db settings
RQ_QUEUES = {
    'default': {
        'HOST': 'localhost',
        'PORT': 6379,
        'DB': 0,
        'PASSWORD': '',
        'DEFAULT_TIMEOUT': 360,
    },
    'high': {
        'HOST': 'localhost',
        'PORT': 6379,
        'DB': 0,
        'PASSWORD': '',
        'DEFAULT_TIMEOUT': 360,
    },
    'low': {
        'HOST': 'localhost',
        'PORT': 6379,
        'DB': 0,
        'PASSWORD': '',
        'DEFAULT_TIMEOUT': 360,
    },
}
