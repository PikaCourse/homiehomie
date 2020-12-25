import React, { Component, Fragment } from 'react'
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';

// If you use the default popups, use this.
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {setCourse} from '../../actions/course'
import store from '../../store';
const themeConfig =  {
    'common.border': '1px solid rgba(89, 108, 126, 0.22)',
    'common.today.color': '#419EF4',
    'common.creationGuide.filter': 'drop-shadow(6px 4px 30px rgba(65, 158, 244, 0.30))',
    'common.creationGuide.border': '1px solid #515ce6',
};

const myTheme = {
    themeConfig
};

export class Scheduler extends Component {
       
    constructor(props) {
        super(props)
    }

    static propTypes = {
        course:PropTypes.array.isRequired,
        calendar:PropTypes.array.isRequired,
        courselist:PropTypes.array.isRequired
    }

    calendarRef = React.createRef();

    componentDidMount() 
    {
        const calendarInstance = this.calendarRef.current.getInstance();
        //use map to reduce redundance 
        calendarInstance.setCalendarColor(0, {
            color: 'rgba(65, 158, 244, 1)',
            bgColor: 'rgba(65, 158, 244, 0.3)',
            borderColor: 'rgba(65, 158, 244, 0.3)',
        });
        calendarInstance.setCalendarColor(1, {
            color: 'rgba(79, 207, 184, 1)',
            bgColor: 'rgba(79, 207, 184, 0.3)',
            borderColor: 'rgba(79, 207, 184, 0.3)',
        });
        calendarInstance.setCalendarColor(2, {
            color: 'rgba(255, 175, 115, 1)',
            bgColor: 'rgba(255, 175, 115, 0.3)',
            borderColor: 'rgba(255, 175, 115, 0.3)',
        });
        calendarInstance.setCalendarColor(3, {
            color: 'rgba(166, 65, 244, 1)',
            bgColor: 'rgba(166, 65, 244, 0.3)',
            borderColor: 'rgba(166, 65, 244, 0.3)',

        });
        calendarInstance.setCalendarColor(4, {
            color: 'rgba(242, 124, 87, 1)',
            bgColor: 'rgba(242, 124, 87, 0.3)',
            borderColor: 'rgba(242, 124, 87, 0.3)',

        });
        calendarInstance.setCalendarColor(5, {
            color: 'rgba(113, 79, 207, 1)',
            bgColor: 'rgba(113, 79, 207, 0.3)',
            borderColor: 'rgba(113, 79, 207, 0.3)',

        });
        calendarInstance.setCalendarColor(6, {
            color: 'rgba(109, 218, 120, 1)',
            bgColor: 'rgba(109, 218, 120, 0.3)',
            borderColor: 'rgba(109, 218, 120, 0.3)',

        });
        calendarInstance.setCalendarColor(7, {
            color: 'rgba(234, 104, 153, 1)',
            bgColor: 'rgba(234, 104, 153, 0.3)',
            borderColor: 'rgba(234, 104, 153, 0.3)',

        });
        calendarInstance.setCalendarColor(8, {
            color: 'rgba(188, 191, 4, 1)',
            bgColor: 'rgba(188, 191, 4, 0.3)',
            borderColor: 'rgba(188, 191, 4, 0.3)',

        });
        calendarInstance.setCalendarColor(9, {
            color: 'rgba(21, 77, 222, 1)',
            bgColor: 'rgba(21, 77, 222, 0.3)',
            borderColor: 'rgba(21, 77, 222, 0.3)',

        });
        calendarInstance.setCalendarColor(10, {
            color: 'rgba(68, 207, 207, 1)',
            bgColor: 'rgba(68, 207, 207, 0.3)',
            borderColor: 'rgba(68, 207, 207, 0.3)',

        });
    }


    componentDidUpdate = () =>
    {
        const calendarInstance = this.calendarRef.current.getInstance();
        calendarInstance.on('clickSchedule', function(event) {
            // var ClickedSchedule = event.schedule;
            store.dispatch(setCourse(event.schedule.raw));
            //store crn and course name in schedule  
        }); 
        
    }

    render() {
        return (    
        <Fragment>

            {typeof this.props.courselist != 'undefined'? 
            <div>

                {/* <button className="btn btn-outline-primary my-2 my-sm-0" 
                    onClick={()=> this.addCourseSchedule(this.props.course[0])} style = {{borderRadius: "30px"}} type="submit">Add</button>  */}
                <Calendar
                    ref={this.calendarRef}
                    height="1000px"
                    disableDblClick={true}
                    disableClick={false}
                    isReadOnly={true}
                    //scheduleView
                    //taskView={true}
                    schedules={this.props.courselist}
            
                    theme={myTheme}
                    useDetailPopup
                    
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
    courselist: state.calendar.calendarCourseBag
});

export default connect(mapStateToProps)(Scheduler);
