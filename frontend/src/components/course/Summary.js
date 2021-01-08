import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../store";
import { Card, Switch, Select, Input, Button, Tooltip, message } from "antd";
const CardStyle = { backgroundColor: "#ffffff", borderRadius: "1.5rem" };
const Color = "#419EF4";
import {isEmpty} from '../../helper/dataCheck'
function WikiSummary() {
  const [addBtn, setAddBtn] = useState(true);
  const [rmBtn, setRmBtn] = useState(true);
  const [starBtn, setStarBtn] = useState(true);
  const selectedCourse = useSelector(state => state.course.selectedCourse);
  const dispatch = useDispatch();
  return (
    <Fragment>
      <div className="p-4 my-2 mt-4" style={CardStyle}>
        {!isEmpty(selectedCourse) ? (
          <div>
            <h1
              className="mr-2 align-middle"
              style={{ color: "#419EF4", display: "inline" }}
            >
              {selectedCourse.course_meta.title}
            </h1>
          </div>
        ) : (
          <Card bordered={false} loading={true}></Card>
        )}
      </div>
    </Fragment>
  );
}

export default WikiSummary;
