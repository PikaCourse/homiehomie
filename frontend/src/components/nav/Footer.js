/**
 * File name:	Footer.js
 * Created:	01/17/2021
 * Author:	Marx Wang
 * Email:	foo@bar.com
 * Version:	1.0 Initial file 
 * Description:	Footer container for copyright disclaimer
 */

import React, { Component } from "react";

export class Footer extends Component {
  render() {
    return (
      <footer style={footer}>
        <div className="container d-flex justify-content-center">
          <span class="text-muted" style={footerStyle}>
            Copyright © All rights reserved
          </span>
        </div>
      </footer>
    );
  }
}

const footer = {
  position: "absolute",
  bottom: "0",
  width: "100%",
  height: "40px" /* Set the fixed height of the footer here */,
  lineHeight: "40px" /* Vertically center the text there */,
  backgroundColor: "#ffffff",
};
const footerStyle = {
  textAlign: "center",
  fontSize: "1rem",
  fontWeight: 700,
  color: "#A19E9E",
};
export default Footer;
