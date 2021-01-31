/**
 * File name:	action.js
 * Created:	01/29/2021
 * Author:	Weili An, Marx Wang, Joanna Fang
 * Email:	China_Aisa@live.com
 * Version:	1.1 Rewrite using createAction
 * Description:	Action creators for course related actions
 */

import { createAction } from "@reduxjs/toolkit";

// TODO Need redesign

/**
 * Action to add a course to wishlist
 * Will ignore repeated course
 * Accept the whole course object as payload
 * Payload: {course object}
 */
export const addCourseToWishlist = createAction("wishlist/addCourse");

/**
 * Action to remove a course from wishlist
 * Will ignore nonexisting course
 * Accept course id as payload
 * Payload: courseId
 */
export const removeCourseFromWishlist = createAction("wishlist/removeCourse");


/**
 * Action to merge the currrent wishlist with payload
 * payload: {wishlist}
 */
export const mergeWishlist = createAction("wishlist/merge");
