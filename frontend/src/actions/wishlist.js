import {ADD_COURSE_TO_WISH, REMOVE_COURSE_FROM_WISH, OVER_WRITE_WISH} from './types'
import store from '../store'

export const addCurrCourseToWish = ()  =>
{
    return {
        type: ADD_COURSE_TO_WISH,
        selectedCourse: store.getState().course.selectedCourse,
        selectedCourseArray: store.getState().course.selectedCourseArray,
    };  
}

export const removeCurrCourseFromWish = (id)  =>
{
    return {
        type: REMOVE_COURSE_FROM_WISH,
        selectedCourseArray: store.getState().course.selectedCourseArray,
        id: id, 
    };  
}

export const overwriteWish = (newWishlist) => {
    return {
        type: OVER_WRITE_WISH,
        newWishlist: newWishlist,
    }; 
}