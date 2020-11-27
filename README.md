# homiehomie

## TODO

### Backend

1. [ ] Scheduler
    1. [x] Model
    2. [x] API Documentation
    3. [ ] API Backend implementation
    4. [ ] Set up test
2. [ ] User
    1. [ ] User model
    2. [ ] Register/Login
    3. [ ] Setting
3. [ ] Instant Messaging
4. [ ] Test server deployment on dokku 
5. [ ] Production Deployment

## how to
    pip install -r requirements.txt
    python manage.py runserver
    
## API

https://app.swaggerhub.com/apis/NeX-Studio/HomieHomie/1.0.0

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
