import {ADD_COURSE} from './types'
import store from '../store'

export const addCurrCourse = ()  =>
{

    return {
        type: ADD_COURSE,
        selectedCRN: store.getState().course.selectedCRN,
        selectedCourseArray: store.getState().course.selectedCourseArray,
    };  
}
