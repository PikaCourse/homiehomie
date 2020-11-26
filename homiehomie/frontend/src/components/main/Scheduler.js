import React, { Component } from 'react'
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';

// If you use the default popups, use this.
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

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
    render() {
        return (      
        <Calendar
            height="1000px"
            disableDblClick={true}
            disableClick={false}
            isReadOnly={false}
            scheduleView
            taskView
            schedules={[
            {
                id: '1',
                calendarId: '0',
                title: 'TOAST UI Calendar Study',
                category: 'time',
                dueDateClass: '',
                start: new Date(new Date().setHours(start.getHours() + 1)),
                end: new Date(new Date().setHours(start.getHours() + 2))
            },
            {
                id: '2',
                calendarId: '0',
                title: 'Practice',
                category: 'milestone',
                dueDateClass: '',
                start: new Date(new Date().setHours(start.getHours() + 4)),
                end: new Date(new Date().setHours(start.getHours() + 5)),
                isReadOnly: true
            }
            
            ]}
           
              theme={myTheme}
              useDetailPopup
              useCreationPopup
            //   view={selectedView} // You can also set the `defaultView` option.
              week={{
                showTimezoneCollapseButton: true,
                timezonesCollapsed: true
              }}

            taskView
  />
        )
    }
}







export default Scheduler
