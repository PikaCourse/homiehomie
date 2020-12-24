import axios from 'axios'
import{GET_QUE} from './types'
//getQuestion(Meta id) => reducer 
// dispatch/action (actions/note.js, types.js )
// reducer (reducers/note.js, index.js)
//  WikiNotebook.js
export const getQuestion = (metaid) => dispatch =>
{
    //console.log("getQuestions");
    //get question array depend on coursemetaid
    axios.get('api/questions?coursemetaid='+metaid)
        //res = question array -> json
        .then(res=>{
            dispatch({
                type: GET_QUE,
                payload: res.data //question array
            });
        }).catch(err =>console.log(err));
}

//for loop (getNote(Qid) => reducer)