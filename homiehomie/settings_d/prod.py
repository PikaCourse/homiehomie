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

# Email setting
EMAIL_HOST = 'localhost'
EMAIL_PORT = config("EMAIL_PORT", default=25, cast=int)
DEFAULT_FROM_EMAIL = "bot@courseocean.cc"

# Verification token timeout in seconds
# current setting: 3 hrs
PASSWORD_RESET_TIMEOUT = 60 * 60 * 3
