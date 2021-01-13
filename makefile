# Makefile for Course Wiki
.PHONY: coverage_%
.PHONY: coverage-report
.PHONY: coverage-report_%
.PHONY: clean
.PHONY: clean-coverage
.PHONY: dummy-smtp
.PHONY: testserver_%
.PHONY: help

help:

clean: clean-coverage

# Clean coverage statistics and report related files
clean-coverage:
	rm .coverage
	rm .coverage.*
	rm coverage.*

# Run coverage test on the project with specified setting files
coverage_% :
	@COVERAGE_PROCESS_START=./.coveragerc coverage run \
		--concurrency=multiprocessing \
		--rcfile=./.coveragerc manage.py test \
		--settings=homiehomie.settings_d.$* --parallel
	@coverage combine

coverage : coverage_local

# Generate coverage report in terminal
coverage-report :
	@coverage report

# Choose a format for coverage report
coverage-report_% :
	@coverage $* -o coverage.$*

# Launch fake smtp server to listen to email
dummy-smtp :
	python -m smtpd -n -c DebuggingServer localhost:1025

# Generate Django Random Key
random-key :
	python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# Database
migratedb_% :
	python manage.py migrate --settings=homiehomie.settings_d.$*

# Static files
collectstatic_% :
	python manage.py collectstatic --noinput --settings=homiehomie.settings_d.$*

# Launching server
# Launch test server
testserver_% : migratedb_%
	python manage.py runserver --settings=homiehomie.settings_d.$*

testserver : testserver_local

# Launch server used in production
prodserver_% : collectstatic_% migratedb_%
	DJANGO_SETTINGS_MODULE=homiehomie.settings_d.$* gunicorn homiehomie.wsgi:application


