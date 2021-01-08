import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Input, Checkbox, Radio } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Layout, Menu } from "antd";
import Wishlist from "../wishlist/Wishlist";
const { Header } = Layout;
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import prompt from "../../../static/json/prompt.json"

const querystring = require("querystring");
// import ensure_csrf_cookie from django.views.decorators.csrf
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

function UserModule() {
  //local usage 
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [login, setLogin] = useState(true); //if user is in login tab
  const [error, setError] = useState("");
  //global usage 
  const [userProfile, setUserProfile] = useState({ username: "user" }); //loginStatus?getUserProfile:{}
  const [loginStatus, setLoginStatus] = useState(false); //getSessionStatus()
 
  //login signup 
  const loginForm = ( //login main form
    <>
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your Username!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username/Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
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
      </Form.Item>
    </>
  );
  const signupForm = ( //signup main form 
    <>
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
          () => ({
            validator(_, value) {
              if (value.length >= 8) {
                return Promise.resolve();
              }
              else {return Promise.reject(
                prompt.registerRules.passwordRules.nonlength
              );
              }
            },
          }),
        ]}
        hasFeedback
        extra={prompt.registerRules.passwordRules.rules}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
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

              return Promise.reject(
                "The two passwords that you entered do not match!"
              );
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
      </Form.Item>
    </>
  );
  const loginFooter = ( //the footer of login form, including buttons 
    <Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        className="login-form-button"
        key="submit"
        loading={loading}
      >
        Log in
      </Button>{" "}
      or{" "}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setLogin(false);
        }}
      >
        register now!
      </a>
    </Form.Item>
  );
  const signupFooter = ( //the footer of signup form, including buttons 
    <Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        className="login-form-button"
        key="submit"
        loading={loading}
      >
        Sign Up
      </Button>{" "}
      Already have an account?{" "}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setLogin(true);
        }}
      >
        login in
      </a>
      here
    </Form.Item>
  );
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
  const userProfileModal = (
    <Modal
      visible={visible}
      title="Title"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      user profile
      <Button onClick={logOut}>Log Out</Button>
    </Modal>
  );
  const loginSignupModal = (
    <Modal
      visible={visible}
      title="Title"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={login ? loginSubmit : signupSubmit}
        onFinishFailed
      >
        <Form.Item label="">
          <Radio.Group
            onChange={onFormTypeChange}
            value={login ? "login" : "signup"}
          >
            <Radio.Button value="login">Login</Radio.Button>
            <Radio.Button value="signup">Sign Up</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="error message" hidden={error == "" ? true : false} style={{ color: "red" }}>
          {error}
        </Form.Item>
        {login ? loginForm : signupForm}
        {login ? loginFooter : signupFooter}
      </Form>
    </Modal>
  );

  // backend, storage related functions  
  function getSessionStatus() {
    console.log(sessionStorage);
    console.log(localStorage);
  }

  useEffect(() => {
    // Update the document title using the browser API
    getUserProfile();
  }, []);

  function getUserProfile() {
    var csrftoken = getCookie("csrftoken");
    console.log(csrftoken);
    axios
      .get("/api/users",  {
        headers: {
          // Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      })
      .then((result) => {
        console.log("result"); 
        console.log(result); 
        if (result.status == 302) {
          console.log("Successfully get user profile info");
          setError("");
          localStorage.setItem(
            "last_active_time",
            JSON.stringify(new Date())
          );
          setLoginStatus(true); 
          // setUserProfile({result}); 
        } else if (result.status == 401)
        {
          setLoginStatus(false); 
        }
      })
      .catch(err => {
          setError(
            "Sorry, we cannot keep you login at this time due to unknown error, please try later."
          );
     });
  }

  function logOut() {
    console.log("user should be logged out");
    var csrftoken = getCookie("csrftoken");
    console.log(csrftoken);
    axios
      .get("/api/users/logout", 
      {
        headers: {
          // Accept: "application/x-www-form-urlencoded",
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      }
      )
      .then((result) => {
        console.log(result); 
        console.log("Successfully logout user");
        setLoginStatus(false); //use getSessionStatus
        handleOk(true);
        localStorage.removeItem("last_active_time");
      })
      .catch(err => {
        setError(
          "Sorry, we cannot complete your request at this time, please try again."
        );
        localStorage.setItem(
          "last_active_time",
          JSON.stringify(new Date())
        );
        console.log(err.response); 
      });
  } //send to backend log user out

  function autoLogout() {
    //auto log out user if website is inactive for 6 hours
    let lastActiveTime = new Date(
      JSON.parse(localStorage.getItem("last_active_time"))
    );
    let inactiveTimeDiffMs = Math.abs(lastActiveTime - new Date()); //in milliseconds
    if (inactiveTimeDiffMs / 1000 == 21600) {
      //if time difference is 6 hours (21600 seconds)
      console.log("auto logout");
      logOut();
    }
    setTimeout(() => {
      // console.log(localStorage.getItem('last_active_time'));
    }, 10000);
  }

  function getCookie(name) {
    var cookieValue = null;
    console.log("document.cookie: " + document.cookie);
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        // var cookie = jQuery.trim(cookies[i]);
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  function loginSubmit(values) {
    console.log(values);
    console.log("login submit ran");
    let userLoginObj = {
      username: values.username,
      password: values.password,
    };
    var csrftoken = getCookie("csrftoken");
    console.log(csrftoken);
    axios
      .post("/api/users/login", userLoginObj, {
        headers: {
          // Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      })
      .then((result) => {
        console.log("result"); 
        console.log(result); 
        if (result.status == 200) {
          console.log("Successfully login user");
          setError("");
          setLoginStatus(true); //use getSessionStatus
          getSessionStatus();
          handleOk(true);
          localStorage.setItem(
            "last_active_time",
            JSON.stringify(new Date())
          );
        }
      })
      .catch(err => {
        console.log(err.response.status);
        if (err.response.status >= 400 && err.response.status < 500) {
          console.log("Error due to invalid password or username");
          setError("Incorrect username or password.");
          handleOk(false);
        } else {
          console.log("login error due to others");
          setError(
            "Sorry, we cannot complete your request at this time due to unknown error, please try later."
          );
          handleOk(false);
        }
     });
  }

  function signupSubmit(values) {
    console.log(values);
    console.log("signup submit ran");
    console.log(values.email);
    let userRegObj = {
      username: values.username,
      email: values.email,
      password: values.password,
    };
    var csrftoken = getCookie("csrftoken");
    console.log(csrftoken);
    axios
      .post("/api/users/register", userRegObj, {
        headers: {
          // Accept: "application/x-www-form-urlencoded",
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      })
      .then((result) => {
        if (result.status == 200) {
          console.log("Successfully register user");
          setError("");
          setLoginStatus(true); //use getSessionStatus
          handleOk(true);
          localStorage.setItem(
            "last_active_time",
            JSON.stringify(new Date())
          );
        }
      })
      .catch(err => {
        console.log(err.response); 
        if (err.response.status >= 400 && err.response.status < 500) {
          console.log("Error due to failed registration constraint");
          let passwordErrMes = typeof err.response.data.password !== 'undefined'?("\n"+err.response.data.password):""; 
          let emailErrMes = typeof err.response.data.email !== 'undefined'?("\n"+err.response.data.email):""; 
          let usernameErrMes = typeof err.response.data.username !== 'undefined'?("\n"+err.response.data.username):""; 
          setError(
            "Sorry, we cannot complete your request at this time due to failed registration constraint, please try again.\n"
            + passwordErrMes + emailErrMes + usernameErrMes
          );
          handleOk(false);
        } else {
          console.log("register error due to others");
          setError(
            "Sorry, we cannot complete your request at this time due to unknown error, please try again."
          );
          handleOk(false);
        }
      });
  }

  // local 
  function showModal() {
    setVisible(true);
  }

  function handleOk(successful) {
    setLoading(true);
    setTimeout(() => {
      if (successful) setVisible(false);
      setLoading(false);
    }, 1000);
  }

  function handleCancel() {
    setVisible(false);
    setError(""); 
  }

  function onFormTypeChange(e) {
    setLogin(e.target.value == "login");
  }

  return (

            <>
            {() => {if (loginStatus) setTimeout(function(){ autoLogout(); }, 300000); }}
              <Button type="primary" className="mx-2" onClick={showModal}>
                {loginStatus ? userProfile.username : "Login"}
              </Button>
              {loginStatus ? userProfileModal : loginSignupModal}
            </>
  );
}

export default UserModule;
