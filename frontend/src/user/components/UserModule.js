/**
 * File name:	UserModule.js
 * Created:	02/11/2021
 * Author:	Weili An
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	Top level component file for user module
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import UserAvatar from "./UserAvatar";
import LoginRegister from "./LoginRegister";

/**
 * Top level user module
 * @param {*} props 
 */
export default function UserModule(props) {
  // Login Status of user
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // User info management
  const [userInfo, setUserInfo] = useState({});

  // Check if user already logged in when the component
  // first loaded
  // If so, set status and user info
  // TODO Comment out for testing avatar
  /*
  useEffect(() => {
    function checkLogin() {
      axios.get("/api/users")
        .then((res) => {
          if (res.status === 200) {
            setIsLoggedIn(true);
            setUserInfo(res.data);
          }
          else
            setIsLoggedIn(false);
        });
    }
    checkLogin();
  }, []); */

  // TODO Setup ws connection to listen for notification

  // On start, see if logged in
  // if logged in, display User avator
  //  else login/register button
  if (isLoggedIn)
    return (
      <>
        <UserAvatar 
          setLogin={setIsLoggedIn}
          userInfo={userInfo}
        />
      </>
    );
  else
    return (
      <>
        {
          /** 
           * TODO Is there a better way to send in handler funcs? 
           * */
        }
        <LoginRegister 
          setLogin={setIsLoggedIn} 
          setUserInfo={setUserInfo}
        />
      </>
    );
}