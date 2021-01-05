release: python manage.py migrate --noinput --settings=homiehomie.settings_d.dev
web: DJANGO_SETTINGS_MODULE=homiehomie.settings_d.dev gunicorn -b 0.0.0.0:5000 homiehomie.wsgi:application
