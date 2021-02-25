/**
 * File name:	event.js
 * Created:	01/31/2021
 * Author:	Weili An, Marx Wang, Joanna Fang
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	Event react component for dnd calendars
 */

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import moment from 'moment';
import { Popover, message, Input, TimePicker, DatePicker, Space, Form, Button} from 'antd';
const { RangePicker } = TimePicker;
import { EventType } from "../utils";
import { addEventToCalendar, updateEventInCalendar, removeEventInCalendar } from "../action";
import store from "../../store";
import { useSelector, connect, useDispatch } from "react-redux";


/**
 * Event popup window component for calendar event
 * @param {object} props 
 */
const EventPopup = (props) => {
  const event = props.event;
  let disableEdit = false;
  if (event.type == "protected" || event.type == "course")
    disableEdit = true;
  const [title, setTitle] = useState(event.title);
  const [start, setStart] = useState(event.start_at);
  const [end, setEnd] = useState(event.end_at);
  const dispatch = useDispatch(); 
  const submitChanges = () => {
    let updatedEvent = {
      id: event.id, 
      title: title,
      type: event.type,
      all_day: event.all_day,
      start_at: start,
      end_at: end,
      detail: event.detail, 
      location: event.location, 
      meta: event.meta, 

    }; 
    store.dispatch(updateEventInCalendar({id: event.id, event: updatedEvent}));
  }
  const dateChangeHandler = (dates, dateStrings) => {
    setStart(dates[0]._d); 
    setEnd(dates[1]._d); 
  }; 
  return (
    // TODO Use form to control the data
    <div>
      <Input disabled={disableEdit} defaultValue={title} onChange={(e)=>setTitle(e.target.value)}/>
      <Space direction="horizontal" size="small">
        <DatePicker 
          defaultValue={moment(event.start_at)} 
          format="dddd, MMM Do"
          disabled={disableEdit}
        />
        {
          // TODO Fix width of range picker
        }
        <RangePicker
          defaultValue={[moment(event.start_at), moment(event.end_at)]}
          format="HH:mm"
          disabled={disableEdit}
          onChange={dateChangeHandler}
        />
        <Button onClick={submitChanges}>Update</Button>
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
      // Here is the pop up window for event after clicking
      content={popupWindow}
      trigger="click">
      
      {
        // Actual displayed event on Calendar
      }
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
