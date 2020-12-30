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

  static propTypes = {
    course: PropTypes.array.isRequired,
  };

  handleInputChangeTwo({ target }) {
    this.setState({ inputVal: target.value });
  }

  handleSearchClickedTwo() {
    //getcourse: store course_info -> can find course_meta_id
    //getQuestion: store question_array of question_objects -> can find question_id
    //getNotes: store a notes_array depends on a question id array
    this.props.dispatch(getCourse(this.state.inputVal));
    this.props.dispatch(getQuestion(store.getState().course.selectedCourse.course_meta.id)
    );
  }
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-0 pb-4 pt-4">
        <a className="navbar-brand mx-auto" href="#" style={selectedStyle}>
          Scheduler Beta
        </a>
        {/*<form className="form-inline my-2 my-lg-0 w-75" />
        <input
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search subject, CRN or course name"
          aria-label="Search"
          style={{ borderRadius: "30px" }}
          onChange={(e) => this.handleInputChangeTwo(e)}
        />
        <button
          className="btn btn-outline-primary my-2 my-sm-0"
          style={{ borderRadius: "30px" }}
          type="submit"
          onClick={() => this.handleSearchClickedTwo()}
        >
          Search
        </button>
    */}
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
