/**
 * File name:	Wiki.js
 * Created:	01/18/2021
 * Author:	Marx Wang, Ji Zhang
 * Email:	foo@bar.com
 * Version:	1.0 Initial file
 * Description:	Container for search bar, course info, and note section
 */

import React, { useEffect, Fragment, } from "react";
import WikiNotebook from "./WikiNotebook";
import { getCourses } from "../action";
import { connect, } from "react-redux";

import WikiSearch from "./Search";
import WikiSummary from "./Summary";
import Forum from "./Forum"

function Wiki(props) {
  // TODO Initial course should the last one user accessed
  useEffect( () => {
    // TODO Default should await user for searching
    // TODO Or display the last course user searched for
    props.dispatch(getCourses({
      title: "CAS BI 315"
    }));
  });

  return (
    <Fragment>
      <div className="px-1 mt-4" style={WikiStyle}>
        <WikiSearch />
        <WikiSummary />
        <Forum />
      </div>
    </Fragment>
  );
}

const WikiStyle = {
  overflowY: "auto",
  height: "82vh",
  borderBottomRightRadius: "20px",
  borderBottomLeftRadius: "20px",
};


export default connect(null, null)(Wiki);
