import React, {useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Radio, Button, Tooltip, message, Space } from "antd";
import { isEmpty } from "../../helper/dataCheck";
import { timeObjFommatter, weekday, Color } from "../../helper/global";
import { setCourseByProf, setCourseByTime } from "../../actions/course";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faStar,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { addCurrCourse, removeCurrCourse } from "../../actions/calendar";
import { addCurrCourseToWish } from "../../actions/wishlist";
const CardStyle = { backgroundColor: "#ffffff", borderRadius: "1.5rem" };


function WikiSummary() {
  const selectedCourse = useSelector((state) => state.course.selectedCourse);
  const selectedCourseArray = useSelector(
    (state) => state.course.selectedCourseArray
  );
  const wishlistCourseBag = useSelector(
    (state) => state.wishlist.wishlistCourseBag
  );
  const calendarCourseBag = useSelector(
    (state) => state.calendar.calendarCourseBag
  );

  const dispatch = useDispatch();

  return (
      <div className="p-4 my-2 mt-4" style={CardStyle}>
        {!isEmpty(selectedCourse) ? (
          <div>
            {headerLoader(selectedCourse)}
            {tagLoader(selectedCourse)}
            {filterLoader(selectedCourseArray, selectedCourse, dispatch)}
            {buttonsLoader(
              dispatch,
              calendarCourseBag,
              selectedCourse,
              wishlistCourseBag
            )}
          </div>
        ) : (
          <Card bordered={false} loading={true}></Card>
        )}
      </div>
  );
}

function buttonsLoader(
  dispatch,
  calendarCourseBag,
  selectedCourse,
  wishlistCourseBag
) {
  //debugger;
  const courseArray = calendarCourseBag.filter(
    (item) =>
      item.title ===
      selectedCourse.course_meta.title //&& (item.type != 'preview'))
  );
  let add = true;
  let remove = true;
  let addButtonText = "Add Course";
  let star =
    wishlistCourseBag.filter((item) => item.courseId === selectedCourse.id)
      .length == 0; //true if in the wishlist
  // check if current on display course is already in calendar
  // false: add:true, remove:false
  // true: check if it is the same crn as the one in calendar
  //    true: add: false, remove true
  //    false: add->save: true, remove false

  if (!courseArray.length) {remove = false; }
  else {
    const course = calendarCourseBag.filter(
      (item) => item.courseId === selectedCourse.id //&& (item.type != 'preview')
    );
    if (!course.length) {
      addButtonText = "Change CRN";
      remove = false;
    } else add = false;
  }
  return (
    <div className="mt-2">
      <Space>
        <Tooltip title={addButtonText}>
          <Button
            disabled={!add}
            className="bubbly-button"
            type="primary"
            onClick={(event) => {
              dispatch(addCurrCourse());
              message.success(`${addButtonText} Successfully`);
            }}
          >
            <FontAwesomeIcon
              icon={addButtonText != "Change CRN" ? faPlus : faSave}
            />
          </Button>
        </Tooltip>

        <Tooltip title="Remove">
          <Button
            disabled={!remove}
            type="primary"
            onClick={(event) => {
              dispatch(removeCurrCourse());
              message.success("Course Removed Successfully");
            }}
          >
            <FontAwesomeIcon icon={faMinus} />
          </Button>
        </Tooltip>

        <Tooltip title="Add to Wishlist">
          <Button
            disabled={!star}
            type="primary"
            onClick={(event) => {
              if (!star) message.error("Course Already in Wishlist");
              else {
                dispatch(addCurrCourseToWish()); //remove dispatch.then 
                message.success("Course Added To Wishlist");
              }
            }}
          >
            <FontAwesomeIcon icon={faStar} />
          </Button>
        </Tooltip>
      </Space>
    </div>
  );
}

function headerLoader(selectedCourse) {
  return (
    <h1 className="mr-2 align-middle" style={{ display: "inline" }}>
      <span style={{ color: Color }}>{selectedCourse.course_meta.title} </span>
      {selectedCourse.course_meta.name}
    </h1>
  );
}
function tagLoader(selectedCourse) {
  return (
    <div>
      <p className="my-2" style={{ fontFamily: "Montserrat" }}>
        {weekday.map((day, i) => (
          <span className={weekdayToClass(i, selectedCourse.time)}>{day}</span>
        ))}

        <span className="ml-2 mb-1 badge bg-secondary">
          {selectedCourse.crn == null
            ? selectedCourse.section
            : selectedCourse.crn}
        </span>

        {selectedCourse.course_meta.credit_hours == null ? null : (
          <span className="ml-2 mb-1 badge bg-secondary">
            {selectedCourse.course_meta.credit_hours}
            {" credits"}
          </span>
        )}

        {selectedCourse.type == null ? null : (
          <span className="ml-2 mb-1 badge bg-secondary">
            {selectedCourse.type}
          </span>
        )}
      </p>
    </div>
  );
}

function filterLoader(selectedCourseArray, selectedCourse, dispatch) {
  const professors = [
    ...new Set(selectedCourseArray.map((course) => course.professor)),
  ]; // [ 'A', 'B']

  const timeslot = [
    ...new Set(selectedCourseArray.map((course) => course.timeString)),
  ];
  return (
    <div>
      <Radio.Group
        value={selectedCourse.professor}
        size="small"
        name="prof"
        buttonStyle="solid"
      >
        <h5
          style={{
            fontSize: "0.8rem",
            Color: "grey",
          }}
        >
          Instructor
        </h5>

        {professors.map((prof) => (
          <Radio.Button
            className="mr-1 mb-1"
            value={prof}
            onChange={(e) => dispatch(setCourseByProf(e.target.value))}
            style={{ borderRadius: "0" }}
          >
            {prof}
          </Radio.Button>
        ))}
      </Radio.Group>
      <br />
      <Radio.Group
        value={timeObjFommatter(selectedCourse.time)}
        size="small"
        buttonStyle="solid"
        className="row"
        name="times"
      >
        <h5
          style={{
            fontSize: "0.8rem",
            Color: "grey",
          }}
        >
          Times
        </h5>
        {timeslot.map((time) => (
          <Radio.Button
            className="mr-1 mb-1"
            value={time}
            disabled={
              selectedCourseArray.filter(
                ({ professor, timeString }) =>
                  professor == selectedCourse.professor && time == timeString
              ).length == 0
            }
            style={{ borderRadius: "0" }}
            onChange={(e) => dispatch(setCourseByTime(e.target.value))}
          >
            {time}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
}

function weekdayToClass(index, timeArray) {
  let timecp = timeArray;
  let result = "badge bg-light mb-1";
  timecp.map((timeObj) => {
    if (timeObj.weekday == index) {
      result = "mb-1 badge bg-secondary";
    }
  });
  return result;
}

function daysSeralizer(time) {
  if (isEmpty(time)) return null;
  let res = [];
  time.map((obj) => res.push(obj.weekday));
  return res;
}

function dayFormatter(time) {
  const days = daysSeralizer(time);
  let res = "";
  days.map((i, index) => {
    if (index == 0) res = weekday[i];
    else res = res + "," + weekday[i];
  });
  return res;
}

export default WikiSummary;
