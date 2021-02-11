/**
 * File name:	UserAvatar.js
 * Created:	02/11/2021
 * Author:	Weili An
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	User avatar icon
 */

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Dropdown, Avatar, Menu } from "antd";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faKey, 
  faEnvelope,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

/**
 * User avatar top level component
 * Handle user name, image display as well as
 * Display user dropdown actions defined in the
 * component `UserDropDownMenu`
 * @param {*} props 
 */
export default function UserAvatar(props) {
  // Set overall login status
  const setLogin = props.setLogin;
  const userInfo = props.userInfo;

  const userMenu = <UserDropDownMenu userInfo={userInfo} setLogin={setLogin}/>;

  return (
    <Dropdown 
      overlay={userMenu}
      overlayStyle={{"box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}
      trigger={["hover", "click"]}
    >
      <Avatar
        size="large"
        // TODO Change to field in user info prop
        src="https://randomuser.me/api/portraits/lego/6.jpg"
      />
    </Dropdown>
  );
}

/**
 * User drop down menu, in charge of
 * dispatch action related to user like
 * change password and change profile
 * @param {*} props 
 */
function UserDropDownMenu(props) {
  const setLogin = props.setLogin;
  const userInfo = props.userInfo;

  // Modal control for user profile
  const [ isUserModalVisible, setIsUserModalVisible ] = useState(false);

  /**
   * Handler functions for user menu actions
   */
  function onClickProfile() {
    // OnClick, display user profile modal to view and change profile
    setIsUserModalVisible(true);
  }

  function onClickChangePass(e) {
    // TODO Fire change password modal
  }

  function onClickResendEmailVerif() {
    // Fire API to resend email verification
    // upon success/error, notify user
    axios.get("api/users/verify_email")
      .then(() => {
        message.success("🥳 Please check your mailbox for verification link!");
      })
      .catch((error) => {
        if (error.response.status == 403)
          message.error("Hmm... we could not send email to user not logged in");
        else
          message.error("Unknown error, please try again later");
      });
  }

  function onClickSignOut() {
    // Fire API to sign out user and set login status
    // upon success/error, notify user
    axios.get("api/users/logout")
      .then(() => {
        setLogin(false);
        message.success("🥳 Successfully signed out!");
      })
      .catch(() => {
        message.error("Failed to sign out, please try again later");
      });
  }

  /**
   * Combined menu handler router
   */
  function onClikMenuItem(e) {
    console.log(e);
    switch (e.key) {
      case "profile":
        onClickProfile(e);
        break;
      case "change_password":
        onClickChangePass(e);
        break;
      case "resend_email_verification":
        onClickResendEmailVerif();
        break;
      case "sign_out":
        onClickSignOut();
        break;
      default:
        break;
    }
  }

  return (
    <>
      <Menu
        onClick={onClikMenuItem}  
      >
        <Menu.Item key="profile" icon={<FontAwesomeIcon icon={faUser} />}>Personal Profile</Menu.Item>
        <Menu.Item key="change_password" icon={<FontAwesomeIcon icon={faKey} />}>Change Password</Menu.Item>
        {
          // TODO This need to be conditional
        }
        <Menu.Item key="resend_email_verification" icon={<FontAwesomeIcon icon={faEnvelope} />}>Resend email verification</Menu.Item>
        <Menu.Item key="sign_out" icon={<FontAwesomeIcon icon={faSignOutAlt} />}>Sign out</Menu.Item>
      </Menu>

      {
        // Hidden Modal
        // TODO Need a way to set new user info after updating? Or use ws on top level?
      }
      <UserProfileModal isVisible={isUserModalVisible}/>;
    </>
  );
}

/**
 * Modal to view and change user profile
 * @param {*} props 
 */
function UserProfileModal(props) {
  const isVisible = props.isVisible;
  // TODO Render a form with user info and allow to edit and update
  return (
    <Modal title="Basic Modal" visible={isVisible} onOk={()=>{}} onCancel={()=>{}}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  )
}