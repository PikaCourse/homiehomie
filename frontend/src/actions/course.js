import axios from "axios";
import store from "../store";
import { GET_COURSE, SET_COURSE, SET_COURSE_BY_PROF } from "./types";
import { year, semester, courseDataPatch } from "../helper/global";

export const getCourse = (title) => (dispatch) => {
  axios
    .get(`api/courses?title=${title}&year=${year}&semester=${semester}`)
    .then((res) => {
      dispatch({
        type: GET_COURSE,
        payload: courseDataPatch(res.data),
      });
    })
    .catch((err) => console.log(err));
};

// courseBag = {selectedCourse, selectedCourseArray}
export const setCourse = (courseBag) => {
  return {
    type: SET_COURSE,
    selectedCRN: courseBag.selectedCRN,
    selectedCourse: courseBag.selectedCourseArray.find(
      ({ crn }) => crn === courseBag.selectedCRN
    ),
    selectedCourseArray: courseBag.selectedCourseArray,
  };
};

export const setCourseByProf = (prof) => {
  return {
    type: SET_COURSE_BY_PROF,
    selectedCourse: store
      .getState()
      .course.selectedCourseArray.find(({ professor }) => professor == prof),
  };
};
