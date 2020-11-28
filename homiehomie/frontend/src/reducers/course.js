import { func } from 'prop-types'
import {GET_COURSE} from '../actions/types.js'

const initialState = {
    course:[]
}

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_COURSE:
            return {
                ...state,
                course: action.payload
            } 
        default:
            return state;
    }
}

