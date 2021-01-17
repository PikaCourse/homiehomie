import {LOGIN_USER, LOGOUT_USER, GET_USER_SCHEDULE, UPDATE_USER_SCHEDULE, GET_USER_WISHLIST, UPDATE_USER_WISHLIST} from './types'
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

//directly upload input array to schedule.custom 
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

export const getUserWishlist = () => (dispatch) => {
    axios
      .get("/api/wishlists")
      .then((result) => { 
        dispatch ({
            type: GET_USER_WISHLIST,
            userWislist: result.data[0].custom, 
            userWishlistId: result.data[0].id,  
        }); 
      })
      .catch((err) => {  
      });
}

export const updateUserWishlist = (newWishlist) => (dispatch) => {
    let newWishlistObj = {custom: [...newWishlist]}
    axios
      .patch("/api/wishlists/"+store.getState().user.wishlistId, newWishlistObj)
      .then((result) => { 
        dispatch ({
            type: UPDATE_USER_WISHLIST,
            userWishlist: newWishlist, 
        }); 
      })
      .catch((err) => {  
      });
}