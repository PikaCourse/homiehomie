import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import Header from "./layout/Header";
import Footer from "./layout/Footer";

import Dashboard from "./main/Dashboard";
import Calendar from "./main/Calendar";
import Wiki from "./main/Wiki";


import {Provider} from 'react-redux';
import store from '../store';

class App extends Component {
  render() {
    return (
      <Provider store = {store}>
        <Fragment>
          <Header />
          <div className="container-fluid">
            <div class="row">
              <div id="app" class="col-md-7">
                <Calendar />
              </div>
              <div id="app" class="col-md-5">
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
