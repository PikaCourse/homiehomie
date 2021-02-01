/**
 * File name:	event.js
 * Created:	01/31/2021
 * Author:	Weili An, Marx Wang, Joanna Fang
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	Event react component for dnd calendars
 */

import React from "react";
import { EventType } from "../utils";

/**
 * Event component for calendar
 * @param {event} event: Event to be added to the calendar, has the following structure:
 */

// TODO Waiting for design for this
// todo check for prop type
export const Event = (props) => {
  // Cast as EventType obj
  const event = Object(EventType, props.event);
  // TODO Add support for poping window, delete button, etc.
  return (
    <div>
      <p className="mt-1 mb-0" style = {{fontFamily:'Montserrat'}}><strong>{event.title}</strong> </p>
      {/* <span>{event.event.name}</span> */}
      
      {/* <p className="" style = {{fontFamily:'Montserrat'}}>{event.event.raw.instructor}</p> */}
    </div>
  );
};
