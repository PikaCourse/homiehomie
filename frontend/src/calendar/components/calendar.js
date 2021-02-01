/**
 * File name:	calendar.js
 * Created:	01/31/2021
 * Author:	Weili An
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	Calendar component for CourseOceans, 
 *              based on https://github.com/jquense/react-big-calendar
 */

import React, { useState } from "react";
import { Calendar as bgCalendar, Views, momentLocalizer} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { useSelector, connect } from "react-redux";
import { addEventToCalendar, removeEventInCalendar } from "../action";
import { event as calendarEvent } from "./event";
import { selectCourse } from "../../course/action";

// TODO Organize css and other static files!
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import "react-big-calendar/lib/sass/styles.scss";
import "../../../static/scss/calendar.scss";
import { EventType, flattenEvents, flattenCourse } from "./utils";
import { colors, pcolors } from "./utils/color.js";

// Date internationalization and localization
const localizer = momentLocalizer(moment);  
let formats = {
  dayFormat: (date, culture, localizer) => moment.utc(date).format("ddd"), //https://devhints.io/moment
};
// Enable Drag and Drop addon
const DraggableCalendar = withDragAndDrop(bgCalendar);

/**
 * CourseOcean calendar application code
 * @param {*} props Props of Calendar component
 */
function Calendar(props) {
  // Get the state in redux store
  const courseSchedule = useSelector(state => state.calendar.courseSchedule);
  const customEvents = useSelector(state => state.calendar.customEvents);

  // Flatten schedule and custom events as a single event array used by react-big-calendar
  // for rendering
  const courseEventArray = flattenCourse(courseSchedule);
  const customEventArray = flattenEvents(customEvents);
  const events = courseEventArray.concat(customEventArray);

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
    >
      <DraggableCalendar 
        localizer={localizer}
        events={events}
        defaultView={Views.WEEK}  // Week format view
        titleAccessor="title"     // Use `.title` to access event title
        allDayAccessor="all_day"  // same as above
        startAccessor="start_at"
        endAccessor="end_at"
        formats={formats}
        showMultiDayTimes={false}
      />
    </div>
  );
}

export default connect(null, null)(Calendar);
