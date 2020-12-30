import {
  ADD_COURSE_TO_CAL,
  REMOVE_COURSE_FROM_CAL,
  UPDATE_COURSE_IN_CAL,
  PREVIEW_COURSE_IN_CAL,
  CLEAR_PREVIEW_COURSE_IN_CAL,
  ADD_CUS_EVENT_IN_CAL,
} from "./types";
import store from "../store";

export const addCurrCourse = () => {
  const courseArray = store
    .getState()
    .calendar.calendarCourseBag.filter(
      (item) =>
        (item.raw.selectedCourseArray ==
        store.getState().course.selectedCourseArray)//||(item.id != -1)
    );
  // console.log("test");
  if (!Array.isArray(courseArray) || !courseArray.length) {
    // add new course
    return {
      type: ADD_COURSE_TO_CAL,
      selectedCRN: store.getState().course.selectedCRN,
      selectedCourse: store.getState().course.selectedCourse,
      selectedCourseArray: store.getState().course.selectedCourseArray,
    };
  } else {
    // add same course different crn
    return {
      type: UPDATE_COURSE_IN_CAL,
      selectedCRN: store.getState().course.selectedCRN,
      selectedCourse: store.getState().course.selectedCourse,
      selectedCourseArray: store.getState().course.selectedCourseArray,
      oldId: courseArray[0].id,
    };
  }
};

export const addSelectCourse = (crnPara, selectedCourseArrayPara) => {
  const courseArray = store
    .getState()
    .calendar.calendarCourseBag.filter(
      (item) =>
        item.raw.selectedCourseArray ==
        selectedCourseArrayPara
    );

  const selectedCoursePara = selectedCourseArrayPara.find(
    ({ crn }) => crn === crnPara
  );

  if (!Array.isArray(courseArray) || !courseArray.length) {
    // add new course
    return {
      type: ADD_COURSE_TO_CAL,
      selectedCRN: crnPara,
      selectedCourse: selectedCoursePara,
      selectedCourseArray: selectedCourseArrayPara,
    };
  } else {
    // add same course different crn
    return {
      type: UPDATE_COURSE_IN_CAL,
      selectedCRN: crnPara,
      selectedCourse: selectedCoursePara,
      selectedCourseArray: selectedCourseArrayPara,
      oldId: courseArray[0].id,
    };
  }
};

export const removeCurrCourse = () => {
  return {
    type: REMOVE_COURSE_FROM_CAL,
    selectedCRN: store.getState().course.selectedCRN,
  };
};

export const previewCurrCourse = (previewSwitch) => {
  if (previewSwitch) {
    return {
      type: PREVIEW_COURSE_IN_CAL,
      selectedCRN: store.getState().course.selectedCRN,
      selectedCourse: store.getState().course.selectedCourse,
      selectedCourseArray: store.getState().course.selectedCourseArray,
    };
  } else {
    return {
      type: CLEAR_PREVIEW_COURSE_IN_CAL,
      selectedCRN: store.getState().course.selectedCRN,
      selectedCourse: store.getState().course.selectedCourse,
      selectedCourseArray: store.getState().course.selectedCourseArray,
    };
  }
};

export const addCustomEvent = (inputEvent) => {
  return {
    type: ADD_CUS_EVENT_IN_CAL,
    event: inputEvent,
  };
};
