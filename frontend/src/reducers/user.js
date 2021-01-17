import {LOGIN_USER, LOGOUT_USER, GET_USER_SCHEDULE, UPDATE_USER_SCHEDULE, GET_USER_WISHLIST, UPDATE_USER_WISHLIST} from '../actions/types'
import axios from "axios";
import { year, semester, courseDataPatch, school } from "../helper/global";


const initialState = {
    loginStatus: false,
    schedule: "", //calendarCourseBag 
    scheduleId: -1, 
    wishlist: "", 
    wishlistId: -1, 
};

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
        case GET_USER_WISHLIST:
            return {
                ...state,
                wishlist: action.userWislist, //getUserSchedule(state, action), 
                wishlistId: action.userWishlistId,
            };
        case UPDATE_USER_WISHLIST:
            return {
                ...state,
                wishlist: action.userWishlist,
            };
        default:
			return state;
	}
}