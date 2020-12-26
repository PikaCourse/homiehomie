import {ADD_COURSE_TO_CAL, REMOVE_COURSE_FROM_CAL} from './types'
import store from '../store'

export const addCurrCourse = ()  =>
{

    return {
        type: ADD_COURSE_TO_CAL,
        selectedCRN: store.getState().course.selectedCRN,
        selectedCourseArray: store.getState().course.selectedCourseArray,
    };  
}



export const removeCurrCourse = ()  =>
{
    return {
        type: REMOVE_COURSE_FROM_CAL,
        selectedCRN: store.getState().course.selectedCRN,
    };  
}
