import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../store";
import { Card, Radio } from "antd";
import { isEmpty } from "../../helper/dataCheck";

const weekday = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const CardStyle = { backgroundColor: "#ffffff", borderRadius: "1.5rem" };
const Color = "#419EF4";

function WikiSummary() {
  const [addBtn, setAddBtn] = useState(true);
  const [rmBtn, setRmBtn] = useState(true);
  const [starBtn, setStarBtn] = useState(true);
  const selectedCourse = useSelector((state) => state.course.selectedCourse);
  const selectedCourseArray = useSelector(
    (state) => state.course.selectedCourseArray
  );

  const dispatch = useDispatch();
  const professors = [
    ...new Set(selectedCourseArray.map((course) => course.professor)),
  ]; // [ 'A', 'B']

  const dayslot = [
    ...new Set(selectedCourseArray.map((course) => dayFormatter(course.time))),
  ];

  const timeslot = [
    ...new Set(
      selectedCourseArray.map((course) => timeObjFommatter(course.time))
    ),
  ];
  return (
    <Fragment>
      <div className="p-4 my-2 mt-4" style={CardStyle}>
        {!isEmpty(selectedCourse) ? (
          <div>
            {headerLoader(selectedCourse)}
            {tagLoader(selectedCourse)}

            <Radio.Group
              defaultValue={selectedCourse.professor}
              size="small"
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
                  style={{ borderRadius: "0px" }}
                >
                  {prof}
                </Radio.Button>
              ))}
            </Radio.Group>

            <Radio.Group
              defaultValue={dayFormatter(selectedCourse.time)}
              size="small"
              buttonStyle="solid"
              className="row"
            >
              <h5
                style={{
                  fontSize: "0.8rem",
                  Color: "grey",
                }}
              >
                Days
              </h5>

              {dayslot.map((day) => (
                <Radio.Button
                  className="mr-1 mb-1"
                  value={day}
                  style={{ borderRadius: "0px" }}
                >
                  {day}
                </Radio.Button>
              ))}
            </Radio.Group>

            <Radio.Group
              defaultValue={timeObjFommatter(selectedCourse.time)}
              size="small"
              buttonStyle="solid"
              className="row"
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
                  style={{ borderRadius: "0px" }}
                >
                  {time}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        ) : (
          <Card bordered={false} loading={true}></Card>
        )}
      </div>
    </Fragment>
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
    else res = res + "/" + weekday[i];
  });
  return res;
}

function timeObjFommatter(time) {
  if (isEmpty(time)) return null;
  let res = "";
  time.map((obj, index) => {
    if (index == 0)
      res = weekday[obj.weekday] + "-" + obj.start_at + "--" + obj.end_at;
    else
      res =
        res +
        ", " +
        weekday[obj.weekday] +
        "-" +
        obj.start_at +
        "--" +
        obj.end_at;
  });
  return res;
}

export default WikiSummary;
