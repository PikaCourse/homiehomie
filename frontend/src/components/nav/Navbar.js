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
import UserModule from "../user/UserModule";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-0 pb-2 pt-2">
      <div className="container-fluid">
        <a className="navbar-brand mx-4 pl-4" href="#" style={selectedStyle}>
          CourseOcean
        </a>
        <div>
          <ul class="navbar-nav ml-auto pr-4">
            <li class="nav-item">
              <Wishlist />
            </li>
            <li class="nav-item">
              <UserModule />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

const selectedStyle = {
  color: "#596C7E",
  fontWeight: "800",
  fontSize: "1.5rem",
};
export default Navbar;
