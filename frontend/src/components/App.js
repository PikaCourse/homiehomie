/**
 * File name:	App.js
 * Created: 01/17/2021
 * Author:	Marx Wang
 * Email:	foo@bar.com
 * Version:	1.0 Initial file
 * Description:	Frontend global container
 */

import React, { Component, Fragment, } from "react";
import ReactDOM from "react-dom";

import Navbar from "./nav/Navbar";
import Footer from "./nav/Footer";
import DnDCalendar from "./calendar/DnDCalendar";
import Wiki from "./course/Wiki";

import { Provider, } from "react-redux";
import store from "../store";
import "../../static/scss/button.scss";
import { Auth0Provider, } from "@auth0/auth0-react";

class App extends Component {
  // App class to host sub modules
  // TODO Might need to separate note section from wiki?
  render() {
    return (
      <Provider store={store}>
        <Fragment>
          <Navbar style={{ height: "5vh", }} />
          <div className="container-fluid">
            <div className="row" style={{ height: "92vh", }}>
              <div className="col-md-6">
                <DnDCalendar />
              </div>
              <div className="col-md-6">
                <Wiki />
              </div>
            </div>
          </div>
          <Footer style={{ height: "3vh", }} />
        </Fragment>
      </Provider>
    );
  }
}

// TODO Remove Auth0
ReactDOM.render(
  <Auth0Provider
    domain="homiehomie.us.auth0.com"
    clientId="bXnc6pC5Lvfl8Xvn9Aqj88YwYgclggZ8"
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("app",),
);
