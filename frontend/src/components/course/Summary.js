import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../store";
import {
  Card,
  Radio,
  Switch,
  Select,
  Input,
  Button,
  Tooltip,
  message,
} from "antd";
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

  return (
    <Fragment>
      <div className="p-4 my-2 mt-4" style={CardStyle}>
        {!isEmpty(selectedCourse) ? (
          <div>
            <h1 className="mr-2 align-middle" style={{ display: "inline" }}>
              <span style={{ color: Color }}>
                {selectedCourse.course_meta.title}{" "}
              </span>
              {selectedCourse.course_meta.name}
            </h1>

            <div>
              <p className="my-2" style={{ fontFamily: "Montserrat" }}>
                {weekday.map((day, i) => (
                  <span className={weekdayToClass(i, selectedCourse.time)}>
                    {day} {console.log(selectedCourse)}
                  </span>
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
            <div>
              <Radio.Group
                defaultValue={selectedCourse.professor}
                size="small"
                buttonStyle="solid"
              >
                {professors.map((prof, index) => {
                  index % 4 == 0 ? (
                    <Radio.Button value={prof}>{prof}</Radio.Button>
                  ){"\n"}: (
                    <Radio.Button value={prof}>{prof}</Radio.Button>
                  );
                })}
              </Radio.Group>
            </div>
          </div>
        ) : (
          <Card bordered={false} loading={true}></Card>
        )}
      </div>
    </Fragment>
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

export default WikiSummary;
