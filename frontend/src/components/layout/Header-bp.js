import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { useAuth0 } from "@auth0/auth0-react";

function Header() {
  const {
    loginWithRedirect,
    user,
    isAuthenticated,
    isLoading,
    logout,
  } = useAuth0();
  const loginButton = isLoading ? (
    <div>Loading ...</div>
  ) : isAuthenticated ? (
    <Button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </Button>
  ) : (
    <Button onClick={() => loginWithRedirect()}>Log In</Button>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-0 pb-2 pt-2">
      <div className="container-fluid">
        <a className="navbar-brand mx-4" href="#" style={selectedStyle}>
          Scheduler Beta
        </a>
        {isAuthenticated ? <span>Hi, {user.name}</span> : null}
        {loginButton}
      </div>
    </nav>
  );
}

const selectedStyle = {
  // textShadow: "0px 4px 10px rgba(89, 108, 126, 0.35)",
  color: "#596C7E",
  fontWeight: "800",
  fontSize: "1.5rem",
};
export default Header;
