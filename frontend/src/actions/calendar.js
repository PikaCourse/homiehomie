import {ADD_COURSE} from './types'
import store from '../store'

export const addCurrCourse = ()  =>
{
    const selectedCRN = store.getState().course.selectedCRN;
    const courselist = store.getState().course.selectedCourseArray;
    const course = courselist.find(
        ({ crn }) => crn === selectedCRN
      )
    return {
        type: ADD_COURSE,
        course: course,
        courselist: courselist
    };  
}
