import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  addCurrCourse,
  removeCurrCourse,
  addCurrCourseToWish,
} from "../../actions/calendar";
// import {  } from "../../actions/wishlist";
import { setCourse } from "../../actions/course";
import store from "../../store";
// style
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faStar,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
const weekday = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
import { Switch, Select, Input, Button, Tooltip, message } from "antd";

import { getCourse } from "../../actions/course";
import "antd/lib/style/themes/default.less";
import "antd/dist/antd.less";
import "../../main.less";


function WikiSummary (){

    return (

    );
}