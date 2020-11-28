import axios from 'axios'
import {GET_COURSE} from './types'

export const getCourse = () => dispatch =>
{
    axios.get('api/courses')
        .then(res=>{
            dispatch({
                type:GET_COURSE,
                payload: res.data
            });
        }).catch(err =>console.log(err));
}