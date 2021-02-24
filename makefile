#############################################
# Makefile for PikaCourse
#############################################

.PHONY: coverage_%
.PHONY: coverage-report
.PHONY: coverage-report_%
.PHONY: clean
.PHONY: clean-coverage
.PHONY: dummy-smtp
.PHONY: testserver_%
.PHONY: help
.PHONY: migrations_%
.PHONY: migratedb_%

#############################################
# Help
#############################################

help:
	@echo "----------------------------------------------------------------"
	@echo "Administrative targets:"
	@echo "  clean            - removes generated coverage files"
	@echo
	@echo "Server preparation"
	@echo "  migratedb_%      - migrate database with setting file specified"
	@echo "                     see README.md for setting files listed"
	@echo
	@echo "  collectstatic_%  - collect static files for whitenoise"
	@echo
	@echo "  dummy-smtp       - launch fake smtp email server on localhost:1025"
	@echo
	@echo "Running server"
	@echo "  testserver       - run test server with default local setting"
	@echo "                     handle database migration as well"
	@echo
	@echo "  testserver_%     - run test server with setting file specified"
	@echo "                     handle database migration as well"
	@echo
	@echo "  prodserver_%     - run production server with setting file specified"
	@echo "                     handle database migration and static file collection"
	@echo "                     as well"
	@echo
	@echo "Coverage testing related"
	@echo "  coverage             - run coverage tests with default local setting"
	@echo
	@echo "  coverage_%           - run coverage tests with setting file specified"
	@echo
	@echo "  coverage-report      - generate report after running coverage tests"
	@echo
	@echo "  coverage-report_%    - generate report with designated format"
	@echo
	@echo "  clean-coverage       - clean generated coverage related files"
	@echo
	@echo "Redis db related"
	@echo "  install_redis        - install redis on local machine"
	@echo
	@echo "  start_redis          - start redis server"
	@echo
	@echo "  start_worker_%       - start worker process for redis queue"
	@echo "----------------------------------------------------------------"

#############################################
# Clean up directory
#############################################

clean: clean-coverage

# Clean coverage statistics and report related files
clean-coverage:
	rm .coverage
	rm .coverage.*
	rm coverage.*


#############################################
# Install dependency
#############################################

# Install all necessary components
install : dependency, install_redis


dependency :
	( \
		source venv/bin/activate; \
		pip install --upgrade -r requirements/dev.txt; \
	)
	npm install


#############################################
# Django server related
#############################################

# Database
migrations_% :
	python manage.py makemigrations --settings=homiehomie.settings_d.$*

migratedb_% :
	python manage.py migrate --settings=homiehomie.settings_d.$*

# Static files
collectstatic_% :
	python manage.py collectstatic --noinput --settings=homiehomie.settings_d.$*

# Launching server
# Launch test server
testserver_% : migratedb_%
	( \
		python -m smtpd -n -c DebuggingServer localhost:1025 & \
		redis-server & \
		python manage.py runserver --settings=homiehomie.settings_d.$* && fg \
	)

testserver : testserver_local

# Launch server used in production
prodserver_% : collectstatic_% migratedb_%
	DJANGO_SETTINGS_MODULE=homiehomie.settings_d.$* gunicorn homiehomie.wsgi:application


#############################################
# Django coverage testing related
#############################################

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


#############################################
# Django utils
#############################################

# Launch fake smtp server to listen to email
dummy-smtp :
	python -m smtpd -n -c DebuggingServer localhost:1025

# Generate Django Random Key
random-key :
	python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

#############################################
# Redis db
#############################################

# Install redis db
install_redis :
# Redis server not found
ifeq (, $(shell which redis-server))
	@wget http://download.redis.io/redis-stable.tar.gz
	@tar xvzf redis-stable.tar.gz
	@$(MAKE) -C redis-stable
	@$(MAKE) -C redis-stable test
	@sudo $(MAKE) -C redis-stable install
	@cd ..
	@rm redis-stable.tar.gz
	@rm -rf redis-stable
endif

# Launch a redis db with default setting
start_redis : install_redis
	@redis-server

# Start worker
start_worker_% :
	@python manage.py rqworker high default low --settings=homiehomie.settings_d.$*

