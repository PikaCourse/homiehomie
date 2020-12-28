import {ADD_COURSE_TO_WISH} from './types'
import store from '../store'

export const addCurrCourseToWish = ()  =>
{

    return {
        type: ADD_COURSE_TO_WISH,
        selectedCRN: store.getState().course.selectedCRN,
        selectedCourseArray: store.getState().course.selectedCourseArray,
    };  
    
}