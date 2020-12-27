import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import Header from "./layout/Header";
import Footer from "./layout/Footer";

import Dashboard from "./main/Dashboard";
import Calendar from "./main/Scheduler";
import Leads from "./main/Leads";

import Wiki from "./main/Wiki";
import Wishlist from "./main/Wishlist";


import {Provider} from 'react-redux';
import store from '../store';
import '../../static/scss/button.scss'

class App extends Component {
  render() {
    return (
      <Provider store = {store}>
        <Fragment>
          <Header />
          <div className="container-fluid">
            <div className="row">
              <div id="app" className="col-sm-1">
              </div>
              <div id="app" className="col-sm-10">
                <Wishlist />
              </div>
              <div id="app" className="col-sm-1">
              </div>
            </div>
            <div className="row">
              <div id="app" className="col-md-6 m-3">
                <Calendar />
              </div>
              <div id="app" className="col-md-5">
                <Wiki />
              </div>
            </div>
          </div>
          <Footer />
        </Fragment>
      </Provider>

    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
