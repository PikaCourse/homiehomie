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


import * as action from "./action";

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
  },


  [action.getCourses.fulfilled]: (state, action) => {
    // Reducer for getting courses list with given query setting
    let strlist = action.payload.map((x) => ({ value: x.title }));
    state.option = strlist;
  },


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


  // TODO Merge the following two
  [action.setCourseByProf]: (state, action) => {
    const selectedProf = action.payload;
    state.selectedCourse = state.selectedCourseArray.find(({ professor }) => professor == selectedProf);
  },


  [action.setCourseByTime]: (state, action) => {
    // Select the course
    const selectedTime = action.payload;
    const selectedProf = state.selectedCourse.professor;
    state.selectedCourse = state.selectedCourseArray.find(
      ({professor, timeStr}) => {
        // console.log(`Professor${professor}\tProf: ${professor == selectedProf}\tTime: ${timeStr == selectedTime}`);
        return professor == selectedProf && timeStr == selectedTime;
      }
    );
  },
});