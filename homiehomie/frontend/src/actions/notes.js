import axios from 'axios'
import{GET_NOTES} from './types'

export const getNotes = (questionArray) => dispatch =>
{
    for(var i = 0; i<questionArray.length; i++){
        //question id has to be unique
        axios.get('api/notes?questionid='+questionArray[i].questionid)
            .then(res=>{
                dispatch({
                    type: GET_NOTES,
                    payload_queid: questionArray[i].id,
                    payload_notes: res.data
                });
            }).catch(err => console.log(err));
    }
}