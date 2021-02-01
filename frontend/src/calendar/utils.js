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
  type;         // string, take values from ["course", "custom", "protected"]
  all_day;      // boolean, true to display as all day
  start_at;     // event start Date object
  end_at;       // event end Date object
  detail;       // event detail
  location;     // event location
  meta;         // other info related to event
}