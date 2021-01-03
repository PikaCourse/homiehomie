import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Dnd from "./Calendar/dnd";
import Wiki from "./main/Wiki";
import Wishlist from "./main/Wishlist";

import { Provider } from "react-redux";
import store from "../store";
import "../../static/scss/button.scss";
import { Auth0Provider } from "@auth0/auth0-react";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Fragment>
          <Header />
          <div className="container-fluid">
            <div className="row">
              <Wishlist />
            </div>
            <div className="row">
              <div id="app" className="col-md-6">
                <Dnd />
              </div>
              <div id="app" className="col-md-6">
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

ReactDOM.render(
  <Auth0Provider
    domain="homiehomie.us.auth0.com"
    clientId="bXnc6pC5Lvfl8Xvn9Aqj88YwYgclggZ8"
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("app")
);
