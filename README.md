# Homiehomie
![Project CI](https://github.com/MARX1108/homiehomie/workflows/Project%20CI/badge.svg)
[![codecov](https://codecov.io/gh/MARX1108/homiehomie/branch/main/graph/badge.svg?token=2WPZQMGJV0)](https://codecov.io/gh/MARX1108/homiehomie)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FMARX1108%2Fhomiehomie.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FMARX1108%2Fhomiehomie?ref=badge_shield)

## TODO

### Backend

1. [ ] Scheduler
    1. [x] Model
    2. [x] API Documentation
    3. [x] API Backend implementation
    3. [x] Add course section num field?
    3. [ ] Make a new table for school for ease of searching school when creating user?
    4. [ ] Set up test
        1. [x] Test model method
        2. [ ] Test view
            1. [ ] Regular access
                1. Valid access
                2. Multiple valid access
                3. Large access
            2. [ ] Irregular access
                1. Invalid access
                2. access not existing object
                3. invalid url
            3. [ ] Permission testing
        3. [ ] Coverage report
        4. [ ] GitHub action
        5. [ ] Advance testing
            1. [ ] Do we need separate test db to run unit testing?
                1. Probably not
                1. But do need a test db
                1. Specify test db in `setting.py`?
                1. Use [test fixture](https://docs.djangoproject.com/en/3.1/topics/testing/tools/#fixture-loading)
    5. [x] API Post and Put
        1. [x] Create/Modify question
        2. [x] Create/Modify note
        3. [x] Create/Modify Post
        4. [x] Create/Modify PostAnswer
    6. [ ] API Delete
        1. [ ] API Doc
        2. [ ] API Implementation
            1. [ ] Post answer deletion
    6. [ ] Better tagging model
        1. Create a table? shared by question, note, and post or even course
    7. Code optimization
        1. [x] Use django form for POST/PUT
        1. [ ] Use mixin to add GET/POST/PUT/DELETE for api
    8. Detail documentation
2. [ ] User
    1. [X] User model
    2. [x] Password transmission
        1. [x] plain text over HTTPS
        2. [x] Store as hashed value using django API
    3. [ ] Register/Login
        1. [x] Registration Form
            1. Use form
        2. [x] Link with customized user model
        3. [ ] Implement other user password related views
            1. Change
            2. reset
            3. etc
    4. [ ] Permission Setting
        1. [ ] User group
            1. [ ] standard
                1. Normal user
            2. [ ] moderator
                1. User with some ability to modify/moderate content
            3. [ ] staff
                1. Staff to manage the db
                2. Can do anything except delete
            4. [ ] superuser
        2. [ ] Permission
            1. Add isOwnerOrReadOnly Permission
        3. Require permissions on all api scope
    5. [ ] User Profile
        1. [ ] Student information
        2. [ ] Link with scheduler app
3. [ ] General Search API
    1. [ ] Advanced search via hashtag
4. [ ] Instant Messaging
5. [x] Test server deployment on dokku 
    1. [x] Test server
    2. [x] Upgrade dokku to use `Procfile`
6. [x] GitHub action auto deploy to dokku
7. [ ] Dockerify
8. [ ] Production Deployment
    1. [ ] Docker?
    2. [ ] Static file serving issue
        1. [ ] Use server
        2. [ ] CDN
9. [ ] Importing Course
    1. [x] Detail schema of course data
    2. [ ] Purdue
    3. [ ] UNC/BU
10. [ ] Support for dynamic/partially loading notes 
11. [ ] Add admin api for easily updating course and course meta info like field `registered`

## how to

### Install virtualenv and initialize venv
    python -m pip install --user virtualenv
    python -m virtualenv --help
    virtualenv -p python3 venv
    
### Additional packages (for production only)

#### Ubuntu

    sudo apt install libpq-dev
    
### Setup
    source venv/bin/activate
    npm install
    
    # If in test env
    pip install -r requirements/dev.txt
    
    # If in prod env
    pip install -r requirements.txt


### Run
    source venv/bin/activate
    # Use local db
    python manage.py runserver --settings=homiehomie.settings_d.local
    
    # Use Production server and local setting
    DJANGO_SETTINGS_MODULE=homiehomie.settings_d.local gunicorn homiehomie.wsgi:application
    
    # Use dev db
    python manage.py runserver --settings=homiehomie.settings_d.dev

    npm run dev
    
### Migrate Database
    python manage.py makemigrations --settings=homiehomie.settings_d.local
    python manage.py migrate --settings=homiehomie.settings_d.local

## API

1. [API Document](https://app.swaggerhub.com/apis/NeX-Studio/HomieHomie/1.0.0)
2. [Test Server](http://test-homiehomie.thexyzlab.studio/)

## workflowy

https://workflowy.com/s/homiehomie/qLpaReYIIj7eGbsl

## database
backend
- Data
  - VT
    - Course
      - Use https://github.com/PhillipNgo/PScheduler/tree/spring-2020-update
      - Import txt files directly to database
    - Grade
      - https://udc.vt.edu/irdata/data/course_grades/teaching_load/index
      - https://github.com/PhillipNgo/PScheduler/tree/spring-2020-update
      - Import CSV to database
  - Purdue
    - Course
      - https://github.com/Purdue-io/PurdueApi
- Django
  - https://www.djangoproject.com/
  - API
    - https://www.openapis.org/
    - TODO API specification
    - Course page
      - Course page summary
      - Course notes
      - Course post
      - TODO Instant message
    - Schedule page
      - Course info request
      - Save info
- MySQL
  - TODO
    - spam filter
    - similar comment recommendation to prevent similar/repeated post
      - keyword
      - ML
  - course
    - TODO 
      - Search
        - 模糊搜索 course name
    - notes
    - index id
    - Course name
    - Course Time
    - CRN
    - Professor
    - Course Semester
    - etc
    - tag
    - major
    - department
  - shared Notes
    - Comment like
    - id
    - timestamp
    - title
    - content
      - markdown
    - tags
    - userid
    - like count
    - dislike count
    - star count
    - courseid
    - note type
      - Q1
        - What will I learn/What is this class about?
      - Q2
        - How hard it is/How much time will I spent ?
      - Q3
        - Which instructor should I choose?
  - Post
    - todo
      - search functionality
      - 模糊搜索
    - Piazza like
    - id
    - tags
    - userid
    - title
    - content
      - markdown
    - timestamp
  - Instant message/discussion
    - TODO
      - Receiver scope
        - people in course with same CRN?
        - people in same course
        - private messaging
    - timestamp
    - UID (who sent)
    - content
  - Users
    - uid
    - Email
    - Hashed password
    - Name
    - School
    - Major
    - Graduation date
    - Age
    - Sex/gender
    - Schedule id
      - array
  - Schedule
    - TODO
      - prerequisite issue?
    - uid
    - timestamp
    - course array (foreign)
      - course table index id
      - (size is guaranteed less than 10)
    - star
    - name
    - semester
    - tag
    - Note (markdown)
