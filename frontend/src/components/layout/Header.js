import React, { Component, useState, useEffect} from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Input, Checkbox, Radio} from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from "axios";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
const querystring = require("querystring");
// import ensure_csrf_cookie from django.views.decorators.csrf 
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
// import CSRFToken from '../user/csrftoken';


function Header() {

  const [loading, setLoading] = useState(false); 
  const [visible, setVisible] = useState(false); 
  const [login, setLogin] = useState(true);  //if user is in login tab 
  const [error, setError] = useState(""); 
  const [userProfile, setUserProfile] = useState({username: ""}); //loginStatus?getUserProfile:{}
  const [loginStatus, setLoginStatus] = useState(false); //getSessionStatus()
  
  const loginForm = <><Form.Item
      name="username"
      rules={[
        {
          required: true,
          message: 'Please input your Username!',
        },
      ]}
    >
      <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username/Email" />
    </Form.Item>
    <Form.Item
      name="password"
      rules={[
        {
          required: true,
          message: 'Please input your Password!',
        },
      ]}
    >
      <Input
        prefix={<LockOutlined className="site-form-item-icon" />}
        type="password"
        placeholder="Password"
      />
    </Form.Item>
    <Form.Item>
      <Form.Item name="remember" valuePropName="checked" noStyle>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <a className="login-form-forgot" href="">
        Forgot password
      </a>
    </Form.Item></>; 
  const signupForm = <><Form.Item
      name="email"
      label="E-mail"
      rules={[
        {
          type: 'email',
          message: 'The input is not valid E-mail!',
        },
        {
          required: true,
          message: 'Please input your E-mail!',
        },
      ]}
      extra="Email will automatically be your username for your convenience."
    >
      <Input />
    </Form.Item>

    <Form.Item
      name="password"
      label="Password"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
      hasFeedback
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
      name="confirm"
      label="Confirm Password"
      dependencies={['password']}
      hasFeedback
      rules={[
        {
          required: true,
          message: 'Please confirm your password!',
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }

            return Promise.reject('The two passwords that you entered do not match!');
          },
        }),
      ]}
    >
      <Input.Password />
    </Form.Item>
    <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject('Please read and accept agreement'),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the <a href="">agreement</a>
        </Checkbox>
      </Form.Item></>; 
  const loginFooter = 
    <Form.Item> <Button type="primary" htmlType="submit" className="login-form-button" key="submit" loading={loading} >
    Log in
    </Button> or <a href="#" onClick={(e) => {e.preventDefault();setLogin(false);}}>register now!</a></Form.Item>; 
  const signupFooter = 
    <Form.Item> <Button type="primary" htmlType="submit" className="login-form-button" key="submit" loading={loading} >
    Sign Up
    </Button> Already have an account? <a href="#" onClick={(e) => {e.preventDefault();setLogin(true);}}>login in</a> here</Form.Item>; 
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
  const errorMessage = <Form.Item
        name="error message"
        hidden={error==""?true:false}
      >
        {error}
      </Form.Item>; 
  const userProfileModal = <Modal
    visible={visible}
    title="Title"
    onOk={handleOk}
    onCancel={handleCancel}
    footer = {null}
  >
    user profile
    <Button>Log Out</Button>
  </Modal>; 
  const loginSignupModal = <Modal
    visible={visible}
    title="Title"
    onOk={handleOk}
    onCancel={handleCancel}
    footer = {null}
  >
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={login?loginSubmit:signupSubmit}
      // onFinishFailed={}
    >
    <Form.Item label="">
        <Radio.Group onChange={onFormTypeChange} value={login?"login":"signup"}>
          <Radio.Button value="login">Login</Radio.Button>
          <Radio.Button value="signup">Sign Up</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="error message"
        hidden={error==""?true:false}
      >
        {error}
      </Form.Item>
      {login?loginForm:signupForm}
      {login?loginFooter:signupFooter}
  </Form>
  </Modal>; 
  
  function getSessionStatus() {
    console.log(sessionStorage); 
    console.log(localStorage); 
  }; 

  function getUserProfile() {}; 
  function getCookie(name) {
    var cookieValue = null;
    console.log("document.cookie: "+document.cookie); 
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  function showModal() {
    setVisible(true); 
  };

  function handleOk(successful) {
    setLoading(true); 
    setTimeout(() => {
      if (successful) setVisible(false); 
      setLoading(false); 
     }, 1000);
  };

  function loginSubmit(values) {
    console.log(values); 
    console.log("login submit ran"); 
    let userLoginObj = querystring.stringify({
      username: values.username,
      password: values.password,
    });
    var csrftoken = getCookie('csrftoken');
    console.log(csrftoken); 
    axios
      .post("/user/login", userLoginObj, {
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": csrftoken, 
        },
      })
      .then((result) => {
        switch(result.status) {
          case 200:
            console.log("Successfully login user"); 
            setError(""); 
            setLoginStatus(true); //use getSessionStatus
            getSessionStatus(); 
            handleOk(true); 
            break;
          case 401:
            console.log("Error due to invalid password or username"); 
            setError("Incorrect username or password."); 
            handleOk(false); 
            break;
          default:
            console.log("login error due to others"); 
            setError("Sorry, we cannot complete your request at this time due to unknown error, please try later."); 
            handleOk(false); 
        }

      });
  }

  function signupSubmit(values) {
    console.log(values); 
    console.log("signup submit ran"); 
    console.log(values.email); 
    let userRegObj = querystring.stringify({
      username: values.email,
      email: values.email, 
      password: values.password,
    });
    var csrftoken = getCookie('csrftoken');
    console.log(csrftoken); 
    axios
      .post("user/register", userRegObj, {
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": csrftoken, 
        },
      })
      .then((result) => {
        switch(result.status) {
          case 200:
            console.log("Successfully register user"); 
            setError(""); 
            setLoginStatus(true); //use getSessionStatus
            handleOk(true); 
            break;
          case 401:
            console.log("Error due to failed registration constraint"); 
            setError("Sorry, we cannot complete your request at this time due to failed registration constraint, please try again."); 
            handleOk(false); 
            break;
          default:
            console.log("register error due to others"); 
            setError("Sorry, we cannot complete your request at this time due to unknown error, please try again."); 
            handleOk(false); 
        }

      });
    handleOk(); 
  }

  function handleCancel() {
    setVisible(false); 
  };

  function onFormTypeChange(e) {
    setLogin(e.target.value == 'login'); 
  }

  return (
      // <form action="/user/login" method="post">
      //   <button type="submit">Send</button>
      // </form>
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-0 pb-2 pt-2">
    <div className="container-fluid">
      <a className="navbar-brand mx-4" href="#" style={selectedStyle}>
        CourseWiki
      </a>
      <Button type="primary" onClick={showModal}>
        {loginStatus?userProfile.username:"Login"}
      </Button>
      {loginStatus?userProfileModal:loginSignupModal}
    </div>
  </nav>
  );
  
}

const selectedStyle = {
  color: "#596C7E",
  fontWeight: "800",
  fontSize: "1.5rem",
};
export default Header;
