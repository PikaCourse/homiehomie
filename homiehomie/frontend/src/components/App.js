import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

import Dashboard from "./main/Dashboard";

class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <div className="container">
          <Dashboard />
        </div>
        <Footer />
      </Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
