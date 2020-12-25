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
    'common.border': '1px solid #e5e5e5',
    'common.today.color': '#419EF4',
    'common.creationGuide.filter': 'drop-shadow(6px 4px 30px rgba(65, 158, 244, 0.81))',
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
            color: '#FFFFFF',
            bgColor: '#585858',
            borderColor: '#a1b56c',
            dragBgColor: '#585858',
        });
        calendarInstance.setCalendarColor(1, {
            color: '#FFFFFF',
            bgColor: '#dc9656',
            borderColor: '#a1b56c',
            dragBgColor: '#dc9656',
        });
        calendarInstance.setCalendarColor(2, {
            color: '#FFFFFF',
            bgColor: '#ab4642',
            borderColor: '#a1b56c',
            dragBgColor: '#ab4642',
        });
        calendarInstance.setCalendarColor(3, {
            color: '#FFFFFF',
            bgColor: '#540d6e',
        });
        calendarInstance.setCalendarColor(4, {
            color: '#FFFFFF',
            bgColor: '#ee4266',
        });
        calendarInstance.setCalendarColor(5, {
            color: '#FFFFFF',
            bgColor: '#ffd23f',
        });
        calendarInstance.setCalendarColor(6, {
            color: '#FFFFFF',
            bgColor: '#3bceac',
        });
        calendarInstance.setCalendarColor(7, {
            color: '#FFFFFF',
            bgColor: '#0ead69',
        });
        calendarInstance.setCalendarColor(8, {
            color: '#FFFFFF',
            bgColor: '#f0984d',
        });
        calendarInstance.setCalendarColor(9, {
            color: '#FFFFFF',
            bgColor: '#e9c135',
        });
        calendarInstance.setCalendarColor(10, {
            color: '#FFFFFF',
            bgColor: '#14c97e',
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
    courselist: state.calendar.calendarCourseBag
});

export default connect(mapStateToProps)(Scheduler);
