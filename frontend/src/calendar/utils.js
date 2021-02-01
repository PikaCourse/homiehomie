/**
 * File name:	utils.js
 * Created:	01/31/2021
 * Author:	Weili An
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	Global utils for Calendar application
 */

/**
 * event data structure used by calendar
 */
export class EventType extends Object {
  id;           // event id, should be unique within calendar for custom event
  title;        // event title
  is_course;    // boolean, true for course schedule event, will prevent drag and drop
  all_day;      // boolean, true to display as all day
  start_at;     // event start Date object
  end_at;       // event end Date object
  detail;       // event detail
  location;     // vent location
}