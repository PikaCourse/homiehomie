import {GET_QUE} from '../actions/types.js'

const initialState = {
    question:[
        {
            id:0,
            question:[],
            notes:[]
        }
    ]
}

export default function(state = initialState, action) {
    //console.log(action.payload);

    switch (action.type) {
        case GET_QUE:
            console.log("from question.js: "+action.payload)
            return {
                ...state,
                question: action.payload
            } 
        default:
            return state;
    }
}