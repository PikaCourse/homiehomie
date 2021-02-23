# PikaCourse

![Prod CI](https://github.com/coursewiki/homiehomie/workflows/Prod%20CI/badge.svg?branch=main)
![Dev CI](https://github.com/coursewiki/homiehomie/workflows/Dev%20CI/badge.svg?branch=dev)
[![codecov](https://codecov.io/gh/MARX1108/homiehomie/branch/main/graph/badge.svg?token=2WPZQMGJV0)](https://codecov.io/gh/MARX1108/homiehomie)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FMARX1108%2Fhomiehomie.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FMARX1108%2Fhomiehomie?ref=badge_shield)

## Intro

A scheduling platform for student to choose courses.

## Outline

- [PikaCourse](#pikacourse)
  - [Intro](#intro)
  - [Outline](#outline)
  - [API](#api)
  - [Preparing for development](#preparing-for-development)
    - [Prerequisites](#prerequisites)
      - [Binaries](#binaries)
      - [Private Package](#private-package)
      - [Environmental Variable](#environmental-variable)
    - [Installation](#installation)
      - [Install virtualenv and other python packages](#install-virtualenv-and-other-python-packages)
      - [Install Node.js packages](#install-nodejs-packages)
      - [Additional packages (for production only)](#additional-packages-for-production-only)
    - [Build the project (for Node.js part only)](#build-the-project-for-nodejs-part-only)
  - [Run the project](#run-the-project)
    - [Setup](#setup)
    - [Run dummy email server](#run-dummy-email-server)
    - [Lanuch Redis for Async Server Channel Layer](#lanuch-redis-for-async-server-channel-layer)
    - [Launch redis db and worker process](#launch-redis-db-and-worker-process)
    - [Migrate database](#migrate-database)
    - [Launching server](#launching-server)
    - [Testing and coverage](#testing-and-coverage)
  - [Additional note](#additional-note)
    - [Makefile](#makefile)

## API

1. [Rest API Documentation](https://app.swaggerhub.com/apis/NeX-Studio/HomieHomie)
2. [Async API Documentation](https://playground.asyncapi.io/?load=https://raw.githubusercontent.com/CourseOcean/pikacourse-async-api/main/async.yml)
3. [Dev Server](https://test-homiehomie.thexyzlab.studio/)
4. [Prod Server](https://pikacourse.com)

## Preparing for development

### Prerequisites

#### Binaries

To successfully run the following configuration commands, you will need:

1. Python 3.7 or 3.8 with download instruction [here](https://www.python.org/downloads/)
2. Node.js 14.x with download instruction [here](https://nodejs.org/en/download/)

You can check whether or not your system has the above binaries via:

    # For python version checking, 
    python3 --version
    python --version
    
    # For Node.js
    node -v

#### Private Package

You will need to add a ssh key to GitHub in order to download
certain private packages hosted on GitHub, the instruction for adding
SSH key is:

1. [Generate SSH key](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
2. [Adding SSH key to GitHub](https://docs.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)

Potential resources:

1. [Install Python Package over VCS](https://pip.pypa.io/en/latest/reference/pip_install/#vcs-support)

#### Environmental Variable

The Python Django backend server use python package `decouple` to configure
certain environmental variables used by the project, you will need to request a
`.env` config file from the project development leader @William.

### Installation

#### Install virtualenv and other python packages

    # Install virtualenv for python
    # Do make sure that your `python3` points to a python3.7 or python3.8 version
    python -m pip install --user virtualenv
    python -m virtualenv --help
    virtualenv -p python3 venv
    
    # Activate virtualenv for python
    source venv/bin/activate
    
    # Install python packages
    # If in test env
    pip install -r requirements/dev.txt
    
    # If in prod env, which you usually do not need to
    pip install -r requirements.txt
    
#### Install Node.js packages

    npm install
    
#### Additional packages (for production only)

    # Ubuntu
    # postgresql requirement for python package psycopg2
    sudo apt install libpq-dev
    
### Build the project (for Node.js part only)

    # Build in dev setting, allow compilation on file changes
    npm run dev
    
    # Build in production setting, maximize performance and minimize space
    npm run build

## Run the project

### Setup

Prepare the environment for projects

    # Use the virtualenv for python
    source venv/bin/activate
    
    # Frontend code realtime compilation
    # Run this in another terminal tab
    npm run dev


### Run dummy email server

Since the project has included email service, you will need
a dummy smtp server to listen to it in order to get, for instance, the verification
email link. To run the email server, simply run the following command in another
terminal tab:

    make dummy-smtp
    
Which will launch a fake smtp server listening on `localhost:1025`

### Lanuch Redis for Async Server Channel Layer

The async library `Channels` need `redis` to be running in order to host async messaging.
Run the following command to install and launch `redis`

    make start_redis

### Launch redis db and worker process

The project uses a redis database as a queue for pushing jobs to backend worker process
in order to separate the external API requests from frontend website rendering. Therefore,
a redis database installation is necessary, you can install and run the redis database via:

    make start_redis

Which will fetch and install the redis db when `redis-server` is not in the `PATH` params. The
first this command runs might takes a few minutes due to download, compiling, and testing the 
redis db. After the first pass, it will be pretty quick.

In addition to redis db, a redis queue worker process must be started prior to launching the server via

    make start_worker_%
    
Where `%` is the setting file config like `local`, `remote`

### Migrate database

Database migration will apply database changes to the database specified in the setting file
specified by the `--settings` flag here. You can change the setting file specified by changing
the package string after it. Currently we have four setting configuration:

1. `homiehomie.settings_d.local` 
    1. setting for local testing only
    2. Will use local `sqlite3` db
    3. `DEBUG=True`
2. `homiehomie.settings_d.remote`
    1. Setting nearly identical to `homiehomie.settings_d.local` 
    2. Except the database is connected to development database hosted on `thexyzlab.studio`
3. `homiehomie.settings_d.dev`
    1. **NOT suitable for local testing**
    2. Setting for development server
    3. use development database, which is the same as `homiehomie.settings_d.remote`
    4. `DEBUG=False`
    5. Use `whitenoise` to serve static file, need to run `python manage.py collectstatic --noinput` before launching
4. `homiehomie.settings_d.prod`
    1. **NOT suitable for local testing**
    2. Setting for production server

You should always run this part prior
to start the server.

    # Migrate database for local testing setting
    # Python
    python manage.py migrate --settings=homiehomie.settings_d.local
    
    # Or makefile
    make migratedb_local

### Launching server

If you use makefile command, `collectstatic` and `migrate` are automatically
handled by it so you do not need to run them again

    # Development Use local db
    make testserver
    
    # Or
    make testserver_local
    
    # Use remote db
    make testserver_remote
    
    # Use Production server and local setting
    make prodserver_local
    
    # Use dev db
    make testserver_dev

### Testing and coverage

You can use either the IDE or `manage.py` to run the test scripts, but
a series of makefile commands are already set up for you to use:

    # Python Django testing
    # Run coverage testing on local machine
    make coverage
    
    # See coverage report
    make coverage-report

## Additional note
 
### Makefile

A series of makefile commands are set up to ease debugging.

    # Display help message
    make help
    
    # Run coverage test
    make coverage
    
    # Display coverage report
    make coverage-report
    
    # Run test smtp server
    make dummy-smtp
    
    # Run test server
    make testserver
    
    # Generate Django key
    make random-key

