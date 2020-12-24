import {ADD_COURSE} from './types'
import store from '../store'

export const addCurrCourse = ()  =>
{
    return {
        type: ADD_COURSE,
        payload: store.getState().course.course[0]
    };
}
