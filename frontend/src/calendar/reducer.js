/**
 * File name:	reducer.js
 * Created:	01/31/2021
 * Author:	Weili An, Joanna Fang, Marx Wang
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	reducer definition for calendar action, ported from `reducer/calendar.js`
 */

import * as actions from "./action";
import { createReducer } from "@reduxjs/toolkit";
import { loadState } from "../../src/helper/localStorage";

const initialState = {
  courseSchedule: loadState("calendar/courseSchedule", {}),
  customEvents: loadState("calendar/customEvents", {}),
  nextEventId: 0
};

/** 
 * Reducers for calendar 
 */
export default createReducer(initialState, {
  /**
   * Reducer for calendar/addCourse action
   * Will add/update a course object into internal state
   * with course title as key
   */
  [actions.addCourseToCalendar]: (state, action) => {
    const newCourse = action.payload;
    state.courseSchedule[newCourse.course_meta.title+newCourse.type] = newCourse;
  },

  /**
   * Reducer for calendar/removeCourse action
   * Remove course in state via course title
   * Will ignore nonexisting course.title
   */
  [actions.removeCourseFromCalendar]: (state, action) => {
    delete state.courseSchedule[action.payload]; 
  },

  /**
   * Reducer for calendar/merge action
   */
  [actions.mergeCalendar]: (state, action) => {
    const otherCourseSchedule = action.payload.courses;
    const otherCustomEvents = action.payload.events;
    state.courseSchedule = Object.assign({}, state.courseSchedule, otherCourseSchedule);
    state.customEvents = Object.assign({}, state.customEvents, otherCustomEvents);
  },

  /**
   * Reducer to add a custom event to calendar
   * With the event object as action.payload
   * Will dynamically create a unique id for internal app reference
   */
  [actions.addEventToCalendar]: (state, action) => {
    let eventObj = action.payload;
    eventObj.id = ++state.nextEventId;

    // Force event type to not be course
    eventObj.type = eventObj.type != "course" ? eventObj.type : "custom";
    // Object key as string
    state.customEvents["" + eventObj.id] = eventObj;
  },

  /** 
   * Reducer to update a custom event via id
   */
  [actions.updateEventInCalendar]: (state, action) => {
    const eventId = action.payload.id;
    const event = action.payload.event;

    // Protect modification
    if (state.customEvents[eventId]["type"] == "protected")
      return;
    for (const key in event) {
      // Forbid modification of this field
      if (key != "type")
        state.customEvents[eventId][key] = event[key];
    }
  },

  /**
   * Reducer to remove a event from calendar
   */
  [actions.removeEventInCalendar]: (state, action) => {
    // Object key as string
    delete state.customEvents["" + action.payload];
  },

  /**
   * Reducer to clear all custom events in the calendar
   */
  [actions.clearEventInCalendar]: (state) => {
    state.customEvents = {};
    state.nextEventId = 0;
  },

  /**
   * Reducer to set the event id
   */
  [actions.setEventId]: (state, action) => {
    state.nextEventId = action.payload;
  }
});
