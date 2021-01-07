import { combineReducers } from "redux";
import course from "./course";
import question from "./question";
import calendar from "./calendar";
import wishlist from "./wishlist";

export default combineReducers({
  course,
  question,
  calendar,
  wishlist,
});
