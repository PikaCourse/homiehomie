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
  Col, 
} from "antd";

function PostForm () {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onFinish = (values) => {
    //Get the first word of content, later used as title 
    var firstWord = values.content.split(/[ ,]+/)[0];

    let post = {
      // TODO read multiple tags 
      tags: [values.tags],
      title: values.title, //values.title==""?firstWord:values.title,
      content: values.content
    }; 

    axios.post("api/posts", post, {
      headers: {
        // Accept: "application/json",
        "Content-Type": "application/json",
      }}, ).then((res) => {
      console.log(res); 
    });
  }

  const onFinishFailed = () => {
    //TODO: display an error message 
  }

  return (
    <>
    {/* <h3>This is for post creation</h3>
    <h3>Development purpose only</h3> */}
    {/* <UserModule/> */}
    <Card  style={{backgroundColor: 'rgba(255,255,255)', border: 0 }}>
    <h5>Something to share?</h5>
    <Space/>
    <Form {...layout} 
    name="Make a new post"
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    >
      <Form.Item name="title" >
        <Input placeholder="title (optional)" bordered={false}/>
      </Form.Item>
      <Form.Item 
      name="content" 
      rules={[
        {
          required: true,
          message: 'Please input your content',
        },
      ]}
      >
        <Input placeholder="text" bordered={false}/>
      </Form.Item>
      <Divider/>
      <Form.Item name="tags" >
        <Input placeholder="#tags" bordered={false}/>
      </Form.Item>
      <Form.Item name="submit" style={{float: 'right'}}>
        <Button type="dashed" htmlType="submit">Post</Button>
      </Form.Item>
    </Form>
    </Card>
    </>
  ); 
}

export default PostForm; 