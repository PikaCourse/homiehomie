/**
 * File name:	LoginRegister.js
 * Created:	02/11/2021
 * Author:	Weili An
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	Component to handle login and register
 */

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Space } from "antd";
import axios from "axios";
// Config axios to get the csrf cookie preventing manually
// adding it
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";

// TODO Return a button and onclick, popup the login and register windows
// TODO Also set userinfo after login/register

/**
 * User login/register top level ccomponent
 * handle user login and register actions
 * @param {*} props 
 */
export default function LoginRegister(props) {
  // Inherited state control
  const setLogin = props.setLogin;
  const setUserInfo = props.setUserInfo;

  // Modal visibility control
  const [ isModalVisible, setModalVisible ] = useState(false);
  const [ isLoginForm, setLoginForm ] = useState(true);

  function switchForm() {
    setLoginForm(!isLoginForm);
  }


  return (
    <>
      <Space>
        <Button type="primary" 
          onClick={() => {
            setModalVisible(true);
            setLoginForm(true);
          }}>Login</Button>
        <Button type="default" onClick={() => {
          setModalVisible(true);
          setLoginForm(false);
        }}>Signup</Button>
      </Space>
      {
        // TODO Only have one modal but switch between forms
      }
      <Modal
        title={ isLoginForm ? "Log in" : "Create Your Account" }
        visible={isModalVisible}
        onOk={() => setModalVisible(false)} 
        onCancel={() => setModalVisible(false)}
        footer={null}>
        { isLoginForm 
          ? <UserLoginForm setLogin={setLogin} setUserInfo={setUserInfo} switchForm={switchForm} />
          : <UserRegisterForm setLogin={setLogin} setUserInfo={setUserInfo} switchForm={switchForm} />
        }
      </Modal>
    </>
  );
}

/**
 * Form to handle user login request
 * @param {*} props 
 */
function UserLoginForm(props) {
  // Inherited state control
  const setLogin = props.setLogin;
  const setUserInfo = props.setUserInfo;
  const switchForm = props.switchForm;

  // Get form instance
  const [form] = Form.useForm();

  // Form control state
  const [ isLoading, setIsLoading ] = useState(false);

  // OnSubmit callback
  function submitForm(values) {
    // Perform update request here
    setIsLoading(true);
    console.log(values);
    // TODO Submit form and see if there are validation err msgs
  }

  return (
    <Form
      name="user_login"
      form={form}
      onFinish={submitForm}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          }
        ]}
      >
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          }
        ]}
      >
        <Input.Password
          placeholder="input password"
        />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Log in
          </Button>
          <>
            Don&apos;t have an account? 
            <a href="#" onClick={(e) => {
              e.preventDefault();
              switchForm();
            }}>
            sign up here
            </a>
          </>
        </Space>
      </Form.Item>
    </Form>
  );
}

/**
 * Form to handle user registration
 * @param {*} props 
 */
function UserRegisterForm(props) {
  // Inherited state control
  const setLogin = props.setLogin;
  const setUserInfo = props.setUserInfo;

  // Get form instance
  const [form] = Form.useForm();

  // Form control state
  const [ isLoading, setIsLoading ] = useState(false);

  // OnSubmit callback
  function submitForm(values) {
    // Perform update request here
    setIsLoading(true);
    console.log(values);
    // TODO Submit form and see if there are validation err msgs
  }

  return (
    <Form
      name="user_register"
      form={form}
      onFinish={submitForm}
    >

    </Form>
  );
}

function convert(values) {
  // Convert from JSON to `application/x-www-form-urlencoded`
  const params = new URLSearchParams();
  for (const [key, value] in Object.entries(values)) {
    params.append(key, value);
  }
}