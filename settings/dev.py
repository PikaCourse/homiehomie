"""
filename:    dev.py
created at:  01/2/2021
author:      Weili An
email:       china_aisa@live.com
version:     v1.0.0
desc:        Development server setting for project
"""

# Production setting file

from settings.default import *

ALLOWED_HOSTS = ["test-homiehomie.thexyzlab.studio", "127.0.0.1", "localhost"]

DATABASES = {
    'default': dj_database_url.parse(config("DATABASE_URL")),
}
