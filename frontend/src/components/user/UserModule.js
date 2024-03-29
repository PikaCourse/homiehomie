/**
 * File name:	UserModule.js
 * Created:	01/18/2021
 * Author:	Joanna Fang
 * Email:	foo@bar.com
 * Version:	1.0 Initial file
 * Description:	User login and register module
 */

import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Input, Checkbox, Radio } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Layout, Menu } from "antd";
const { Header } = Layout;
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import prompt from "../../../static/json/prompt.json";
import store from '../../store'
import {updateLoginStatus, getUserSchedule, updateUserSchedule, getUserWishlist, updateUserWishlist} from '../../actions/user'
import { mergeCalendar } from '../../calendar/action';
import {useDispatch, useSelector} from "react-redux";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
import {loadUserCourseBag} from '../../helper/loadUserCalendar'
import { year, semester, courseDataPatch, school } from "../../helper/global";
import {mergeWishlist} from "../../wishlist/action";

// TODO Need documentation @joannafg
function UserModule() {
  const wishlistCourseBag = useSelector(
    (state) => state.wishlist.wishlistCourseBag
  );
  const calendarCourseBag = useSelector(
    (state) => state.calendar.calendarCourseBag
  );
  //local usage 
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [login, setLogin] = useState(true); //if user is in login tab
  const [error, setError] = useState("");
  const [scheduleConflictVisible, setScheduleConflict] = useState(false); //visibility
  //global usage 
  const [userProfile, setUserProfile] = useState({ username: "user" }); //loginStatus?getUserProfile:{}
  const [schedules, setSchedules] = useState({current:[], server:[]}); 
  // const [loginStatus, dispatch(updateLoginStatus] = useState(false); //()
  //store 
  const loginStatus = useSelector(state => state.user.loginStatus); 
  const dispatch = useDispatch(); 
  //login signup 
  // TODO Consider making this a component
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

        {
          // TODO Implement this
        }
        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>
    </>
  );
  // TODO Support backend api verifying whether the username or email is usuablee via additional apis
  // TODO Example https://ant.design/components/form-cn/#components-form-demo-validate-static
  // TODO Consider making this a component
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
          // TODO Password length checker, why not use `min` or `max` Rule?
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
      title="User Profile"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      {Object.keys(userProfile).map(key => 
        <h5
          key={key}
        >
          {key+ " : "+userProfile[key]}
        </h5>
      )}
     
      <Button onClick={logOut}>Log Out</Button>
    </Modal>
  );
  const loginSignupModal = (
    <Modal
      visible={visible}
      // title="Title"
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
  const scheduleConflict = <Modal 
  title="Schedule Conflict" 
  visible={scheduleConflictVisible} 
  onOk={handleOk} 
  onCancel={handleCancel}
  closable={false}
  footer={null}
  >
    <p>{prompt.userScheduleConflictMessage}</p>
    <Button onClick={()=>{
      dispatch(updateUserSchedule(schedules.current)); 
      setScheduleConflict(false); 
    }}>Save Current Schedule</Button>
    <Button onClick={()=>{
      dispatch(overwriteCourseBag(schedules.server)); 
      setScheduleConflict(false); 
    }}>Disgard Current Schedule</Button>
  </Modal>; 

  useEffect(() => {
    // Update the document title using the browser API
    getUserProfile(); 
  }, []);

  function getUserProfile() {
    var csrftoken = getCookie("csrftoken");
    axios
      .get("/api/users",  {
        headers: {
          // Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      })
      .then((result) => {
        if (result.status == 302 || result.status == 200) {
          console.log("Successfully get user profile info");
          setError("");
          localStorage.setItem(
            "last_active_time",
            JSON.stringify(new Date())
          );
          dispatch(updateLoginStatus(true)); 
          // setUserProfile({result}); 
          setUserProfile({username: result.data.username, email: result.data.email}); 
          dispatch(getUserSchedule());
          dispatch(getUserWishlist());
        } 
      })
      .catch(err => {
        console.log("get user err.response"); 
        console.log(err); 
        if (err.response.status == 403 || err.response.status == 401) {
          console.log("user is not logged in"); 
          dispatch(updateLoginStatus(false)); 
        }
        else {
          setError(
            "Sorry, we cannot keep you login at this time due to unknown error, please try later."
          );
        }
     })
     .finally(()=>{
      
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
        handleOk(true);
        console.log(result); 
        console.log("Successfully logout user");
        dispatch(updateLoginStatus(false)); //use getSessionStatus
        localStorage.removeItem("last_active_time");
        window.location.reload(); 
        localStorage.clear();
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
    if (inactiveTimeDiffMs == 60000) {
      //inactiveTimeDiffMs / 1000 == 21600
      //if time difference is 6 hours (21600 seconds)
      console.log("auto logout");
      logOut();
    }
    setTimeout(() => {
      console.log("last_active_time"); 
      console.log(localStorage.getItem('last_active_time'));
    }, 1000);
  }

  // TODO Put these kinds of code snippets in utils file
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
    console.log("login submit ran");
    var userLoginObj = {
      username: values.username,
      password: values.password,
    };
    var csrftoken = getCookie("csrftoken");
    axios
      .post("/api/users/login", userLoginObj, {
        headers: {
          // Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      })
      .then((result) => {
        if (result.status == 200) {
          // dispatch(overwriteCourseBag(store.getState().user.schedule)); //default overwrite existing schedule 
          getUserProfile();
          handleOk(true);
          console.log("Successfully login user");
          setError("");
          dispatch(updateLoginStatus(true)); //use getSessionStatus
          localStorage.setItem(
            "last_active_time",
            JSON.stringify(new Date())
          );
        }
      })
      .catch(err => {
        handleOk(false);
        console.log("login submit error:");
        console.log(err);
        // console.log(err.response.status);
        if (err.response.status >= 400 && err.response.status < 500) {
          console.log("Error due to invalid password or username");
          setError("Incorrect username or password.");
        } else {
          console.log("login error due to others");
          setError(
            "Sorry, we cannot complete your request at this time due to unknown error, please try later."
          );
        }
      })
      .finally(() => {
        handleScheduleConflict();
        axios
          .get("/api/wishlists")
          .then((result) => {
            var serverWishlist = result.data[0].reduce((courses, course) => {
              courses[course.id] = course;
              return courses;
            });
            // Merge current wishlist bag with server side
            dispatch(mergeWishlist(serverWishlist)); 

            // TODO
            dispatch(updateUserWishlist()); 
          })
          .catch((err) => {});
      });
  }

  function arraysEqual(_arr1, _arr2) {
    if (
      !Array.isArray(_arr1)
      || !Array.isArray(_arr2)
      || _arr1.length !== _arr2.length
      ) {
        return false;
      }
    
    // .concat() is used so the original arrays are unaffected
    const arr1 = _arr1.concat().sort();
    const arr2 = _arr2.concat().sort();
    
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
         }
    }
    
    return true;
}

  function handleScheduleConflict() {
    axios
      .get("/api/schedules")
      .then(result => {
        var localCourseIds = store.getState().calendar.calendarCourseBag.map(a => a.courseId);
        var serverCourseIds = result.data[0].custom.map(b => b.courseId);
        if (result.data[0].custom.length != 0) {
          setSchedules({
            current: store.getState().calendar.calendarCourseBag,
            server: result.data[0].custom,
          });
        }
        if (store.getState().calendar.calendarCourseBag.length != 0 && result.data[0].custom != 0 &&
          !arraysEqual(localCourseIds, serverCourseIds)) {
          console.log("conflict found");
          setScheduleConflict(true);
        } else if (store.getState().calendar.calendarCourseBag.length == 0 && result.data[0].custom != 0) {
          dispatch(overwriteCourseBag(result.data[0].custom));
        } else if (store.getState().calendar.calendarCourseBag.length != 0 && result.data[0].custom == 0) {
          dispatch(updateUserCalendarBag(store.getState().calendar.calendarCourseBag));
        }
      })
      .catch((err) => {});
  }

  function signupSubmit(values) {
    let userRegObj = {
      username: values.username,
      email: values.email,
      password: values.password,
    };
    var csrftoken = getCookie("csrftoken");
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
          handleOk(true);
          console.log("Successfully register user");
          setError("");
          dispatch(updateLoginStatus(true)); //use getSessionStatus
          localStorage.setItem(
            "last_active_time",
            JSON.stringify(new Date())
          );
          getUserProfile();   
        }
      })
      .catch(err => {
        handleOk(false);
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
        } else {
          console.log("register error due to others");
          setError(
            "Sorry, we cannot complete your request at this time due to unknown error, please try again."
          );
        }
      });
  }

  // local 
  function showModal() {
    setVisible(true);
  }

  function handleOk(successful) {
    if (successful) setVisible(false);
    // setLoading(true);
    // setTimeout(() => {
    //   if (successful) setVisible(false);
    //   setLoading(false);
    // }, 1000);
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
            {/* {loginStatus?null:logOut()} */}
              <Button type="primary" className="mx-2" onClick={showModal}>
                {loginStatus ? userProfile.username : "Login"}
              </Button>
              {loginStatus ? userProfileModal : loginSignupModal}
              {scheduleConflict}
            </>
  );
}

export default UserModule;
