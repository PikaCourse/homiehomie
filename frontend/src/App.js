/**
 * File name:	App.js
 * Created: 01/17/2021
 * Author:	Marx Wang
 * Email:	foo@bar.com
 * Version:	1.0 Initial file
 * Description:	Frontend global container
 */

import React, { Fragment, useState } from "react";

import Navbar from "./nav/Navbar";
import Footer from "./nav/Footer";
import Calendar from "./calendar";
import Wiki from "./course";
import Landing from "./landing";
import Chat from "./chat/Chat";
import Forum from "./course/components/Forum"

import { Provider, } from "react-redux";
import store from "./store";
import "../static/scss/button.scss";

export default function App(props) {
  // App class to host sub modules
  // TODO Might need to separate note section from wiki?

  //tab can be "playground" or "classroom"
  //TODO store tab to local storage 
  const [tab, setTab] = useState("classroom");

  return (
    <Provider store={store}>
      <Fragment>
        <Landing />
        <Navbar tab={tab} setTab={setTab} style={{ height: "5vh", }} />
        {tab == "classroom" ?
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
          : <div className="container">
            <div class="row justify-content-md-center">
              <div class="col-md-auto">
                <Forum maxPost={10} height={800} />
              </div>
            </div>
          </div>}
        <Footer style={{ height: "3vh", }} />
      </Fragment>
      {/* <Chat /> */}
    </Provider>
  );
}
