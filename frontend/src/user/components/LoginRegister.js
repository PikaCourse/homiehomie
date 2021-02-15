/**
 * File name:	LoginRegister.js
 * Created:	02/11/2021
 * Author:	Weili An
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	Component to handle login and register
 */

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Space, Checkbox, message } from "antd";
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
          ? <UserLoginForm setLogin={setLogin} setUserInfo={setUserInfo} switchForm={switchForm} afterSubmit={ () => setModalVisible(false)}/>
          : <UserRegisterForm setLogin={setLogin} setUserInfo={setUserInfo} switchForm={switchForm} afterSubmit={ () => setModalVisible(false)}/>
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
  const afterSubmit = props.afterSubmit;

  // Get form instance
  const [ form ] = Form.useForm();

  // Form control state
  const [ isLoading, setIsLoading ] = useState(false);

  // OnSubmit callback
  function submitForm(values) {
    // Perform update request here
    setIsLoading(true);
    console.log(values);

    // Submit form and see if there are validation err msgs
    axios.post("/api/users/login", values)
      .then((res) => {
        console.log(res);

        // Update user info state based on returned profile
        setUserInfo(res.data.profile);
        setLogin(true);
        // Call callback
        message.success("Successfully logged in");
        afterSubmit();
        setIsLoading(false);
      })
      .catch((err) => {
        // If error status is 400, display validation messages
        //    Under corresponding fields
        setLogin(false);
        if (err.response.status == 403) {
          const backendValidationRes = err.response.data;
          const fieldErrMsg = [
            {
              name: "username",
              errors: [backendValidationRes["detail"]]
            },
            {
              name: "password",
              errors: [backendValidationRes["detail"]]
            }
          ];
          form.setFields(fieldErrMsg);
        } else {
          message.error("Some unkown errors occurred, please try again later");
        }
        setIsLoading(false);
      });
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
  const switchForm = props.switchForm;
  const afterSubmit = props.afterSubmit;

  // Get form instance
  const [ form ] = Form.useForm();

  // Form control state
  const [ isLoading, setIsLoading ] = useState(false);

  // User Agreement Modal control
  const [isUAModalVisible, setUAModalVisible] = useState(false);
  const setUACheck = (isChecked) => {
    form.setFields([{
      name: "agreement",
      value: isChecked
    }]);
  };

  // OnSubmit callback
  function submitForm(values) {
    // Perform update request here
    setIsLoading(true);
    console.log(values);
    // TODO Submit form and see if there are validation err msgs
    axios.post("/api/users/register", values)
      .then((res) => {
        console.log(res);

        // Update user info state based on returned profile
        setUserInfo(res.data.profile);
        setLogin(true);
        // Call callback
        message.success("Successfully registered! Please go ahead and fill up your profile!");
        afterSubmit();
        setIsLoading(false);
      })
      .catch((err) => {
        // If error status is 400, display validation messages
        //    Under corresponding fields
        if (err.response.status == 400) {
          const backendValidationRes = err.response.data;
          const fieldErrMsg = [];
          for (const [ fieldName, errMsgs ] of Object.entries(backendValidationRes)) {
            fieldErrMsg.push(
              {
                name: fieldName,
                errors: errMsgs
              }
            );
          }
          form.setFields(fieldErrMsg);
        } else {
          message.error("Some errors occurred, make sure you have the right permission");
        }
        setIsLoading(false);
      });
  }

  return (
    <>
      <Form
        name="user_register"
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
          <Input placeholder="e.g. Kakapi" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              pattern: /^.*@.*\.edu$/,
              message: "Please input a valid .edu email!"
            }
          ]}
        >
          <Input placeholder="e.g. pika@course.edu" />
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
        <Form.Item
          label="Confirm Password"
          name="confirm_password"
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("The two passwords that you entered do not match!");
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="input password, again..."
          />
        </Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              required: true,
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject("Please read and accept agreement"),
            },
          ]}
        >
          <Checkbox>
            I have read the 
            <a href=""
              onClick={(e) => {
                e.preventDefault();
                setUAModalVisible(true);
              }}
            >
              &nbsp;agreement
            </a>
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Create
            </Button>
            <>
              Already have an account?
              <a href="#" onClick={(e) => {
                e.preventDefault();
                switchForm();
              }}>
              log in here
              </a>
            </>
          </Space>
        </Form.Item>
      </Form>
      <Modal
        title="PikaCourse User Agreement"
        visible={isUAModalVisible}
        okText="I agree"
        cancelText="I disagree"
        onOk={() => {
          setUACheck(true);
          setUAModalVisible(false);
        }}
        onCancel={() => {
          setUACheck(false);
          setUAModalVisible(false);
        }}
      >
        User Agreement for PikaCourse
      </Modal>
    </>
  );
}

function convert(values) {
  // Convert from JSON to `application/x-www-form-urlencoded`
  const params = new URLSearchParams();
  for (const [key, value] in Object.entries(values)) {
    params.append(key, value);
  }
}