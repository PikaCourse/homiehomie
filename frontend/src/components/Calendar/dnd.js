import React from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
const mlocalizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import "react-big-calendar/lib/sass/styles.scss";
import '../../../static/scss/calendar.scss'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setCourse } from "../../actions/course";
import {addCustomEvent} from "../../actions/calendar"
import store from "../../store";
import {EventComponent} from "./EventComponent"
import {colors} from "./color.js";

let formats = {

  dayFormat: (date, culture, localizer) =>
    moment.utc(date).format('ddd') //https://devhints.io/moment
}
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
    courselist: PropTypes.array.isRequired,
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
      if (existingEvent.id == event.id)
      {
        existingEvent.start = start; 
        existingEvent.end = end; 
        store.dispatch(addCustomEvent(existingEvent));
      }
      return existingEvent;
      // return existingEvent.id == event.id
      //   ? { ...existingEvent, start, end }
      //   : existingEvent;
    });

    this.setState({
      events: nextEvents,
    });

    console.log("moveEvent"); 
    console.log(nextEvents);

    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  };

  resizeEvent = ({ event, start, end }) => {
    console.log("resizeEvent"); 
    const { events } = this.state;

    const nextEvents = events.map((existingEvent) => {
      // console.log("existingEvent");
      // console.log(existingEvent);
      // console.log("event");
      // console.log(event); 
      // console.log("existingEvent.id: "+existingEvent.id); 
      // console.log("event.id: "+event.id); 
      // console.log("start: "+start);
      // console.log("end: "+end); 
      if (existingEvent.id == event.id)
      {
        existingEvent.start = start; 
        existingEvent.end = end; 
        store.dispatch(addCustomEvent(existingEvent));
      }
      return existingEvent;
      // return existingEvent.id == event.id
      //   ? { ...existingEvent, start, end }
      //   : existingEvent;
    });

    this.setState({
      events: nextEvents,
    });
    // store.dispatch(addCustomEvent(nextEvents));
    console.log(nextEvents);

    // alert(`${event.title} was resized to ${start}-${end}`);
  };

  newEvent(event) {
    let idList = this.state.events.map((a) => a.id);
    if (this.props.courselist.length == 0) {
      var newId = 0;
    }
    else {
      var newId = this.props.courselist[this.props.courselist.length -  1].id + 1;
    } //this.state.events.length == 0 ? 0 : Math.max(...idList) + 1;
    let hour = {
      id: newId,
      title: event.title,
      allDay: event.slots.length == 1,
      start: event.start,
      end: event.end,
      crn: event.crn,
      raw: event.raw,
    };
    this.setState({
      events: this.state.events.concat([hour]),
    });
    store.dispatch(addCustomEvent(hour)); 
    console.log("newEvent"); 
    console.log(hour); 
  }

  eventStyleHandler = (event, start, end, isSelected) => {
    // console.log(colors);
    let newStyle = {
      backgroundColor: colors[event.id].weak,
      color: colors[event.id].strong,
      fontSize:'70%',
      borderRadius: "0px",
      border: "none",
      boxShadow:"none",
      zIndex:"10"
    };

    if (isSelected){
      newStyle.backgroundColor = colors[event.id].strong;
      newStyle.color = 'white';
      newStyle.boxShadow = "6px 4px 30px " + colors[event.id].weak;
    }

    return {
      className: "",
      style: newStyle
    };
  }

  render() {
    return (
      <DragAndDropCalendar
        min={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 0, 0)}
        max={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 22, 0, 0)}
        showMultiDayTimes = {false}
        formats = {formats}
        style={{ height: 1000 }}
        selectable
        localizer={mlocalizer}
        events={this.props.courselist} //data input
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
          event: EventComponent
        }}
        eventPropGetter={this.eventStyleHandler}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  course: state.course.course,
  calendar: state.calendar,
  courselist: state.calendar.calendarCourseBag,
  //preview: state.preview
});

export default connect(mapStateToProps)(Dnd);
