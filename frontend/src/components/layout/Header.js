import React, { Component, useState, useEffect} from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Input, Checkbox, Radio} from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { UserOutlined, LockOutlined } from '@ant-design/icons';


function Header() {

  const [loading, setLoading] = useState(false); 
  const [visible, setVisible] = useState(false); 
  const [login, setLogin] = useState(true); 

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
  const loginFooter = [
    // <Button key="back" onClick={handleCancel}>
    //   Return
    // </Button>,
    // <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
    //   Submit
    // </Button>,
    <div> <Button type="primary" htmlType="submit" className="login-form-button" key="submit" loading={loading} onClick={handleOk}>
    Log in
    </Button> or <a href="#" onClick={(e) => {e.preventDefault();setLogin(false);}}>register now!</a></div>, 
  ]; 
  const signupFooter = [
    // <Button key="back" onClick={handleCancel}>
    //   Return
    // </Button>,
    // <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
    //   Submit
    // </Button>,
    <div> <Button type="primary" htmlType="submit" className="login-form-button" key="submit" loading={loading} onClick={handleOk}>
    Sign Up
    </Button> Already have an account? <a href="#" onClick={(e) => {e.preventDefault();setLogin(true);}}>login in</a> here</div>, 
  ]; 
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

  function showModal() {
    setVisible(true); 
  };

  function handleOk() {
    setLoading(true); 
    setTimeout(() => {
      setVisible(false); 
      setLoading(false); 
     }, 1000);
  };

  function handleCancel() {
    setVisible(false); 
  };

  function onFinish(values) {
    console.log('Received values of form: ', values);
  }

  function onFormTypeChange(e) {
    setLogin(e.target.value == 'login'); 
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-0 pb-2 pt-2">
    <div className="container-fluid">
      <a className="navbar-brand mx-4" href="#" style={selectedStyle}>
        Scheduler Beta
      </a>
      <Button type="primary" onClick={showModal}>
        Login
      </Button>
      <Modal
        visible={visible}
        title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={login? loginFooter : signupFooter}
      >
        <p>Some contents...</p>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
        <Form.Item label="">
            <Radio.Group onChange={onFormTypeChange} value={login?"login":"signup"}>
              <Radio.Button value="login">Login</Radio.Button>
              <Radio.Button value="signup">Sign Up</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {login?loginForm:signupForm}

        {/* <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" key="submit" loading={loading} onClick={handleOk}>
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item> */}
      </Form>
      </Modal>
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
