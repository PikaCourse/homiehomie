/**
 * File name:	course.js
 * Created:	01/18/2021
 * Author:	Marx Wang, Joanna Fang, Anna Zhang
 * Email:	foo@bar.com
 * Version:	1.0 Initial file
 * Description:	Action creators for course related actions
 */

import axios from "axios";
import store from "../store";
import {
  GET_COURSE,
  SET_COURSE,
  SET_COURSE_BY_PROF,
  SET_COURSE_BY_TIME,
} from "./types";
import { GET_COURSELIST } from "./types";
import { year, semester, courseDataPatch, school } from "../helper/global";
import { message } from "antd";

export const getCourse = (title) => (dispatch) => {
  // Get the course section list via the title and hardcoded year, semester, and school parameters
  // TODO Add support for other filter options listed in the API doc
  // TODO Need to add school filter
  // TODO Use querystringify
  axios
    .get(`api/courses?title=${title}&year=${year}&semester=${semester}`)
    .then((res) => {
      if (!res.data.length) message.error("This course do not exist");
      else
        dispatch({
          type: GET_COURSE,
          payload: courseDataPatch(res.data),
        });
    })
    .catch((err) => console.log(err));
};

export const getCourseList = (title) => (dispatch) => {
  // Get the course meta list via title and hardcoded year, semester, and school parameters
  axios
    .get(
      `api/coursesmeta?title=${title}&year=${year}&limit=15&semester=${semester}`
    )
    .then((res) => {
      dispatch({
        type: GET_COURSELIST,
        list: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// TODO Change from setXXX to selectXXX
// TODO Should check if the current cache hosts the course list?
// TODO And also this function is quite identical to GET_COURSE, consider merging
export const setCourse = (courseId, title) => (dispatch) => {
  axios
    .get(
      `api/courses?title=${title}&year=${year}&semester=${semester}&school=${school}`
    )
    .then((res) => {
      if (!res.data.length) message.error("This course do not exist");
      else {
        var selectedCourse = res.data.find(element => element.id == courseId); 
        dispatch({
          type: SET_COURSE,
          selectedCourse: selectedCourse,
          selectedCourseArray: courseDataPatch(res.data),
        });
      }
        
    })
    .catch((err) => console.log(err));
  // return {
  //   type: SET_COURSE,
  //   selectedCourse: courseBag.selectedCourse,
  //   selectedCourseArray: courseBag.selectedCourseArray,
  // };
};

// The following actions change on the current course list so do not
// need to get from remote APIs
export const setCourseByProf = (prof) => {
  return {
    type: SET_COURSE_BY_PROF,
    selectedCourse: store
      .getState()
      .course.selectedCourseArray.find(({ professor }) => professor == prof),
  };
};

export const setCourseByTime = (time) => {
  const currSelectedCourseProf = store.getState().course.selectedCourse
    .professor;
  return {
    type: SET_COURSE_BY_TIME,
    selectedCourse: store
      .getState()
      .course.selectedCourseArray.find(
        ({ professor, timeString }) =>
          professor == currSelectedCourseProf && timeString == time
      ),
  };
};
