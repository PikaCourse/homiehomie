import { combineReducers } from "redux";
import course from "./course";
import question from "./question";
import calendar from "./calendar";
import wishlist from "./wishlist";
import user from "./user"

export default combineReducers({
  course,
  question,
  calendar,
  wishlist,
  user, 
});
