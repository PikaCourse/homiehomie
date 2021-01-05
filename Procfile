release: python manage.py migrate --noinput
web: gunicorn -b 0.0.0.0:5000 homiehomie.wsgi:application
