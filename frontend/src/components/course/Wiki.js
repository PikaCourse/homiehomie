import React, { Component, Fragment } from "react";
import WikiNotebook from "./WikiNotebook";
import PropTypes from "prop-types";
import { getCourse } from "../../actions/course";
import { connect } from "react-redux";
import WikiSearch from "./Search";
import WikiSummary from "./Summary";
export class Wiki extends Component {
  componentDidMount() {
    this.props.dispatch(getCourse("CAS CS 103"));
  }

  render() {
    return (
      <Fragment>
        <div className="px-1 mt-4" style={WikiStyle}>
          <WikiSearch />
          <WikiSummary />
          <WikiNotebook />
        </div>
      </Fragment>
    );
  }
}

const WikiStyle = {
  overflowY: "auto",
  height: "82vh",
  borderBottomRightRadius: "20px",
  borderBottomLeftRadius: "20px",
};
const mapStateToProps = (state) => ({
  course: state.course.course,
});

export default connect(mapStateToProps)(Wiki);
