"""
filename:    dev.py
created at:  01/2/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Development server setting for project
"""

# Production setting file
from decouple import config
from homiehomie.settings_d.default import *

ALLOWED_HOSTS = ["test-homiehomie.thexyzlab.studio", "127.0.0.1", "localhost"]

DEBUG = config('DEBUG', default=False, cast=bool)

DATABASES = {
    'default': dj_database_url.parse(config("DATABASE_URL")),
}

# Email setting
EMAIL_HOST = config("EMAIL_HOST", default="localhost")
EMAIL_PORT = config("EMAIL_PORT", default=25, cast=int)
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="")
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=False, cast=bool)
DEFAULT_FROM_EMAIL = "bot@test-homiehomie.thexyzlab.studio"

# Verification token timeout in seconds
# current setting: 3 hrs
PASSWORD_RESET_TIMEOUT = 60 * 60 * 3
