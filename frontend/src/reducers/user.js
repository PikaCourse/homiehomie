import {LOGIN_USER, LOGOUT_USER, GET_USER_SCHEDULE, UPDATE_USER_SCHEDULE} from '../actions/types'
import axios from "axios";
import { year, semester, courseDataPatch, school } from "../helper/global";


const initialState = {
    loginStatus: false,
    schedule: "", //calendarCourseBag 
    scheduleId: -1, 
};

async function getUserSchedule(state, action) {
    await getSelectedCourseArray(""); 
    let schedule = action.userSchedule.map(event => {
        event.raw.selectedCourseArray = getSelectedCourseArray(event.title); 
        // axios
        //     .get(`api/courses?title=${event.title}&year=${year}&semester=${semester}`)
        //     .then((res) => {
        //         event.raw.selectedCourseArray = res.data; 
        //     })
        //     .catch((err) => console.log(err));
        axios
            .get(`api/courses/${event.courseId}`)
            .then((result) => {
                event.raw.course = result.data; 
            })
            .catch((error) => console.log(error));
        return event; 
    }); 
    return schedule; 
}

async function getSelectedCourseArray(title) {
    const response = await axios.get(`api/courses?title=${title}&year=${year}&semester=${semester}`); 
    debugger
    return response.data; 
  }
export default function (state = initialState, action) {
	switch (action.type) {
		case LOGIN_USER:
			return { 
                ...state,
                loginStatus: true
            };
        case LOGOUT_USER:
            return { 
                ...state,
                loginStatus: false
            };
        case GET_USER_SCHEDULE:
            return { 
                ...state,
                schedule: action.userSchedule, //getUserSchedule(state, action), 
                scheduleId: action.userScheduleId, 
            };
        case UPDATE_USER_SCHEDULE:
            return { 
                ...state,
                schedule: action.userSchedule, 
            };
		default:
			return state;
	}
}