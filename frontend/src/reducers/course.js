import {GET_COURSE, SET_COURSE} from '../actions/types.js'

const initialState = {
    selectedCourseArray:[],
    selectedCRN:0
}

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_COURSE:
            return {
                selectedCRN:action.payload[0].crn,
                selectedCourseArray: action.payload
            } 
        case SET_COURSE:
            return {
                selectedCRN: action.selectedCRN,
                selectedCourseArray: action.selectedCourseArray
            } 
        default:
            return state;
    }
}

