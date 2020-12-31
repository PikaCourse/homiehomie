import {
  ADD_COURSE_TO_CAL,
  REMOVE_COURSE_FROM_CAL,
  UPDATE_COURSE_IN_CAL,
  PREVIEW_COURSE_IN_CAL,
  CLEAR_PREVIEW_COURSE_IN_CAL,
  ADD_CUS_EVENT_IN_CAL,
  DO_NOTHING, 
  REMOVE_CUS_EVENT_IN_CAL, 
} from "./types";
import store from "../store";

export const addCurrCourse = () => {
  const courseArray = store
    .getState()
    .calendar.calendarCourseBag.filter(
      (item) =>
        ((item.raw.selectedCourseArray ==
        store.getState().course.selectedCourseArray) && (item.type != 'preview'))
    );
  // console.log("addCurrCourse start");
  // console.log(!Array.isArray(courseArray) || !courseArray.length); 
  // console.log("addCurrCourse end");
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
      (item) => (item.raw.selectedCourseArray == selectedCourseArrayPara) || (item.type == 'preview')
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
  // let foundCourseArray = store.getState().calendar.calendarCourseBag.find((existingEvent) => {
  //   (existingEvent.raw.crn == store.getState().course.selectedCourse.crn)
  // });
  let foundCourseArray = store.getState().calendar.calendarCourseBag.find(
    ({type, raw}) => type != 'preview' && raw.crn === store.getState().course.selectedCourse.crn
  );
  let foundCourse = (typeof foundCourseArray != "undefined" && store.getState().calendar.calendarCourseBag.length != 0); 
  // console.log("preview condition start"); 
  // console.log(typeof foundCourse != "undefined"); 
  // console.log(store.getState().calendar.calendarCourseBag); 
  // console.log(store.getState().calendar.calendarCourseBag.length == 0); 
  // console.log((typeof foundCourse != "undefined" || store.getState().calendar.calendarCourseBag.length == 0)); 
  // console.log((typeof foundCourse != "undefined" || store.getState().calendar.calendarCourseBag.length == 0) && previewSwitch); 
  // console.log(typeof foundCourse == "undefined" && store.getState().calendar.calendarCourseBag.length != 0); 
  // console.log(typeof foundCourseArray != "undefined"); 
  // console.log(store.getState().calendar.calendarCourseBag); 
  // console.log(foundCourseArray); 
  // console.log(store.getState().calendar.calendarCourseBag); 
  // console.log(store.getState().course.selectedCourse.crn); 
  // console.log("preview condition end"); 

  if (previewSwitch && foundCourse) {
    return {
      type: CLEAR_PREVIEW_COURSE_IN_CAL,
      selectedCRN: store.getState().course.selectedCRN,
      selectedCourse: store.getState().course.selectedCourse,
      selectedCourseArray: store.getState().course.selectedCourseArray,
    }; 
  } else if (previewSwitch) {
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

export const removeCustomEvent = (inputEvent) => {
  return {
    type: REMOVE_CUS_EVENT_IN_CAL,
    event: inputEvent,
  };
};

// export const changeSelected = () => {

// }
