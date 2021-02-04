/**
 * File name:	action.js
 * Created:	01/31/2021
 * Author:	Weili An, Joanna Fang, Marx Wang
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	action definition for calendar, ported from `action/calendar.js`
 */

import { createAction } from "@reduxjs/toolkit";


// TODO Consider name as schedule instead of calendar as it is more intuitive?

/**
 * Action to add a course to calendar
 * Will ignore repeated course (by course title)
 * Accept the whole course object as payload
 * Payload: {course object}
 */
export const addCourseToCalendar = createAction("calendar/addCourse");

/**
 * Action to remove a course from calendar
 * Will ignore nonexisting course
 * Accept course title as payload
 * Payload: course title (e.g. CS 38100)
 */
export const removeCourseFromCalendar = createAction("calendar/removeCourse");

/**
 * Action to merge the currrent calendar with payload
 * custom event specified in events key
 * course specified in courses key
 * payload: {
 *    events: {},
 *    courses: {}
 * }
 */
export const mergeCalendar = createAction("calendar/merge");

/**
 * Action to add a custom event to calendar
 * Will add a new event to calendar regradless of content 
 *  (i.e. two same title events) can coexist
 * payload: EventType
 */
export const addEventToCalendar = createAction("calendar/addEvent");

/**
 * Action to update custom event in calendar
 * Support partial update
 * payload: {
 *  id: event id from state
 *  event: EventType
 * }
 */
export const updateEventInCalendar = createAction("calendar/updateEvent");

/**
 * Action to remove a custom event in calendar
 * Use event id as reference to delete key
 * Payload: eventId
 */
export const removeEventInCalendar = createAction("calendar/removeEvent");

/**
 * Action to clear custom events in calendar
 * Equivalent of deleting all events from calendar
 */
export const clearEventInCalendar = createAction("calendar/clearEvent");

/**
 * Action to set event id start point
 */
export const setEventId = createAction("calendar/setEventId");