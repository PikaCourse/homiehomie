import {ADD_COURSE_TO_CAL} from './types'
import store from '../store'

export const addCurrCourse = ()  =>
{

    return {
        type: ADD_COURSE_TO_CAL,
        selectedCRN: store.getState().course.selectedCRN,
        selectedCourseArray: store.getState().course.selectedCourseArray,
    };  
}


