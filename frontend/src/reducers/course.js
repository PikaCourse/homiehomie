import { GET_COURSE, SET_COURSE, GET_COURSELIST } from "../actions/types.js";

const initialState = {
  selectedCourseArray: [],
  selectedCourse: {},
  selectedCRN: 0,
  option: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_COURSE:
      return {
        option: [],
        selectedCRN: action.payload[0].crn,
        selectedCourse: action.payload[0],
        selectedCourseArray: action.payload,
      };
    case SET_COURSE:
      return {
        option: [],
        selectedCRN: action.selectedCRN,
        selectedCourse: action.selectedCourse,
        selectedCourseArray: action.selectedCourseArray,
      };
    case GET_COURSELIST:
      //console.log("from getcourseList");
      let objlist = action.list.slice(0,10);
      //console.log(objlist);
      let strlist = objlist.map(x => ({value: x.title}))
      //console.log(objlist);
      //console.log(strlist);
      return {
        ...state,
        option: strlist
      };
    default:
      return state;
  }
}
