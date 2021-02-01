/**
 * File name:	index.js
 * Created:	01/31/2021
 * Author:	Weili An
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	Helper functions for calendar app
 */

import {EventType} from "../../utils";

// TODO Need tests

/**
 * Get the Date object this week with the weekday specified
 * @param {int} weekday 0-6: mon-sun
 */
function getCurrentWeekDate(weekday) {
  let now = new Date();

  // Convert from our own weekday representation (0-6: mon-sun) 
  // to the standard one (0-6: sun-sat)
  const desired_day = (weekday + 1) % 7;
  const current_day = now.getDay();
  const diff_days = desired_day - current_day;

  // Returned the offseted Date object
  now.setDate(now.getDate() + diff_days);
  return now;
}

/**
 * Return Date object for this week
 * @param {int} weekday 0-6: mon-sun
 * @param {string} time HH:MM
 */
function adjustCourseTime(weekday, time) {
  let result = getCurrentWeekDate(weekday);
  let tmp = time.split(":");
  const hour = tmp[0];
  const minute = tmp[1];
  result.setHours(hour, minute);
  return result;
}

/**
 * Convert course schedule to acceptable event array
 * @param {Object} courses courses in dictionary
 *  {
 *    key: {
 *            title:
 *            time: [
 *              {
 *                weekday:
 *                start_at: HH:MM
 *                end_at: HH:MM
 *              }
 *            ]
 *          }
 *  }
 * 
 * @return {[EventType]}
 */
export function flattenCourse(courses) {
  let result = [];

  // Null check
  if (courses != null) {
    for (const key in courses) {
      const course = courses[key];

      // Null check
      if (course != null) {
        // Check if ASYNC or time not provided
        if (course.time == []) {
          let event = new EventType();
          // General
          event.id = -1;  // Special id for course event
          event.title = course.course_meta.title;
          event.is_course = true;

          // Empty time
          event.all_day = true;

          // Assign whole week (Mon-Fri) for this course
          event.start_at = getCurrentWeekDate(0);
          event.end_at = getCurrentWeekDate(4);

          // More info
          event.detail = `${course.type}\nTime not found, could be async`;
          event.location = course.locatioon;
        } else {
          // Create single event for each individual time section
          course.time.forEach((timeSlot) => {
            let event = new EventType();
            event.id = -1;  // Special id for course event
            event.title = course.course_meta.title;
            event.is_course = true;

            // Time
            event.all_day = false;
            event.start_at = adjustCourseTime(timeSlot.weekday, timeSlot.start_at);
            event.end_at = adjustCourseTime(timeSlot.weekday, timeSlot.end_at);

            // More info
            event.detail = course.type;
            event.location = course.location;

            result.push(event);
          });
        }
      }
    }
  }
  return result;
}


/**
 * Convert events dict to acceptable event array
 * @param {Object} events events in dictionary
 *  {
 *    key: EventType
 *  }
 * 
 * @return {[EventType]}
 */
export function flattenEvents(events) {
  let result = [];

  // Null check
  if (events != null) {
    for (const key in events) {
      // Null check
      if (events[key] != null) {
        result.push(events[key]);
      }
    }
  }
  return result;
}