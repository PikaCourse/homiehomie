import {combineReducers} from 'redux';
import leads from './leads'
import course from './course'
import question from './question'
import notes from './notes'
import calendar from './calendar'
import wishlist from './wishlist'

export default combineReducers({
    leads, course, question, notes, calendar, wishlist,
});