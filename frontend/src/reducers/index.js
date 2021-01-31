import { combineReducers } from "redux";
// import { course } from "./course";
import course from "../course/reducer";
import question from "./question";
import calendar from "./calendar";
import wishlist from "../wishlist/reducer";
import user from "./user";

export default combineReducers({
  course,
  question,
  calendar,
  wishlist,
  user, 
});
