import React, { Component, Fragment } from "react";
import { Switch, Select, Input, Button, Tooltip, message } from "antd";
import store from "../../store";


const prompt = "Search subject, CRN or course name"
export function Search() 
{
  return (
    <Search
      bordered={false}
      style={{ backgroundColor: "#ffffff", borderRadius: "0.5rem" }}
      placeholder= {prompt}
      allowClear
      enterButton={
        <Button className="mx-1" type="ghost" size="large">
          Search
        </Button>
      }
      size="large"
      type="ghost"
      onSearch={(value) =>store.dispatch(getCourse(value))}
    />
  );
}
