import axios from 'axios'
import {GET_COURSE} from './types'
import {SET_COURSE} from './types'

export const getCourse = (title) => dispatch =>
{
    axios.get('api/courses?title='+title)
        .then(res=>{
            dispatch({
                type:GET_COURSE,
                payload: res.data
            });
        }).catch(err =>console.log(err));
}

export const setCourse = (selectedCourseArray, selectedCourse)  =>
{
   return {
    type:SET_COURSE,
    selectedCourse: selectedCRN,
    selectedCourseArray:selectedCourseArray
   }
}