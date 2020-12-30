import React, { Component, Fragment } from "react";
import WikiNotebook from "../Wiki/WikiNotebook";
import WikiSummary from "../Wiki/WikiSummary";
import PropTypes from "prop-types";
import { getCourse } from "../../actions/course";
import { connect } from "react-redux";

export class Wiki extends Component {
  componentDidMount() {
    this.props.dispatch(getCourse("CS-3114"));
  }

  render() {
    return (
      <Fragment>
        <div style={{ overflowY: "auto", height: "80vh" }}>
          <WikiSummary />
          <WikiNotebook />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  course: state.course.course,
});

export default connect(mapStateToProps)(Wiki);
