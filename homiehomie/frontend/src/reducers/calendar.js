import {ADD_COURSE} from '../actions/types.js'
import {REMOVE_COURSE} from '../actions/types.js'
import store from '../store'
const start = new Date();
const initialState = {
    courselist:[{
        id: 1,
        calendarId: '0',
        title: 'Hello World',
        category: 'milestone',
        dueDateClass: '',
        start: new Date(new Date().setHours(start.getHours() -4)),
        end: new Date(new Date().setHours(start.getHours() -5)),
        isReadOnly: true
    }]
}

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_COURSE:
            let id = state.courselist.length+1;
            // let currentDate = calendarInstance.getDateRangeStart(); 
            // var tempArray = [...state.courselist]; 
            var tempArray = state.courselist;
            var timeArray = action.payload.time; 
            for (var i = 0; i < timeArray.length; i++) {
                var startTime = timeArray[i].start_at; 
                var endTime = timeArray[i].end_at; 
    
                var tempStartArray = startTime.split(':');
                var tempStartHours = parseFloat(tempStartArray[0]); 
                var tempStartMins = parseFloat(tempStartArray[1]); 
                var tempEndArray = endTime.split(':');
                var tempEndHours = parseFloat(tempEndArray[0]); 
                var tempEndMins = parseFloat(tempEndArray[1]); 
    
                // var idCont = state.courselist[state.courselist.length - 1].id + 1; 
                // var currentDate = calendarInstance.getDateRangeStart(); 
                var currentDate = start;
                currentDate.setDate(currentDate.getDate() + timeArray[i].weekday - 1);
                var startDate = new Date(currentDate); 
                var endDate = new Date(currentDate); 
                startDate.setHours(tempStartHours); 
                startDate.setMinutes(tempStartMins)
                endDate.setHours(tempEndHours); 
                endDate.setMinutes(tempEndMins); 
    
                tempArray.push({
                        id: id,
                        calendarId: id,
                        title: action.payload.course_meta.name,
                        category: 'time',
                        //dueDateClass: '',
                        start: startDate, //new Date(new Date().setHours(start.getHours() -4)),
                        end: endDate,//new Date(new Date().setHours(start.getHours() -5)),
                        isReadOnly: true
                    }); 
                // this.addEvent(idCont, course.course_meta.name, startDate, endDate); 
              }
              console.log(tempArray); 

            return tempArray;
            
        case REMOVE_COURSE:
            return {
                ...state,
                course: action.payload
            }  
        default:
            return state;
    }
}

