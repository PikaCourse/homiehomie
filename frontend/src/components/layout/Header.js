import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { useAuth0 } from "@auth0/auth0-react";

function Header() {



  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-0 pb-2 pt-2">
      <div className="container-fluid">
        <a className="navbar-brand mx-4" href="#" style={selectedStyle}>
          Scheduler Beta
        </a>
        <Button>Log In</Button>
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
