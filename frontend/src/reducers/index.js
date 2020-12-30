import {combineReducers} from 'redux';
import leads from './leads'
import course from './course'
import question from './question'
import calendar from './calendar'

export default combineReducers({
    leads, course, question, calendar,
});