# homiehomie

## TODO

### Backend

1. [ ] Scheduler
    1. [x] Model
    2. [x] API Documentation
    3. [x] API Backend implementation
    4. [ ] Set up test
    5. [ ] API Post and Put
        1. [ ] Create/Modify question
        2. [ ] Create/Modify note
        3. [ ] Create/Modify Post
        4. [ ] Create/Modify PostAnswer
    6. [ ] Better tagging model
        1. Create a table? shared by question, note, and post or even course
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
3. [ ] General Search API
4. [ ] Instant Messaging
5. [x] Test server deployment on dokku 
    1. [x] Test server
    2. [x] Upgrade dokku to use `Procfile`
6. [ ] GitHub action auto deploy to dokku
7. [ ] Dockerify
8. [ ] Production Deployment
9. [ ] Importing Course
    1. [ ] Detail schema of course data
10. [ ] Support for dynamic/partially loading notes 

## how to

### Install virtualenv and initialize venv
    python -m pip install --user virtualenv
    python -m virtualenv --help
    virtualenv -p python3 venv

### Setup
    source venv/bin/activate
    pip install -r requirements.txt
    npm install

### Run
    source venv/bin/activate
    python manage.py runserver
    npm run dev
    
### Migrate Database
    python manage.py makemigrations
    python manage.py migrate

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
