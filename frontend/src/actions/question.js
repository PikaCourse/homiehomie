 import{GET_NOTES} from './types'
import{GET_QUE} from './types'
import axios from 'axios'

export const getNotes = (noteBag) => dispatch =>
{
    for(var i = 0; i<noteBag.length; i++){
        //question id has to be unique
        axios.get('api/notes?questionid='+noteBag[i].question.id)
            .then(res=>{
                dispatch({
                    type: GET_NOTES,
                    id: i,
                    payload_noteArray: res.data
                });
            }).catch(err => console.log(err));
    }
}
//getQuestion(Meta id) => reducer 
// dispatch/action (actions/note.js, types.js )
// reducer (reducers/note.js, index.js)
//  WikiNotebook.js
export const getQuestion = (metaid) => dispatch =>
{
    //console.log("getQuestions");
    //get question array depend on coursemetaid
    axios.get('api/questions?=coursemetaid='+metaid)
        //res = question array -> json
        .then(questions=>{
            questions.data.map((item, index)=>{
                axios.get('api/notes?=questionid='+item.id)
                    .then(notes=>{
                        dispatch({
                            type: GET_QUE,
                            noteBagItem:{
                                id: index,
                                question: item,
                                notes: notes.data
                            }
                        });
                    }).catch(err => console.log(err));     
            })
        }).catch(err =>console.log(err));
}

//for loop (getNote(Qid) => reducer)