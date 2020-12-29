import {ADD_COURSE_TO_WISH, REMOVE_COURSE_FROM_WISH} from './types'
import store from '../store'

export const addCurrCourseToWish = ()  =>
{

    return {
        type: ADD_COURSE_TO_WISH,
        selectedCRN: store.getState().course.selectedCRN,
        selectedCourseArray: store.getState().course.selectedCourseArray,
    };  
    
}

export const removeCurrCourseFromWish = (idPara)  =>
{

    return {
        type: REMOVE_COURSE_FROM_WISH,
        selectedCRN: store.getState().course.selectedCRN,
        selectedCourseArray: store.getState().course.selectedCourseArray,
        id: idPara, 
    };  
    
}