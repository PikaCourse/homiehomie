/**
 * File name:	Wiki.js
 * Created:	01/18/2021
 * Author:	Marx Wang, Ji Zhang
 * Email:	foo@bar.com
 * Version:	1.0 Initial file
 * Description:	Container for search bar, course info, and note section
 */

import React, { Component, Fragment } from "react";
import WikiNotebook from "./WikiNotebook";
import PropTypes from "prop-types";
import { getCourse } from "../../actions/course";
import { connect } from "react-redux";
import WikiSearch from "./Search";
import WikiSummary from "./Summary";
import Notebook from "./Notebook";
export class Wiki extends Component {
  componentDidMount() {
    // TODO Default should await user for searching
    // TODO Or display the last course user searched for
    this.props.dispatch(getCourse("CAS BI 315"));
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

// TODO This seems useless
const mapStateToProps = (state) => ({
  course: state.course.course,
});

export default connect(mapStateToProps)(Wiki);
