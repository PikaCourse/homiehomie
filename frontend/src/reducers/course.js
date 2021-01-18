import {
  GET_COURSE,
  SET_COURSE,
  SET_COURSE_BY_PROF,
  SET_COURSE_BY_TIME,
  GET_COURSELIST,
} from "../actions/types.js";

const initialState = {
  selectedCourseArray: [],
  selectedCourse: {},
  option: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_COURSE:
      return {
        option: [],
        selectedCourse: action.payload[0],
        selectedCourseArray: action.payload,
      };
    case SET_COURSE:
      // debugger;
      return {
        option: [],
        selectedCourse: action.selectedCourse,
        selectedCourseArray: action.selectedCourseArray,
      };
    case SET_COURSE_BY_PROF:
      return {
        ...state,
        selectedCourse: action.selectedCourse,
      };
    case SET_COURSE_BY_TIME:
      return {
        ...state,
        selectedCourse: action.selectedCourse,
      };
    case GET_COURSELIST:
      let strlist = action.list.map((x) => ({ value: x.title }));
      return {
        ...state,
        option: strlist,
      };

    default:
      return state;
  }
}
