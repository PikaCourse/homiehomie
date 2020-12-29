import React from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import "react-big-calendar/lib/sass/styles.scss";
import '../../../static/scss/calendar.scss'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setCourse } from "../../actions/course";
import store from "../../store";

class Dnd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: this.props.courselist, //[],
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
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    this.setState({
      events: nextEvents,
    });

    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  };

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state;

    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    this.setState({
      events: nextEvents,
    });

    // alert(`${event.title} was resized to ${start}-${end}`);
  };

  newEvent(event) {
    let idList = this.state.events.map((a) => a.id);
    let newId = this.state.events.length == 0 ? 0 : Math.max(...idList) + 1;
    console.log(newId);
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
  }

  render() {
    return (
      <DragAndDropCalendar
        style={{ height: 1000 }}
        selectable
        localizer={localizer}
        events={this.props.courselist} //data input
        onEventDrop={this.moveEvent}
        resizable={true}
        onEventResize={this.resizeEvent}
        onSelectSlot={this.newEvent}
        onDragStart={console.log}
        defaultView={Views.WEEK}
        defaultDate={new Date(2015, 3, 12)}
        popup={true}
        dragFromOutsideItem={
          this.state.displayDragItemInCell ? this.dragFromOutsideItem : null
        }
        onDropFromOutside={this.onDropFromOutside}
        handleDragStart={this.handleDragStart}
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
