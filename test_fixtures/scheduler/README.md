# Test Fixtures Explanation: Scheduler


## `test_*_simple.json` fixtures
These files contains test fixtures files used for
simple test of the functionalities of `scheduler` app.

### `CourseMeta` fixture

1. 10 entries from VT and 10 from Purdue
2. Each with different majors and titles
3. Used to test the functionality of retrieving course meta info and search

### `Course` fixture

1. 23 entries from VT and Purdue

### `Question` fixture

1. 6 entries where 3 points to same `CourseMeta` objects
2. Different in `like_count` and `star_count` to test sortby function

### `Note` fixture

1. 8 entries all related to two course section

### `Post` fixture

1. 4 entries to two different course sections by different users

### `PostAnswer` fixture

1. 8 entries where each post has two post answers
