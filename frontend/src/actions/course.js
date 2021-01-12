import axios from 'axios'
import {GET_COURSE} from './types'
import {SET_COURSE} from './types'
import {GET_COURSELIST} from './types'

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

export const getCourseList = (title) => dispatch =>{
    axios.get('api/coursesmeta?title='+title)
    .then(res=>{
        dispatch({
            type:GET_COURSELIST,
            list: res.data
        });
    }).catch(err =>console.log(err));
}

// courseBag = {selectedCourse, selectedCourseArray}
export const setCourse = (courseBag)  =>
{
   return {
    type:SET_COURSE,
    selectedCRN: courseBag.selectedCRN,
    selectedCourse: courseBag.selectedCourseArray.find(
        ({ crn }) => crn === courseBag.selectedCRN
    ),
    selectedCourseArray: courseBag.selectedCourseArray,
   }
}