import {GET_QUE} from '../actions/types.js'

const initialState = {
    noteBag:[
        {
            id:0,
            question:{},
            note:[]
        }
    ]
}

// [1, 2, 3] 
// {}

export default function(state = initialState, action) {
    //console.log(action.payload);

    switch (action.type) {
        case GET_QUE:
            //action.payload: note array to one question
            let newBag2 = {...state.noteBag};
            newBag2.push(action.noteBagItem);
            return{
                ...state,
                noteBag:newBag2
            };
        default:
            return state;
    }
}