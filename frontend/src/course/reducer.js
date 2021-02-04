/**
 * File name:	reducerr.js
 * Created:	01/28/2021
 * Author:	Weili An
 * Email:	china_aisa@live.com
 * Version:	1.0 Initial file
 * Description:	Reducer for course summary
 */

import { createReducer } from "@reduxjs/toolkit";
import { timeObjFommatter } from "../helper/global";

// TODO Set error message
import { message } from "antd";


import * as action from "./action";

function messageUnknownError() {
  message.error("Oops! Something went wrong...");
}

// TODO Need documentation for states
const initialState = {
  selectedCourseArray: [],
  selectedCourse: {},
  option: [],
};

// TODO rename option to options
// todo option store whole course meta objects
export default createReducer(initialState, {
  /**
   * Reducer for getCourseSections action
   * Perform time string preprocessing and assign selected
   * course to be the first in the returned array
   */
  [action.getCourseSections.fulfilled]: (state, action) => {
    // Reducer for getting course sections under a specified course

    // Clear current search options
    state.option = [];

    // Handle error
    if (action.payload.length == 0) {
      message.error("Oops! This course cannot be found...");
    } else {
      // Precompute timeStr to save computation cost
      const sections = action.payload.map((section) => {
        return {
          ...section,
          timeStr: timeObjFommatter(section.time)
        };
      });
      // Default selected course is the first in the returned array
      state.selectedCourse = sections[0];
      state.selectedCourseArray = sections;
    }
  },
  [action.getCourseSections.rejected]: () => {
    messageUnknownError();
  },

  /**
   * Reducer for getCourses action
   * Return list of search options to select for `AutoComplete`
   */
  [action.getCourses.fulfilled]: (state, action) => {
    // Reducer for getting courses list with given query setting
    let strlist = action.payload.map((x) => ({ value: x.title }));
    state.option = strlist;
  },
  [action.getCourses.rejected]: () => {
    messageUnknownError();
  },

  /**
   * Reducer for clearCourses action
   * Clear the available search option
   */
  [action.clearCourses]: (state) => {
    state.option = [];
  },

  /**
   * Reducer for selectCourse action
   * Set the current selected course via matching course id
   */
  [action.selectCourse.fulfilled]: (state, action) => {
    state.option = [];
    // Set the current selected course to be the one in the course list that
    // has the matching course id
    const sections = action.payload.courses.map((section) => {
      return {
        ...section,
        timeStr: timeObjFommatter(section.time)
      };
    });
    state.selectedCourse = sections.find(
      course => course.id == action.payload.selectedCourseId
    );
    state.selectedCourseArray = sections;
  },
  [action.selectCourse.rejected]: () => {
    messageUnknownError();
  },


  // TODO The following should be internal state instead of redux
  /**
   * Reducer for setCourseByProf
   */
  [action.setCourseByProf]: (state, action) => {
    const selectedProf = action.payload;
    state.selectedCourse = state.selectedCourseArray.find(({ professor }) => professor == selectedProf);
  },

  /**
   * Reducer for setCourseByTime
   */
  [action.setCourseByTime]: (state, action) => {
    // Select the course
    const selectedTime = action.payload;
    const selectedProf = state.selectedCourse.professor;
    state.selectedCourse = state.selectedCourseArray.find(
      ({professor, timeStr}) => {
        return professor == selectedProf && timeStr == selectedTime;
      }
    );
  },
});