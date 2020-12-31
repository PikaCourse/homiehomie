import React from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
const mlocalizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import "react-big-calendar/lib/sass/styles.scss";
import "../../../static/scss/calendar.scss";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setCourse } from "../../actions/course";
import { addCustomEvent } from "../../actions/calendar";
import store from "../../store";
import { EventComponent } from "./EventComponent";
import { colors, pcolors } from "./color.js";

let formats = {
  dayFormat: (date, culture, localizer) => moment.utc(date).format("ddd"), //https://devhints.io/moment
};
const today = new Date();
class Dnd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      displayDragItemInCell: true,
    };

    this.moveEvent = this.moveEvent.bind(this);
    this.newEvent = this.newEvent.bind(this);
  }

  static propTypes = {
    course: PropTypes.array.isRequired,
    calendar: PropTypes.array.isRequired,
    calendarCourseBag: PropTypes.array.isRequired,
  };

  handleDragStart = (event) => {
    this.setState({ draggedEvent: event });
    store.dispatch(addCustomEvent(event));
  };

  dragFromOutsideItem = () => {
    return this.state.draggedEvent;
  };

  onDropFromOutside = ({ start, end, allDay }) => {
    const { draggedEvent } = this.state;

    const event = {
      id: draggedEvent.id,
      title: draggedEvent.title,
      start,
      end,
      allDay: allDay,
    };

    this.setState({ draggedEvent: null });
    this.moveEvent({ event, start, end });
  };

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state;

    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const nextEvents = events.map((existingEvent) => {
      if (existingEvent.id == event.id) {
        existingEvent.start = start;
        existingEvent.end = end;
        store.dispatch(addCustomEvent(existingEvent));
      }
      return existingEvent;
    });

    this.setState({
      events: nextEvents,
    });
  };

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state;

    const nextEvents = events.map((existingEvent) => {
      if (existingEvent.id == event.id) {
        existingEvent.start = start;
        existingEvent.end = end;
        store.dispatch(addCustomEvent(existingEvent));
      }
      return existingEvent;
    });
    this.setState({
      events: nextEvents,
    });
  };

  newEvent(event) {
    const title = window.prompt("New Event Name");
    if (title != null && title != "") {
      let idList = store.getState().calendar.calendarCourseBag.map((a) => a.id);
      var newId =
        store.getState().calendar.calendarCourseBag.length == 0
          ? 0
          : Math.max(...idList) + 1;
      let hour = {
        type: "custom",
        id: newId,
        title: title,
        allDay: event.slots.length == 1,
        start: event.start,
        end: event.end,
        crn: -1,
        raw: { selectedCourseArray: [] },
      };
      this.setState({
        events: this.state.events.concat([hour]),
      });
      store.dispatch(addCustomEvent(hour));
    }
  }

  eventStyleHandler = (event, start, end, isSelected) => {
    let currColor =
      event.type == "preview" ? pcolors[0] : colors[(event.id % 10) + 1];
    let newStyle = {
      backgroundColor: currColor.weak,
      color: currColor.strong,
      fontSize: "100%",
      borderRadius: "0px",
      border:
        event.type == "preview" ? "2px dashed " + currColor.strong : "none",
      boxShadow: "none",
      zIndex: "10",
    };

    if (isSelected) {
      newStyle.backgroundColor = currColor.strong;
      newStyle.color = "white";
      newStyle.boxShadow = "6px 4px 30px " + currColor.weak;
      newStyle.border =
        event.type == "preview" ? "2px dashed " + currColor.weak : "none";
      if (event.type != "custom")
        store.dispatch(
          setCourse({
            selectedCRN: event.raw.crn,
            selectedCourseArray: event.raw.selectedCourseArray,
          })
        );
    }

    return {
      className: "",
      style: newStyle,
    };
  };

  render() {
    return (
      <div className="p-2">
        <DragAndDropCalendar
          min={
            new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              7,
              0,
              0
            )
          }
          max={
            new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              22,
              0,
              0
            )
          }
          showMultiDayTimes={false}
          formats={formats}
          style={{ height: "80vh" }}
          selectable
          localizer={mlocalizer}
          events={this.props.calendarCourseBag} //data input
          onEventDrop={this.moveEvent}
          resizable={true}
          onEventResize={this.resizeEvent}
          onSelectSlot={this.newEvent}
          onDragStart={console.log}
          defaultView={Views.WEEK}
          defaultDate={today}
          popup={true}
          dragFromOutsideItem={
            this.state.displayDragItemInCell ? this.dragFromOutsideItem : null
          }
          onDropFromOutside={this.onDropFromOutside}
          handleDragStart={this.handleDragStart}
          views={{ week: true }}
          toolbar={false}
          components={{
            event: EventComponent,
          }}
          eventPropGetter={this.eventStyleHandler}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  course: state.course.course,
  calendar: state.calendar,
  calendarCourseBag: state.calendar.calendarCourseBag,
});

export default connect(mapStateToProps)(Dnd);
