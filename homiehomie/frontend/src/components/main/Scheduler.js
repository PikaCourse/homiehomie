import React, { Component, Fragment } from 'react'
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';

// If you use the default popups, use this.
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

const themeConfig =  {
    'common.border': '1px solid #e5e5e5',
    'common.today.color': '#419EF4',
    'common.creationGuide.filter': 'drop-shadow(6px 4px 30px rgba(65, 158, 244, 0.81))',
    'common.creationGuide.border': '1px solid #515ce6',
};

const myTheme = {
    themeConfig
};
const start = new Date();
const end = new Date(new Date().setMinutes(start.getMinutes() + 30));

export class Scheduler extends Component {
    calendarRef = React.createRef();
    
    constructor(props) {
        super(props)
    
        // this.state = {
        //      events: [
        //         {
        //             id: 2,
        //             calendarId: '0',
        //             title: 'Practices',
        //             category: 'milestone',
        //             dueDateClass: '',
        //             start: new Date(new Date().setHours(start.getHours() -4)),
        //             end: new Date(new Date().setHours(start.getHours() -5)),
        //             isReadOnly: true
        //         }
        //         ]
        // }
    }

    static propTypes = {
        course:PropTypes.array.isRequired,
        calendar:PropTypes.array.isRequired,
        courselist:PropTypes.array.isRequired
    }

    // addCourseSchedule(course) {
    //     console.log('addCourseSchedule ran'); 
    //     const calendarInstance = this.calendarRef.current.getInstance();
    //     var tempArray = [...this.state.events]; 
    //     var timeArray = course.time; 
    //     for (var i = 0; i < timeArray.length; i++) {
    //         var startTime = timeArray[i].start_at; 
    //         var endTime = timeArray[i].end_at; 

    //         var tempStartArray = startTime.split(':');
    //         var tempStartHours = parseFloat(tempStartArray[0]); 
    //         var tempStartMins = parseFloat(tempStartArray[1]); 
    //         var tempEndArray = endTime.split(':');
    //         var tempEndHours = parseFloat(tempEndArray[0]); 
    //         var tempEndMins = parseFloat(tempEndArray[1]); 

    //         var idCont = this.state.events[this.state.events.length - 1].id + 1; 
    //         var currentDate = calendarInstance.getDateRangeStart(); 
    //         currentDate.setDate(currentDate.getDate() + timeArray[i].weekday - 1);
    //         var startDate = new Date(currentDate); 
    //         var endDate = new Date(currentDate); 
    //         startDate.setHours(tempStartHours); 
    //         startDate.setMinutes(tempStartMins)
    //         endDate.setHours(tempEndHours); 
    //         endDate.setMinutes(tempEndMins); 

    //         tempArray.push({
    //                 id: idCont,
    //                 calendarId: '0',
    //                 title: course.course_meta.name,
    //                 category: 'time',
    //                 //dueDateClass: '',
    //                 start: startDate, //new Date(new Date().setHours(start.getHours() -4)),
    //                 end: endDate,//new Date(new Date().setHours(start.getHours() -5)),
    //                 isReadOnly: true
    //             }); 
    //         // this.addEvent(idCont, course.course_meta.name, startDate, endDate); 
    //       }
    //       console.log(tempArray); 
    //       this.setState({events: tempArray}); 
    //       console.log(this.state.events); 
    // }
    render() {
        return (    
        <Fragment>

            {typeof this.props.courselist != 'undefined'? 
            <div>
                {console.log(this.props.calendar)}
                {console.log(this.props.courselist)}

                {/* <button className="btn btn-outline-primary my-2 my-sm-0" 
                    onClick={()=> this.addCourseSchedule(this.props.course[0])} style = {{borderRadius: "30px"}} type="submit">Add</button>  */}
                <Calendar
                ref={this.calendarRef}
                height="1000px"
                disableDblClick={true}
                disableClick={false}
                isReadOnly={false}
                //scheduleView
                //taskView={true}
                schedules={this.props.courselist}
            
                theme={myTheme}
                useDetailPopup
                useCreationPopup
                //   view={selectedView} // You can also set the `defaultView` option.
                week={{
                    showTimezoneCollapseButton: true,
                    timezonesCollapsed: true, 
                    workweek: true, 
                    hourStart: 7, 
                    hourEnd: 22, 
                    daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                }}

                taskView/>
            </div> 
            :'loading...'}
        </Fragment>

        )
    }
}






const mapStateToProps = state =>({
    course: state.course.course,
    calendar: state.calendar,
    courselist: state.calendar.courselist
});

export default connect(mapStateToProps)(Scheduler);
