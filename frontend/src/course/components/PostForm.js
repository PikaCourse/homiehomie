import React, { Component, Fragment, useState, useCallback } from "react";
import "antd/lib/style/themes/default.less";
import "antd/dist/antd.less";
import "../../main.less";
import axios from "axios";
import TagAutoComplete from "./TagAutoComplete"

import {
  Button,
  Input,
  Card,
  Form,
  message,
  resetFields,
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
    
    // deal with undefined
    var tags; 
    var title; 
    typeof values.tags === 'undefined'?tags="":tags=values.tags; 
    typeof values.title === 'undefined'|| values.title == ""?title=firstWord:title=values.title; 


    var success = false; 
    let post = {
      // TODO read multiple tags 
      tags: [tags],
      title: title,
      content: values.content
    }; 

    axios.post("api/posts", post, {
      headers: {
        "Content-Type": "application/json",
      }}, 
    ).then((res) => {
      console.log(res); 
      if (res.status != 201) {
        onFinishFailed(res.statusText)}
      else {
        success = true; 
        form.resetFields(); 
        message.success(`Congrats! Create post successfully`);
      }
    });
    //TODO disable form if user is not logged in 
    success?null:message.error('Something went wrong! Please try again!', 10)
    success?null:message.warning('Please make sure you are logged in', 10)
  }

  return (
    <>
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
    // onFinishFailed={onFinishFailed}
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
        <TagAutoComplete/>
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