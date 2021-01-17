import {
  ADD_COURSE_TO_CAL,
  REMOVE_COURSE_FROM_CAL,
  UPDATE_COURSE_IN_CAL,
  ADD_CUS_EVENT_IN_CAL,
  DO_NOTHING,
  REMOVE_CUS_EVENT_IN_CAL,
  ADD_COURSE_TO_WISH,
  REMOVE_COURSE_FROM_WISH,
  OVERWRITE_COURSE_BAG,
} from "./types";
import store from "../store";
import axios from "axios";
import {
  getUserSchedule,
  addCourseToUser,
  removeCourseFromUser,
} from "../../src/helper/loadUserCalendar";

export const addCurrCourse = () => {
  // check if curr course is in calendar
  const courseArray = store
    .getState()
    .calendar.calendarCourseBag.filter(
      (item) =>
      item.courseId != -1 && (item.title ===
      store.getState().course.selectedCourse.course_meta.title)
      // item.raw.course?.course_meta.id ===
      // store.getState().course.selectedCourse.course_meta.id
    );
  if (!Array.isArray(courseArray) || !courseArray.length) {
    return {
      type: ADD_COURSE_TO_CAL,
      selectedCourse: store.getState().course.selectedCourse,
      selectedCourseArray: store.getState().course.selectedCourseArray,
    };
  } else {
    return {
      type: UPDATE_COURSE_IN_CAL,
      selectedCourse: store.getState().course.selectedCourse,
      selectedCourseArray: store.getState().course.selectedCourseArray,
      oldId: courseArray[0].id,
    };
  }
};

export const removeCurrCourse = () => {
  return {
    type: REMOVE_COURSE_FROM_CAL,
    selectedCourse: store.getState().course.selectedCourse,
  };
};

export const addCustomEvent = (inputEvent) => {
  return {
    type: ADD_CUS_EVENT_IN_CAL,
    event: inputEvent,
  };
};

export const removeCustomEvent = (inputEvent) => {
  return {
    type: REMOVE_CUS_EVENT_IN_CAL,
    event: inputEvent,
  };
};

export const overwriteCourseBag = (newCourseBag) => {
  newCourseBag.map((element) => {
    element.start = new Date(element.start);
    element.end = new Date(element.end);
  });
  return {
    type: OVERWRITE_COURSE_BAG,
    newBag: newCourseBag,
  };
};
