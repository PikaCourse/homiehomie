import {LOGIN_USER, LOGOUT_USER} from './types'
import store from '../store'

export const updateLoginStatus = (loginStatus) => {
    if (loginStatus) {
        return {
            type: LOGIN_USER,
        };  
    } else {
        return {
            type: LOGOUT_USER,
        };
    }

}