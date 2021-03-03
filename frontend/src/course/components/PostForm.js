import React, { Component, Fragment, useState, useCallback } from "react";
import "antd/lib/style/themes/default.less";
import "antd/dist/antd.less";
import "../../main.less";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faPen,
  faTimes,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import store from "../../store";
import axios from "axios";
// import UserModule from "../../user/UserModule"

import {
  Button,
  Input,
  Card,
  Form,
  Checkbox,
  message,
  resetFields,
  Switch,
  Space,
  Divider, 
} from "antd";

function PostForm () {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  return (
    <>
    {/* <h3>This is for post creation</h3>
    <h3>Development purpose only</h3> */}
    {/* <UserModule/> */}
    <Card  style={{backgroundColor: 'rgba(255,255,255)', border: 0 }}>
    <h5>Something to share?</h5>
    <Form {...layout} name="Make a new post">
      <Form.Item name="title" >
      <Input placeholder="title(optional)" bordered={false}/>
      </Form.Item>
      <Form.Item name="content" >
      <Input placeholder="text" bordered={false}/>
      </Form.Item>
      <Divider/>
      <Form.Item name="tags" >
      <Input placeholder="#tags" bordered={false}/>
      </Form.Item>
    </Form>
    </Card>
    </>
  ); 
}

export default PostForm; 