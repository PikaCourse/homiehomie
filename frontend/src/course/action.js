/**
 * File name:	action.js
 * Created:	01/18/2021
 * Author:	Marx Wang, Joanna Fang, Anna Zhang, Weili An
 * Email:	foo@bar.com
 * Version:	1.1 Rewrite using createAction
 * Description:	Action creators for course related actions
 */

import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import store from "../store";
import { GET_COURSELIST } from "../actions/types";
import { year, semester, courseDataPatch, school, timeObjFommatter } from "../helper/global";
import { message } from "antd";
import queryString from "query-string";

// TODO Not relied on api string but as a package
// TODO Pack api as a package?

// TODO Use async thunk to rewrite all the following
/**
 * redux action api to retrieve course sections from
 * remote server with given query filter params as specified in API doc
 * */ 
export const getCourseSections = createAsyncThunk(
  "course/getCourseSections",
  async (query, thunkAPI) => {
    let qs = queryString.stringify(query);
    // TODO Not relied on api string but as a package
    // TODO Pack api as a package?
    let res = await axios.get(`api/courses?${qs}`);
    return res.data;
  }
);

/**
 * redux action api to retrieve courses info from
 * remote server with given query filter params as specified in API doc
 * */ 
export const getCourses = createAsyncThunk(
  "course/getCourses",
  async (query, thunkAPI) => {
    // Set default search limit
    if (!("limit" in query))
      query.limit = 15;
    let qs = queryString.stringify(query);
    let res = await axios.get(`api/coursesmeta?${qs}`);
    return res.data;
  }
);

// TODO Change from setXXX to selectXXX
// TODO Should check if the current cache hosts the course list?
// TODO And also this function is quite identical to GET_COURSE, consider merging
/**
 * redux action api to select the current displayed course
 * TODO Need to first check if the course is in the cached state of course
 * TODO else perform a request
 * TODO Currently do not check for internal state cache
 * */ 
export const selectCourse = createAsyncThunk(
  "course/selectCourses",
  async (args, thunkAPI) => {
    let title = args.title;
    let courseId = args.courseId;
    let qs = queryString.stringify({"title": title});
    let res = await axios.get(`api/courses?${qs}`);
    return {
      selectedCourseId: courseId,
      courses: res.data
    };
  }
);

// The following actions change on the current course list so do not
// need to get from remote APIs
export const setCourseByProf = createAction("course/setCourseByProf");
export const setCourseByTime = createAction("course/setCourseByTime");


