import {LOGIN_USER, LOGOUT_USER, GET_USER_SCHEDULE, UPDATE_USER_SCHEDULE} from './types'
import store from '../store'
import axios from "axios";

export const updateLoginStatus = (loginStatus) => {
    if (loginStatus) {
        return {
            type: LOGIN_USER,
        };  
    } else {
        return {
            type: LOGOUT_USER,
        };
    }
}

export const getUserSchedule = () => (dispatch) => {
    axios
      .get("/api/schedules")
      .then((result) => { 
        console.log(result); 
        dispatch ({
            type: GET_USER_SCHEDULE,
            userSchedule: result.data[0].custom, 
            userScheduleId: result.data[0].id, 
        }); 
      })
      .catch((err) => {  
      });
}

export const updateUserSchedule = (newSchedule) => (dispatch) => {
    let newScheduleObj = {custom: [...newSchedule]}
    axios
      .patch("/api/schedules/"+store.getState().user.scheduleId, newScheduleObj)
      .then((result) => { 
        dispatch ({
            type: UPDATE_USER_SCHEDULE,
            userSchedule: newSchedule, 
        }); 
      })
      .catch((err) => {  
      });
}