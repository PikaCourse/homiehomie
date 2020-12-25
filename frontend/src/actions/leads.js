import axios from 'axios'
import {GET_LEADS} from './types'

//GET LEADS
export const getLeads = () => dispatch =>{
    axios.get('/api/courses')
        .then(res=>{
            dispatch({
                type:GET_LEADS, 
                payload: res.data
            });
        }).catch(err =>console.log(err));
}