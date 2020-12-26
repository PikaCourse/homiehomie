import {ADD_COURSE_TO_CAL, REMOVE_COURSE_FROM_CAL, UPDATE_COURSE_IN_CAL} from './types'
import store from '../store'

export const addCurrCourse = ()  =>
{
    const courseArray = store
      .getState()
      .calendar.calendarCourseBag.filter(
        (item) => item.raw.selectedCourseArray == store.getState().course.selectedCourseArray
    );
    
    if(!Array.isArray(courseArray) || !courseArray.length) 
    {
        // add new course
        return {
            type: ADD_COURSE_TO_CAL,
            selectedCRN: store.getState().course.selectedCRN,
            selectedCourseArray: store.getState().course.selectedCourseArray,
        };  
    }
    else
    {
        // add same course different crn
        return {
            type: UPDATE_COURSE_IN_CAL,
            selectedCRN: store.getState().course.selectedCRN,
            selectedCourseArray: store.getState().course.selectedCourseArray,
        };  

    }
    
}


export const removeCurrCourse = ()  =>
{
    return {
        type: REMOVE_COURSE_FROM_CAL,
        selectedCRN: store.getState().course.selectedCRN,
    };  
}
