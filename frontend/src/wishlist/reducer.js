/**
 * File name:	reducer.js
 * Created:	01/28/2021
 * Author:	Weili A
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	Reducer for wishlist
 */

import * as actions from "./action";
import { createReducer } from "@reduxjs/toolkit";
import { loadWishlistCourseBag } from "../../src/helper/localStorage";

const initialState = {
  /**
   * A dictionary of coures with course.id as key
   * and course object as value 
   * wishlistCourseBag: {
   *    id1: {course},
   *    id2: {course}
   * }
   */
  wishlistCourseBag: loadWishlistCourseBag(),
};

/**
 * Reducers for wishlist
 */

// TODO Create object, not array
export default createReducer(initialState, {
  /**
   * Reducer for wishlist/addCourse action
   * Will add a course object into the internal state
   * Will ignore repeated course
   */
  [actions.addCourseToWishlist]: (state, action) => {
    const newCourse = action.payload;
    // Add/update course in course bag with key 
    // as base64 encoding of course id and value as course object
    // TODO Hashing key length will impact performance?
    // Use "" + id to convert id into string, which has performance advantage according to
    // https://stackoverflow.com/questions/5765398/whats-the-best-way-to-convert-a-number-to-a-string-in-javascript
    state.wishlistCourseBag["" + newCourse.id] = newCourse;
  },

  /**
   * Reducer for wishlist/removeCourse action
   * Will remove a course object from internal state via course.id
   * Will ignore nonexisting course.id
   */
  [actions.removeCourseFromWishlist]: (state, action) => {
    delete state.wishlistCourseBag["" + action.payload];
  },

  /**
   * Reducer for wishlist/merge action
   * Will merge the current course bag with the given
   */
  [actions.mergeWishlist]: (state, action) => {
    state.wishlistCourseBag = Object.assign({}, state.wishlistCourseBag, action.payload);
  }
});
