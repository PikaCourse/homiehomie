/**
 * File name:	event.js
 * Created:	01/31/2021
 * Author:	Weili An, Marx Wang, Joanna Fang
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	Event react component for dnd calendars
 */

import React from "react";
import moment from 'moment';
import { Popover, message, Input, TimePicker, DatePicker, Space, Form } from 'antd';
const { RangePicker } = TimePicker;
import { EventType } from "../utils";

/**
 * Event popup window component for calendar event
 * @param {object} props 
 */
const EventPopup = (props) => {
  const event = props.event;
  let disableEdit = false;
  if (event.type == "protected" || event.type == "course")
    disableEdit = true;
  return (
    // TODO Use form to control the data
    <div>
      <Input>
      </Input>
      <Space direction="horizontal" size="small">
        <DatePicker 
          defaultValue={moment(event.start_at)} 
          format="dddd, MMM Do"
          disabled={true}
        />
        {
          // TODO Fix width of range picker
        }
        <RangePicker
          defaultValue={[moment(event.start_at), moment(event.end_at)]}
          format="HH:mm"
          disabled={true}
        />
      </Space>
    </div>
  );
};

/**
 * Event component for calendar
 * @param {event} event: Event to be added to the calendar, has the following structure:
 */

// TODO Waiting for design for this
// todo check for prop type
export const Event = (props) => {
  // Cast as EventType obj
  const event = props.event;
  // TODO Add support for poping window, delete button, etc.
  const popupWindow = <EventPopup event={event}/>;
  return (
    <Popover 
      content={popupWindow}
      trigger="click">
      <div>
        <p className="mt-1 mb-0" style = {{fontFamily:'Montserrat'}}><strong>{event.title}</strong> </p>
        <p style = {{fontFamily:'Montserrat'}}>
          {event.location} <br />
          {event.detail}
        </p>
      </div>
    </Popover>
  );
};
