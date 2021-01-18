import {
  ADD_COURSE_TO_CAL,
  REMOVE_COURSE_FROM_CAL,
  UPDATE_COURSE_IN_CAL,
  ADD_CUS_EVENT_IN_CAL,
  DO_NOTHING,
  REMOVE_CUS_EVENT_IN_CAL,
  OVERWRITE_COURSE_BAG,
} from "../actions/types.js";
import { loadCalendarCourseBag } from "../../src/helper/localStorage";

const initialState = {
  calendarCourseBag: loadCalendarCourseBag(),
};

export const getMonday = (d) => {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + 1; // adjust when day is sunday
  return new Date(d.setDate(diff));
};

export const alignDate = (weekDayIndex, timestamp) => {
  const today = new Date();
  let date = new Date(today.toDateString() + ", " + timestamp);
  return new Date(
    getMonday(date).setDate(getMonday(date).getDate() + weekDayIndex)
  );
};

function addNewCourseToBag(state, action, update) {
  let newBag = update
    ? state.calendarCourseBag.filter(
        // (item) => item.raw.selectedCourseArray != action.selectedCourseArray
        (item) => item.title != action.selectedCourse.course_meta.title
      )
    : [...state.calendarCourseBag];
  let idList = state.calendarCourseBag.map((a) => a.id);
  let newId = update
    ? action.oldId
    : state.calendarCourseBag.length == 0
    ? 0
    : Math.max(...idList) + 1;

  action.selectedCourse.time.map((timeslot) => {
    newBag.push({
      type: "course",
      id: newId,
      courseId: action.selectedCourse.id,
      title: action.selectedCourse.course_meta.title,
      allDay: false,
      start: alignDate(timeslot.weekday, timeslot.start_at),
      end: alignDate(timeslot.weekday, timeslot.end_at),
      raw: {
        name: action.selectedCourse.course_meta.name,
        instructor: action.selectedCourse.professor,
        course: action.selectedCourse,
        selectedCourseArray: action.selectedCourseArray,
      },
    });
  });
  return newBag;
}

function addNewCusEventToBag(state, action) {
  var tempArray = [...state.calendarCourseBag];
  let update = false;
  // create a new calBag
  // check if the action event already exists in calBag
  // true: update time, set update to true and return
  // false: do not modify existingEvent and return
  //debugger;
  tempArray = tempArray.map((existingEvent) => {
    if (existingEvent.id === action.event.id) {
      //addSelectCourse.id????????
      existingEvent.start = action.event.start;
      existingEvent.end = action.event.end;
      update = true;
    }
    return existingEvent;
  });

  if (update) {
    return tempArray;
  }

  let idList = state.calendarCourseBag.map((a) => a.id);
  let newId = state.calendarCourseBag.length == 0 ? 0 : Math.max(...idList) + 1;
  action.event.id = newId;
  tempArray.push(action.event);

  return tempArray;
}

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_COURSE_TO_CAL:
      return {
        ...state,
        calendarCourseBag: addNewCourseToBag(state, action, false),
      };

    case REMOVE_COURSE_FROM_CAL:
      //debugger;
      return {
        ...state,
        calendarCourseBag: state.calendarCourseBag.filter(
          (item) => item.courseId != action.selectedCourse.id
        ),
      };
    case UPDATE_COURSE_IN_CAL:
      return {
        ...state,
        calendarCourseBag: addNewCourseToBag(state, action, true),
      };

    case ADD_CUS_EVENT_IN_CAL:
      return {
        ...state,
        calendarCourseBag: addNewCusEventToBag(state, action),
      };

    case REMOVE_CUS_EVENT_IN_CAL:
      return {
        ...state,
        calendarCourseBag: state.calendarCourseBag.filter(
          (item) => item.id != action.event.id
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
