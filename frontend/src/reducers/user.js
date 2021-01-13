import {LOGIN_USER, LOGOUT_USER} from '../actions/types'
const initialState = {
    loginStatus: false,
};
function loginUser(state, action) {
    return true; 

}
function logoutUser(state, action) {
    return false;

}
export default function (state = initialState, action) {
	switch (action.type) {
		case LOGIN_USER:
			return { 
                loginStatus: true
            };
        case LOGOUT_USER:
            return { 
                loginStatus: false
            };

		default:
			return state;
	}
}