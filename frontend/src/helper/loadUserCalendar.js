import store from '../store'
import axios from "axios";

export const loadUserCourseBag = () => {
    var userSchedule = []; 
    var courseBag = []; 
    axios
        .get("/api/schedules", 
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
        )
        .then((result) => {
          userSchedule = result; 
          console.log(result); 
        })
        .catch(err => {
          console.log(err.response); 
        });
    userSchedule.courses.forEach((value, index) => {
        axios
        .get("/api/courses/"+value, 
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
        )
        .then((result) => {
            courseBag.push({
                type: 'course',
                id: index,
                courseId: value, 
                title: result.course_meta.title,
                allDay: false,
                start: alignDate(timeslot.weekday, timeslot.start_at),
                end: alignDate(timeslot.weekday, timeslot.end_at),
                raw: {
                    crn: action.selectedCourse.crn,
                    name: action.selectedCourse.course_meta.name,
                    instructor: action.selectedCourse.professor,
                    course: action.selectedCourse,
                    selectedCourseArray: action.selectedCourseArray,
                },
            });  
        })
        .catch(err => {
          console.log(err.response); 
        });
    }
    
    ); 
}

//turn guest's calendar course bag into an array contains courses' id 
export const loadGuestCourseBag = () => {
    var calendarCourseBag = store.getState().calendar.calendarCourseBag; 
    if (!calendarCourseBag.length) {return [];}
    var updatedCourse = []; 
    calendarCourseBag.forEach(course => {
        if (course.courseId != -1) //it is a custom event 
        {updatedCourse.push(course.courseId); }
    }); 
    return updatedCourse; 
}