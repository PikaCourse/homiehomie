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
                loginStatus: loginUser(state, action)
            };
        case LOGOUT_USER:
            return { 
                loginStatus: logoutUser(state, action)
            };

		default:
			return state;
	}
}