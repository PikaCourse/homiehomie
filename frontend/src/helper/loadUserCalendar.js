import store from "../store";
import axios from "axios";
import { getMonday, alignDate } from "../reducers/calendar";


// function getSelectedCourseArray(title) {
//   let selectedCourseArray = [];
//   axios
//     .get("api/courses?title=" + title)
//     .then((res) => {
//       selectedCourseArray = res.data;
//     })
//     .catch((err) => console.log(err));
//   return selectedCourseArray;
// }
// export const loadUserCourseBag = () => {
//   var userSchedule = getUserSchedule();
//   console.log("userSchedule");
//   console.log(getUserSchedule());
  
//   // if (!userSchedule.length) return;
//   var courseBag = [];
  
//   userSchedule.courses.forEach((value, index) => {
//     axios
//       .get("/api/courses/" + value, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//       .then((result) => {
//         console.log(result);
//         courseBag.push({
//           type: "course",
//           id: index,
//           courseId: value,
//           title: result.data.course_meta.title,
//           allDay: false,
//           start: alignDate(result.data.time.weekday, result.data.time.start_at),
//           end: alignDate(result.data.time.weekday, result.data.time.end_at),
//           raw: {
//             crn: result.data.crn,
//             name: result.data.course_meta.name,
//             instructor: result.data.professor,
//             course: result.data,
//             selectedCourseArray: getSelectedCourseArray(
//               result.data.course_meta.title
//             ),
//           },
//         });
//       })
//       .catch((err) => {
//         console.log(err.response);
//       });
//   });
//   return courseBag;
// };

// //turn guest's calendar course bag into an array contains courses' id
// export const loadGuestCourseBag = () => {
//   var calendarCourseBag = store.getState().calendar.calendarCourseBag;
//   if (!calendarCourseBag.length) {
//     return [];
//   }
//   var updatedCourse = [];
//   calendarCourseBag.forEach((course) => {
//     if (course.courseId != -1) {
//       //it is a custom event
//       updatedCourse.push(course.courseId);
//     }
//   });
//   return updatedCourse;
// };

// export const addCourseToUser = (schedule, courseId) => {
//   console.log("addCourseToUser");
//   if (!store.getState().user.loginStatus || !schedule.length) {
//     console.log("check pt 2");
//     console.log(store.getState().user.loginStatus);
//     console.log(schedule.length);
//     return;
//   }
//   var newCourses = { courses: [...schedule.courses] };
//   newCourses.courses.push(courseId);
//   console.log(newCourses);
//   axios
//     .patch("/api/schedules/" + schedule.id, newCourses, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//     .then((result) => {
//       console.log(result);
//     })
//     .catch((err) => {
//       console.log(err.response);
//     });
// };

// export const removeCourseFromUser = (schedule, courseId) => {
//   if (!store.getState().user.loginStatus || !schedule.length) {
//     return;
//   }
//   var updatedCourses = [...schedule.courses];
//   updatedCourses.filter((course) => course != courseId);
//   axios
//     .patch("/api/schedules/" + schedule.id, updatedCourses, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//     .then((result) => {
//       console.log(result);
//     })
//     .catch((err) => {
//       console.log(err.response);
//     });
// };
