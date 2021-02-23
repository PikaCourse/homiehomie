/**
 * File name:	App.js
 * Created: 01/17/2021
 * Author:	Marx Wang
 * Email:	foo@bar.com
 * Version:	1.0 Initial file
 * Description:	Frontend global container
 */

import React, { Fragment, } from "react";

import Navbar from "./nav/Navbar";
import Footer from "./nav/Footer";
import Calendar from "./calendar";
import Wiki from "./course";
import Landing from "./landing";

import { Provider, } from "react-redux";
import store from "./store";
import "../static/scss/button.scss";

export default function App(props) {
  // App class to host sub modules
  // TODO Might need to separate note section from wiki?
  return (
    <Provider store={store}>
      <Fragment>
        <Landing />
        <Navbar style={{ height: "5vh", }} />
        <div className="container-fluid">
          <div className="row" style={{ height: "92vh", }}>
            <div className="col-md-6">
              <Calendar />
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
