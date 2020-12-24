import {ADD_COURSE} from '../actions/types.js'
import {REMOVE_COURSE} from '../actions/types.js'
import store from '../store'
const start = new Date();
const initialState = {
    courselist:[]
}

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

function alignDate(weekDayIndex){
    let today = new Date();
    return new Date(getMonday(today).setDate(getMonday(today).getDate() + weekDayIndex))
}
  
export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_COURSE:
                let id = 0;
                if(state.courselist.length != 0)
                {
                    id = state.courselist[state.courselist.length - 1].id+1;
                }
                
            var tempArray = [...state.courselist];
            var timeArray = action.course.time; 
            for (var i = 0; i < timeArray.length; i++) {
                let startTime = alignDate(timeArray[i].weekday);
                var tempStartArray = timeArray[i].start_at.split(':');
                var tempStartHours = parseFloat(tempStartArray[0]); 
                var tempStartMins = parseFloat(tempStartArray[1]); 
                startTime.setHours(tempStartHours);
                startTime.setMinutes(tempStartMins);

                let endTime = alignDate(timeArray[i].weekday);
                tempStartArray = timeArray[i].end_at.split(':');
                tempStartHours = parseFloat(tempStartArray[0]); 
                tempStartMins = parseFloat(tempStartArray[1]); 
                endTime.setHours(tempStartHours);
                endTime.setMinutes(tempStartMins);

                tempArray.push({
                        id: id,
                        calendarId: id,
                        title: action.course.course_meta.name,
                        category: 'time',
                        dueDateClass: '',
                        start: startTime, //new Date(new Date().setHours(start.getHours() -4)),
                        end: endTime,//new Date(new Date().setHours(start.getHours() -5)),
                        isReadOnly: true, 
                        raw: {course: action.course,
                            courselist: action.courselist}
                    }); 
                
              }
            return {courselist: tempArray};
            // return tempArray;
            
        case REMOVE_COURSE:
            return {
                ...state,
                course: action.payload
            }  
        default:
            return state;
    }
}

