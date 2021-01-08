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
              <p className="mb-1" style={{ fontFamily: "Montserrat" }}>
                {weekday.map((day, index) => (
                  <span className={weekdayToClass(index, selectedCourse.time)}>
                    {day}
                  </span>
                ))}
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
  for (let i = 0; i < timeArray.length; i++) {
    if (timeArray[i].weekday == index) return "mb-1 badge bg-secondary";
  }
  return "badge bg-light mb-1";
}

export default WikiSummary;
