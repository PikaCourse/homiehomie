import {LOGIN_USER, LOGOUT_USER, GET_USER_SCHEDULE} from './types'
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
        if (!result.data.length) {
          let newSchedule = {
            is_star: true,
            is_private: true,
            year: 2020,
            semester: "spring",
            name: "string",
            note: "string",
            tags: ["string"],
            courses: [],
          };
          axios
            .post("/api/schedules", newSchedule)
            .then((result) => {
                dispatch ({
                    type: GET_USER_SCHEDULE,
                    userSchedule: "result.result.data", 
                }); 
            })
            .catch((err) => {
                dispatch ({
                    type: GET_USER_SCHEDULE,
                    userSchedule: "result.err", 
                }); 
            });
        } else {
            dispatch ({
                type: GET_USER_SCHEDULE,
                userSchedule: "result.data", 
            }); 
        }
      })
      .catch((err) => {
        dispatch ({
            type: GET_USER_SCHEDULE,
            userSchedule: "err", 
        });   
      });
}