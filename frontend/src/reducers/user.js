import {LOGIN_USER, LOGOUT_USER, GET_USER_SCHEDULE} from '../actions/types'
import axios from "axios";

const initialState = {
    loginStatus: false,
    schedule: "", 
};
function loginUser(state, action) {
}
function logoutUser(state, action) {
}
function getUserSchedule(state, action) {
    var userSchedule = [];
    var testVar = "00"; 
    // state.schedule = "000"
    // let res = "1";
    axios
      .get("/api/schedules")
      .then((result) => {
        testVar = "11";

        state.schedule = "111"; 
        // if (!result.data.length) {
        //   let newSchedule = {
        //     is_star: true,
        //     is_private: true,
        //     year: 2020,
        //     semester: "spring",
        //     name: "string",
        //     note: "string",
        //     tags: ["string"],
        //     courses: [],
        //   };
        //   axios
        //     .post("/api/schedules", newSchedule)
        //     .then((result) => {
        //       console.log("post schedule result");
        //       console.log(result);
        //     })
        //     .catch((err) => {
        //       console.log(err.response);
        //     });
        //   return "22";
        // } else return "33";
      })
      .catch((err) => {
        console.log(err.response);
        testVar = "22"; 
        state.schedule = "222"
      });
      return testVar; 
  };
export default function (state = initialState, action) {
	switch (action.type) {
		case LOGIN_USER:
			return { 
                ...state,
                loginStatus: true
            };
        case LOGOUT_USER:
            return { 
                ...state,
                loginStatus: false
            };
        case GET_USER_SCHEDULE:
            return { 
                ...state,
                schedule: action.userSchedule
            };
		default:
			return state;
	}
}