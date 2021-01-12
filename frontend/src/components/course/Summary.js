import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../store";
import { Card, Radio } from "antd";
import { isEmpty } from "../../helper/dataCheck";
import { timeObjFommatter, weekday, Color } from "../../helper/global";

import { setCourseByProf } from "../../actions/course";

const CardStyle = { backgroundColor: "#ffffff", borderRadius: "1.5rem" };

function WikiSummary() {
  const [addBtn, setAddBtn] = useState(true);
  const [rmBtn, setRmBtn] = useState(true);
  const [starBtn, setStarBtn] = useState(true);

  const [profFilter, setProfFilter] = useState();
  const [timeFilter, setTimeFilter] = useState();

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
            {/* {setProfFilter(selectedCourse.prof)} */}
            {/* {setDayFilter(dayFormatter(selectedCourse.time))} */}
            {/* {setTimeFilter(timeObjFommatter(selectedCourse.time))} */}

            <Radio.Group
              value={selectedCourse.professor}
              size="medium"
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
                >
                  {prof}
                </Radio.Button>
              ))}
            </Radio.Group>
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
                <Radio.Button className="mr-1 mb-1" value={time}>
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
    else res = res + "," + weekday[i];
  });
  return res;
}

export default WikiSummary;
