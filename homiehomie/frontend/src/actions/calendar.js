import {ADD_COURSE} from './types'
import store from '../store'

export const addCurrCourse = (props)  =>
{
    return {
        type: ADD_COURSE,
        course: store.getState().course.course[props],
        courselist: store.getState().course.course
    };
}