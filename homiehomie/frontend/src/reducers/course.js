import { func } from 'prop-types'
import {GET_COURSE, SET_COURSE} from '../actions/types.js'

const initialState = {
    selectedCourseArray:[],
    selectedCourse:{}
}

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_COURSE:
            console.log(action.payload);
            return {
                selectedCourse: action.payload[0],
                selectedCourseArray: action.payload
            } 
        case SET_COURSE:
            return {
                selectedCourse: action.selectedCourse,
                selectedCourseArray: action.selectedCourseArray
            } 
        default:
            return state;
    }
}

