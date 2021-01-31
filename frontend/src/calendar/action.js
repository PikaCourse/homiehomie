/**
 * File name:	action.js
 * Created:	01/31/2021
 * Author:	Weili An, Joanna Fang, Marx Wang
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	action definition for calendar, ported from `action/calendar.js`
 */


import store from "../store";

export const addCurrCourse = () => {
  // check if curr course is in calendar
  const courseArray = store
    .getState()
    .calendar.calendarCourseBag.filter(
      (item) =>
      item.raw.course?.course_meta.id ==
      store.getState().course.selectedCourse.course_meta.id
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
