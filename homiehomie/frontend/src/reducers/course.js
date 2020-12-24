import { func } from 'prop-types'
import {GET_COURSE, SET_COURSE} from '../actions/types.js'

const initialState = {
    selectedCourseArray:[],
    selectedCourse:{}
}

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_COURSE:
            return {
                ...state,
                selectedCourseArray: action.payload
            } 
        case SET_COURSE:
            return {
                // ...state,
                selectedCourse: selectedCRN,
                selectedCourseArray:selectedCourseArray
            } 
        default:
            return state;
    }
}

