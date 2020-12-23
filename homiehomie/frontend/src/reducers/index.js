import {combineReducers} from 'redux';
import leads from './leads'
import course from './course'
import calendar from './calendar'

export default combineReducers({
    leads, course, calendar,
});