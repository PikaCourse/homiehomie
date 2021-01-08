import React, { Component, Fragment } from "react";
import { Switch, Select, Input, Button, Tooltip, message } from "antd";
const { Search } = Input;
import store from "../../store";
import { getCourse } from "../../actions/course";

const prompt = "Search subject, CRN or course name";
function WikiSearch() {
  return (
    <Search
      bordered={false}
      style={{
        backgroundColor: "#ffffff",
        borderTopLeftRadius: "5rem",
        borderBottomLeftRadius: "5rem",
        borderTopRightRadius: "10rem",
        borderBottomRightRadius: "10rem",
      }}
      placeholder={prompt}
      allowClear
      enterButton={
        <Button className="mx-1" type="ghost" size="large">
          Search
        </Button>
      }
      size="large"
      type="ghost"
      onSearch={(value) => store.dispatch(getCourse(value))}
    />
  );
}

export default WikiSearch;
