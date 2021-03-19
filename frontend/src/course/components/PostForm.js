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
  const [form] = Form.useForm();

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  

  const onFinish = (values) => {
    //Get the first word of content, later used as title 
    var firstWord = values.content.split(/[ ,]+/)[0];
    
    //undefined
    var tags; 
    var title; 
    typeof values.tags === 'undefined'?tags="":tags=values.tags; 
    typeof values.title === 'undefined'|| values.title == ""?title=firstWord:title=values.title; 


    let post = {
      // TODO read multiple tags 
      tags: [tags],
      title: title,
      content: values.content
    }; 

    axios.post("api/posts", post, {
      headers: {
        // Accept: "application/json",
        "Content-Type": "application/json",
      }}, ).then((res) => {
      console.log(res); 
      res.status != 201?onFinishFailed(res.statusText):form.resetFields(); 
      //TODO pop up a message when post successfully 
    });
  }

  const onFinishFailed = (errorMessage) => {
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
    form={form}
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