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
import {Row, Col, Modal, Button, Image, Divider, notification, message} from 'antd'

/**
 * Top level user module
 * @param {*} props 
 */

export default function UserModule(props) {
  // TODO How to access internal state? Store in redux
  // TODO Use 
  // Login Status of user
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // User profile control
  const [userInfo, setUserInfo] = useState({});

  const ws = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/user/notification'
  );

  // Check if user already logged in when the component
  // first loaded
  // If so, set status and user info
  useEffect(() => {
    function checkLogin() {
      axios.get("/api/users")
        .then((res) => {
          setIsLoggedIn(true);
          setUserInfo(res.data);
        })
        .catch((err) => {
          console.log(err);
          setIsLoggedIn(false);
        });
    }
    checkLogin();

    //Setup ws connection to listen for notification
  function connectWS (isLoggedIn) {
    console.log("connectws checkpoint1",isLoggedIn)
    //if is loggedin
    if(isLoggedIn){
      //let that = this; //cache this
      console.log("get to connectWS after establish websocket")
      ws.onopen = () =>{
        //for debug
        console.log('connected');
        //pull histroy
        //and display contents in notification style
        axios.get("/api/notifications")
        .then((res) => {
          res.data.results.forEach(x => 
            notification.open({
              message: 'History',
              description: x.content.content,
              onClick: () =>{
                console.log('Notification Clicked!')
              }
            }))
        })
      }
      ws.onmessage = evt =>{
        message = JSON.parse(evt.data);
        notification.open({
          message: 'Notification',
          description: message.content.content,
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
      }
      ws.onerror = err =>{
        console.error(
          "Socket encountered error: ",
                err.message,
                "Closing socket"
        )
        ws.close();
      };
    }
    else{
      //if is not logged in
      console.log("get to connectWS is not logged in",isLoggedIn)
      ws.close();
    }
  }
  connectWS(isLoggedIn);
  },[isLoggedIn] );

  // On start, see if logged in
  // if logged in, display User avator
  //  else login/register button
  if (isLoggedIn){
    return (
      <UserAvatar 
        setLogin={setIsLoggedIn}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
    );
  }
  else
    return (
      /** 
       * TODO Is there a better way to send in handler funcs? 
       * */
      <LoginRegister 
        setLogin={setIsLoggedIn} 
        setUserInfo={setUserInfo}
      />
    );
}
