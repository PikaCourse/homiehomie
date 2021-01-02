import React, { Component } from "react";
import PropTypes from "prop-types";
import { getCourse } from "../../actions/course";
import { connect } from "react-redux";
import store from "../../store";
import { getQuestion } from "../../actions/question";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

export class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputVal: "",
      courseIndex: 0,
    };
  }
  handleInputChangeTwo({ target }) {
    this.setState({ inputVal: target.value });
  }

  handleSearchClickedTwo() {
    this.props.dispatch(getCourse(this.state.inputVal));
  }
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-0 pb-2 pt-2">
        <a className="navbar-brand mx-auto" href="#" style={selectedStyle}>
          Scheduler Beta
        </a>
      </nav>
    );
  }
}
const mapStateToProps = (state) => ({
  course: state.course.course,
});

const selectedStyle = {
  textShadow: "0px 4px 10px rgba(89, 108, 126, 0.35)",
  color: "#596C7E",
  fontWeight: "800",
  fontSize: "1.5rem",
};
export default connect(mapStateToProps)(Header);
