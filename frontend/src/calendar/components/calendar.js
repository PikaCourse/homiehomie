/**
 * File name:	calendar.js
 * Created:	01/31/2021
 * Author:	Weili An, Joanna Fang
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	Calendar component for PikaCourse, 
 *              based on https://github.com/jquense/react-big-calendar
 */

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Calendar as bgCalendar, Views, momentLocalizer} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { useSelector, connect, useDispatch } from "react-redux";
import { addEventToCalendar, updateEventInCalendar, removeEventInCalendar } from "../action";
import { Event as CalendarEvent } from "./event";
import { selectCourse } from "../../course/action";

// TODO Organize css and other static files!
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import "react-big-calendar/lib/sass/styles.scss";
import "../../../static/scss/calendar.scss";
import { flattenEvents, flattenCourse } from "./utils";
import { EventType } from "../utils";
import { getNextColor, getColor } from "./utils/color.js";
import store from "../../store";


// Date internationalization and localization
const localizer = momentLocalizer(moment);  
let formats = {
  dayFormat: (date) => moment.utc(date).format("ddd"), //https://devhints.io/moment
  timeGutterFormat: "HH:mm",
  eventTimeRangeFormat: ({ start, end }, culture, local) =>
    local.format(start, "HH:mm", culture) + " – " + local.format(end, "HH:mm", culture),

};
// Enable Drag and Drop addon
// TODO Need a custom layout algorithm as the calendar will default to width of 50%
const DraggableCalendar = withDragAndDrop(bgCalendar);

/**
 * PikaCourse calendar application code
 * @param {*} props Props of Calendar component
 */
function Calendar(props) {
  // Own state
  // Selected event
  const [selectedEvent, setSelectedEvent] = useState({});
  const [calendarView, setCalendarView] = useState(Views.WEEK);

  // onResize callback to control views for calendar
  // TODO Need a better way to handle this?
  const calContainer = useRef();  // Use to get calendar width
  useEffect(() => {
    function updateCalendarView() {
      const width = calContainer.current.offsetWidth;
      if (width > 700) {
        setCalendarView(Views.WEEK);
      } else if (width > 500) {
        setCalendarView(Views.WORK_WEEK);
      } else {
        setCalendarView(Views.DAY);
      }
    }
    window.addEventListener("resize", updateCalendarView);
    updateCalendarView();
    return () => {
      window.removeEventListener("resize", updateCalendarView);
    };
  });

  // Utility functions
  const dispatch = useDispatch();
  // Get the shared state in redux store
  const courseSchedule = useSelector(state => state.calendar.courseSchedule);
  const customEvents = useSelector(state => state.calendar.customEvents);

  // Flatten schedule and custom events as a single event array used by react-big-calendar
  // for rendering
  const courseEventArray = flattenCourse(courseSchedule);
  const customEventArray = flattenEvents(customEvents);
  const events = courseEventArray.concat(customEventArray);

  // Styling
  const getEventStyle = (event, _0, _1, isSelected) => {
    // Normal styling
    const eventColor = getColor(event.id);
    let eventStyle = {
      backgroundColor: eventColor.weak,
      color: eventColor.strong,
      fontSize: "100%",
      borderRadius: "0px",
      border: "none",
      boxShadow: "none",
      zIndex: "10",
    };

    // If selected, change styling
    // Change styling for all sectios of a single course section
    if (isSelected || 
        (selectedEvent.type == "course" 
          && event.type == "course" 
          && event.id == selectedEvent.id)) {
      eventStyle.backgroundColor = eventColor.strong;
      eventStyle.color = "white";
      eventStyle.boxShadow = `6px 4px 30px ${eventColor.weak}`;
      eventStyle.border = "none";
    }

    return {
      className: "",
      style: eventStyle,
    };
  };

  // Callbacks
  /**
   * Callback when a time slot is selected
   * See http://jquense.github.io/react-big-calendar/examples/index.html#prop-onSelectSlot
   * for more info
   * Show create a popup window similar to when you clicking an event
   * and allow user to enter information
   * @param {Object} slotInfo 
   * @param {Object} box 
   */
  const createNewEvent = (slotInfo) => {
    // TODO Fire a modal for creating new event
    console.log(slotInfo);
    let newAnonymousEvent = {
      id: 0, 
      title: "new custom event",
      type: "custom",
      all_day: slotInfo.slots.length == 1,
      start_at: slotInfo.start,
      end_at: slotInfo.end,
      detail: "", 
      location: "", 
      meta: "", 
      // first_created: true, 
      onSelect: true, 
    };
    store.dispatch(addEventToCalendar(newAnonymousEvent)); 
    
  };

  // TODO Other callbacks

  /**
   * Callback when an event is selected
   * @param {Object} event event object
   */
  const onSelectEvent = (event) => {
    // Update selected event
    setSelectedEvent(event);

    // let a = store.getState().calendar.customEvents[event.id]["onSelect"];
    if (event.type == "custom") {
      let updatedEvent = {
        id: event.id, 
        title: event.title,
        type: event.type,
        all_day: event.all_day,
        start_at: event.start_at,
        end_at: event.end_at,
        detail: event.detail, 
        location: event.location, 
        meta: event.meta, 
        onSelect: true, 
      };
      store.dispatch(updateEventInCalendar({id: event.id, event: updatedEvent})); 
    }

    // Select the course<
    if (event.type == "course")
      dispatch(
        selectCourse({
          // For course type event, event.meta is the course object
          title: event.meta.course_meta.title, 
          courseId: event.meta.id
        }));
  };

  const updateEvent = ({ event, start, end, }) => {
    let updatedEvent = {
      id: event.id, 
      title: event.title,
      type: event.type,
      all_day: event.all_day,
      start_at: start,
      end_at: end,
      detail: event.detail, 
      location: event.location, 
      meta: event.meta, 
      onSelect: event.onSelect, 
    };
    store.dispatch(updateEventInCalendar({id: event.id, event: updatedEvent})); 
  }; 

  // Rendering
  return (
    <div
      className="p-4 mt-4"
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "1.5rem",
        overflowY: "auto",
        height: "82vh",
      }}
      ref={calContainer}
    >
      <DraggableCalendar 
        // General setting
        localizer={localizer}
        events={events}

        // Event object accessor
        titleAccessor="title"     // Use `.title` to access event title
        allDayAccessor="all_day"  // same as above
        startAccessor="start_at"
        endAccessor="end_at"

        // Format setting
        view={calendarView}
        views={[Views.DAY, Views.WORK_WEEK, Views.WEEK]}
        onView={() => {}}
        defaultView={Views.WEEK}  // Week format view
        formats={formats}
        showMultiDayTimes={true}
        step={15}
        timeslots={2}
        // Disable toolbar since not needed right now
        // TODO Use custom toolbar
        toolbar={false}
        components={{
          event: CalendarEvent,
        }}
        scrollToTime={
          new Date(
            2021,
            1,
            31,
            9,
            0,
            0,
          )
        }
        eventPropGetter={getEventStyle}
        popup={true}
        // TODO Styling for slot

        // Create new custom event on calendar
        selectable={true}
        onSelectSlot={createNewEvent}

        // Select event, check if course
        // if so, select all courses in same section
        onSelectEvent={onSelectEvent}

        // Drag and drop control related
        resizable={true}
        onEventDrop={updateEvent}
        onEventResize={updateEvent}
      />
    </div>
  );
}

export default connect(null, null)(Calendar);
