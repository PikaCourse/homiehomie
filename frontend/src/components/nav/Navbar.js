/**
 * File name:	Navbar.js
 * Created:	01/17/2021
 * Author:	Marx Wang, Joanna Fang, Ji Zhang
 * Email:	foo@bar.com
 * Version:	1.0 Initial file 
 * Description:	Navigation container for wishlist and user module
 */

import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Input, Checkbox, Radio } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Layout, Menu } from "antd";
import Wishlist from "../../wishlist";
const { Header } = Layout;
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import UserModule from "../user/UserModule";

// TODO Mobile optimization
function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-0 pb-2 pt-2">
      <div className="container-fluid">
        <a className="navbar-brand mx-4 pl-4" href="#" style={selectedStyle}>
          PikaCourse
        </a>
        <div>
          <ul className="navbar-nav ml-auto pr-4">
            <li className="nav-item">
              <Wishlist />
            </li>
            <li className="nav-item">
              <UserModule />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

// TODO Could be customized for different school theme color?
const selectedStyle = {
  color: "#596C7E",
  fontWeight: "800",
  fontSize: "1.5rem",
};
export default Navbar;
