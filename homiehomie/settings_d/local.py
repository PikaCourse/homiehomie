"""
filename:    local.py
created at:  01/2/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Local setting file used for testing
"""

from homiehomie.settings_d.default import *

ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

DEBUG = True

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'coverage',
    'django_extensions',
    'scheduler.apps.SchedulerConfig',
    'frontend.apps.FrontendConfig',
    'user.apps.UserConfig',
    'debug_toolbar'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

INTERNAL_IPS = [
    '127.0.0.1',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'storage/db.sqlite3',
    }
}

# Email settings
EMAIL_HOST = 'localhost'
EMAIL_PORT = 1025
DEFAULT_FROM_EMAIL = "bot@courseocean.cc"

# Verification token timeout in seconds
# current setting: 3 hrs
PASSWORD_RESET_TIMEOUT = 60 * 60 * 3
