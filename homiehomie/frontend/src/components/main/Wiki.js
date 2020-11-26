import React, { Component, Fragment } from "react";
import WikiNotebook from '../Wiki/WikiNotebook'
import WikiSummary from '../Wiki/WikiSummary'

export class Wiki extends Component {
  render() {
    return (
      <Fragment>
        <WikiSummary />
        <WikiNotebook />
      </Fragment>
    );
  }
}

export default Wiki;
