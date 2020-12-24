import { func } from 'prop-types'
import {GET_COURSE, SET_COURSE} from '../actions/types.js'

const initialState = {
    course:[],
    selectedcourse:{}
}

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_COURSE:
            return {
                ...state,
                course: action.payload
            } 
        case SET_COURSE:
            return {
                // ...state,
                selectedcourse: action.course,
                course: action.courselist
            } 
        default:
            return state;
    }
}

