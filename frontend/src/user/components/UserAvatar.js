/**
 * File name:	UserAvatar.js
 * Created:	02/11/2021
 * Author:	Weili An
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	User avatar icon
 */

import React, { useState, useEffect } from "react";
import { Modal, Select, Button, Form, Input, message, Dropdown, Avatar, Menu, Space } from "antd";
const { Option } = Select;
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faKey, 
  faEnvelope,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

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

  // Drop down menu visible change
  const [ isMenuVisible, setIsMenuVisible ] = useState(false);

  const userMenu = <UserDropDownMenu userInfo={userInfo} setLogin={setLogin} setVisible={setIsMenuVisible}/>;

  return (
    <Dropdown 
      overlay={userMenu}
      overlayStyle={{"box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}
      trigger={["hover", "click"]}
      getPopupContainer={(node) => node.parentNode}
      visible={isMenuVisible}
      onVisibleChange={(flag) => setIsMenuVisible(flag)}
    >
      <Avatar
        size="large"
        // TODO Change to field in user info prop
        src={userInfo.avatarUrl}
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

  // Menu visible control
  const setVisible = props.setVisible;

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
    // TODO Set waiting icon first

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
      case "hello":
        message.info("Hello again!");
        break;
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
    setVisible(false);
  }

  return (
    <>
      <Menu
        onClick={onClikMenuItem}
        selectable={false}
        onBlur
      >
        <Menu.Item key="hello">Hello {userInfo.username}!</Menu.Item>
        <Menu.Item key="profile" icon={<FontAwesomeIcon icon={faUser} />}>Personal Profile</Menu.Item>
        <Menu.Item key="change_password" icon={<FontAwesomeIcon icon={faKey} />}>Change Password</Menu.Item>
        {
          // Conditionally display this action
          userInfo.is_verified ? null : 
            <Menu.Item 
              key="resend_email_verification" icon={<FontAwesomeIcon icon={faEnvelope} />}
            >
              Resend email verification
            </Menu.Item>
        }
        <Menu.Item key="sign_out" icon={<FontAwesomeIcon icon={faSignOutAlt} />}>Sign out</Menu.Item>
      </Menu>

      {
        // Hidden Modal
        // TODO Need a way to set new user info after updating? Or use ws on top level?
      }
      <UserProfileModal isVisible={isUserModalVisible} setVisible={setIsUserModalVisible} userInfo={userInfo}/>
    </>
  );
}

/**
 * Modal to view and change user profile
 * @param {*} props 
 */
function UserProfileModal(props) {
  const isVisible = props.isVisible;
  const setVisible = props.setVisible;
  const userInfo = props.userInfo;

  // TODO Render a form with user info and allow to edit and update
  // TODO Need to reload updated info
  return (
    <Modal 
      title={`${userInfo.username}'s profile`} 
      visible={isVisible} 
      onOk={()=>{setVisible(false);}} 
      onCancel={()=>{setVisible(false);}}
      footer={null}
    >
      <UserProfileForm userInfo={userInfo}/>
    </Modal>
  );
}

/**
 * Form to display and update user profile
 * @param {*} props 
 */
function UserProfileForm(props) {
  const userInfo = props.userInfo;

  // Get form instance
  const [form] = Form.useForm();

  // TODO Need an API to gather school list

  // TODO Display backend validation message under each input?
  // TODO  Refer to https://ant.design/components/form-cn/#components-form-demo-without-form-create
  // TODO  and https://ant.design/components/form-cn/#Rule

  // TODO Avatar image upload and submit form!
  return (
    <Form
      name="user_profile"
      initialValues={userInfo}
      form={form}
    >
      <Form.Item
        label="Username"
        name="username"
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
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Please input a valid email!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="School"
        name="school"
        rules={[
          {
            required: true,
            message: "Please enter your school name from dropdown!",
          },
        ]}
      >
        <Select
          allowClear
          filterOption={ (input, option) => option.value.toLowerCase().startsWith(input.toLowerCase()) }
        >
          {
            // TODO Add little icon to it?
            // TODO  also change theme based on school?
            // TODO This need to be generated automatically on render
          }
          <Option value="Boston University">Boston University</Option>
          <Option value="Virginia Tech">Virginia Tech</Option>
          <Option value="Purdue University">Purdue University</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Student type"
        name="type"
        rules={[
          {
            required: true,
            message: "Please enter your educational classification from dropdown!",
          },
        ]}
      >
        <Select
          allowClear
          filterOption={ (input, option) => option.value.toLowerCase().startsWith(input.toLowerCase()) }
        >
          <Option value="FR">Freshman</Option>
          <Option value="SO">Sophomore</Option>
          <Option value="JR">Junior</Option>
          <Option value="SR">Senior</Option>
          <Option value="GR">Graduate</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}