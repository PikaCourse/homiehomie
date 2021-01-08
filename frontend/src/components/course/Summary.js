import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../store";
import { Card, Switch, Select, Input, Button, Tooltip, message } from "antd";
import { isEmpty } from "../../helper/dataCheck";

const weekday = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const CardStyle = { backgroundColor: "#ffffff", borderRadius: "1.5rem" };
const Color = "#419EF4";

function WikiSummary() {
  const [addBtn, setAddBtn] = useState(true);
  const [rmBtn, setRmBtn] = useState(true);
  const [starBtn, setStarBtn] = useState(true);
  const selectedCourse = useSelector((state) => state.course.selectedCourse);
  const dispatch = useDispatch();
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
              </p>
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
//   if (typeof timeArray == "string") timecp = JSON.parse(timecp);
  let result = "badge bg-light mb-1";
  timecp.map((timeObj) => {
    console.log(timeObj.weekday == index);

    console.log(index);
    console.log(timeObj);
    console.log(timeObj.weekday);
    console.log("-------------------");
    if (timeObj.weekday == index) {
      result = "mb-1 badge bg-secondary";
    }
  });
  //   for (let i = 0; i < timeArray.length; i++) {
  //     console.log(i);
  //     console.log(timeArray);
  //     console.log(timeArray[i].weekday);
  //     console.log("-------------------");

  //     if (timeArray[i].weekday == index) return "mb-1 badge bg-secondary";
  //   }
  return result;
}

export default WikiSummary;
