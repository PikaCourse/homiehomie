import {GET_QUE} from '../actions/types.js'

const initialState = {
    question:[]
}

export default function(state = initialState, action) {
    //console.log(action.payload);

    switch (action.type) {
        case GET_QUE:
            state.question[i]

            return {
                ...state,
                question: action.payload
            } 
        default:
            return state;
    }
}