import {
  ADD_COURSE_TO_CAL,
  REMOVE_COURSE_FROM_CAL,
  UPDATE_COURSE_IN_CAL,
  // PREVIEW_COURSE_IN_CAL,
  // CLEAR_PREVIEW_COURSE_IN_CAL,
  ADD_CUS_EVENT_IN_CAL,
  DO_NOTHING, 
  REMOVE_CUS_EVENT_IN_CAL, 
  OVERWRITE_COURSE_BAG, 
  // UPDATE_PREVIEW,
  // CLEAR_PREVIEW
} from "../actions/types.js";
import {loadState, saveState, loadCalendarCourseBag} from '../../src/helper/localStorage'
import axios from "axios";

const initialState = {
  calendarCourseBag: loadCalendarCourseBag(),
};

export const getMonday = (d) => {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + 1; // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export const alignDate = (weekDayIndex, timestamp) => {
  const today = new Date();
  let date = new Date(today.toDateString() + ", " + timestamp);
  return new Date(
    getMonday(date).setDate(getMonday(date).getDate() + weekDayIndex)
  );
}

function addNewCourseToBag(state, action, update) {
  let newBag = update ?
    state.calendarCourseBag.filter(
      (item) => (item.raw.selectedCourseArray != action.selectedCourseArray)
    ) :
    [...state.calendarCourseBag];
  let idList = state.calendarCourseBag.map((a) => a.id);
  let newId = update ?
    action.oldId :
    state.calendarCourseBag.length == 0 ?
    0 :
    Math.max(...idList) + 1;

  action.selectedCourse.time.map((timeslot) => {
    newBag.push({
      type: 'course',
      id: newId,
      courseId: action.selectedCourse.id, 
      title: action.selectedCourse.course_meta.title,
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
  });
  return newBag;
}

// function previewNewCourseToBag(state, action) {
//   var newBag = [...state.calendarCourseBag];
//   newBag = state.calendarCourseBag.filter((item) => ((item.type != 'preview') ));

//   action.selectedCourse.time.map((timeslot) => {
//     newBag.push({
//       type: 'preview',
//       id: -1,
//       title: action.selectedCourse.course_meta.title,
//       allDay: false,
//       start: alignDate(timeslot.weekday, timeslot.start_at),
//       end: alignDate(timeslot.weekday, timeslot.end_at),
//       raw: {
//         crn: action.selectedCourse.crn,
//         name: action.selectedCourse.course_meta.name,
//         instructor: action.selectedCourse.professor,
//         course: action.selectedCourse,
//         selectedCourseArray: action.selectedCourseArray,
//       },
//     });
//   });

//   return newBag;
// }

function addNewCusEventToBag(state, action) {
  console.log("add cus in reducer");
  var tempArray = [...state.calendarCourseBag];
  let update = false;

  tempArray = tempArray.map((existingEvent) => {
    if (addSelectCourse.id == action.event.id) { //addSelectCourse.id????????
      existingEvent.start = action.event.start;
      existingEvent.end = action.event.end;
      update = true;
    }
    return existingEvent;
    // return existingEvent.id == event.id
    //   ? { ...existingEvent, start, end }
    //   : existingEvent;
  });
  if (update) {
    return tempArray;
  }

  // tempArray = tempArray.filter(
  //   (item) =>
  //     item.id !=
  //     action.event.id
  // ); 

  // console.log(tempArray); 

  // console.log(tempArray); 
  //tempArray = state.calendarCourseBag.filter((item) => item.calendarId != -1);

  // let id = 0;
  // if (state.calendarCourseBag.length != 0) {
  //   id = state.calendarCourseBag[state.calendarCourseBag.length - 1].id + 1;
  // }
  let idList = state.calendarCourseBag.map((a) => a.id);
  let newId = state.calendarCourseBag.length == 0 ?
    0 :
    Math.max(...idList) + 1;
  action.event.id = newId;
  tempArray.push(action.event);

  return tempArray;
}

// function getUniqueCourses(courseBag) {
//   let uniqueCourseBag = Array.from(new Set(courseBag.map(a => a.title)))
//       .map(title => {
//         return courseBag.find(a => a.title === title)
//       }); 
//       uniqueCourseBag.filter(
//     (item) => (item.type == 'course')
//   ); 
//   return uniqueCourseBag; 
// }

function addCourseToUser(state, action, update) {
  var userSchedule; 
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
  if (update) {
    let removeCourse = state.calendarCourseBag.find(
      (item) => (item.raw.selectedCourseArray == action.selectedCourseArray)
    ); 
  }
  let addCourse = action.selectedCourse; 

}

function removeCourseFromUser(state, action) {

}


export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_COURSE_TO_CAL:
      return {
        ...state,
        calendarCourseBag: addNewCourseToBag(state, action, false),
      };

    case REMOVE_COURSE_FROM_CAL:
      return {
        ...state,
        calendarCourseBag: state.calendarCourseBag.filter(
            (item) => item.raw.crn != action.selectedCRN
          ), //assume CRN is unique!!
      };
    case UPDATE_COURSE_IN_CAL:
      return {
        ...state,
        calendarCourseBag: addNewCourseToBag(state, action, true),
      };

    // case UPDATE_PREVIEW:
    //   return {
    //     ...state,
    //     calendarCourseBag: previewNewCourseToBag(state, action),
    //   };

    // case CLEAR_PREVIEW:
    //   return {
    //     ...state,
    //     calendarCourseBag: state.calendarCourseBag.filter(
    //       (item) => item.type != "preview"
    //     ),
    //   };

    case ADD_CUS_EVENT_IN_CAL:
      return {
        ...state,
        calendarCourseBag: addNewCusEventToBag(state, action),
      };

    case REMOVE_CUS_EVENT_IN_CAL:
      // title: action.selectedCourse.course_meta.title,
      // allDay: false,
      // start: alignDate(timeslot.weekday, timeslot.start_at),
      // end: alignDate(timeslot.weekday, timeslot.end_at),
      return {
        ...state,
        calendarCourseBag: state.calendarCourseBag.filter(
          (item) => (item.id != action.event.id) 
        ),
      };
    case OVERWRITE_COURSE_BAG: 
      return {
        ...state,
        calendarCourseBag: action.newBag,
      };
    default:
      return state;
  }
}