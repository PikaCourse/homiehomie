import {GET_NOTES} from '../actions/types.js'

const initialState = {
    //questionIDarray:[que300, que301]
    questionIDarray: [3,4],
    //notes: [[que300note1, que300note2, que300note3][que301note1,que301note2]]
    notes: [["1anything", "1anything2"],["2anything1","2anything2"]]
}

export default function(state = initialState, action){
    switch (action.type){
        case GET_NOTES:
            return{
                ...state,
                //attach a new questionID
                //attach a new note object array
                questionIDarray: action.payload_queid,
                notes: action.payload_notes
            }
        default:
            return state;
    }
}