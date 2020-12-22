import React, { Component, Fragment } from "react";
import WikiNotebook from '../Wiki/WikiNotebook'
import WikiSummary from '../Wiki/WikiSummary'
import PropTypes from 'prop-types'
import {getCourse} from '../../actions/course'
import {connect} from 'react-redux'

export class Wiki extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      inputVal: '',
      courseIndex: 0
    }
  }

  static propTypes = {
    course:PropTypes.array.isRequired
  }

  handleInputChangeTwo({ target }) {
    this.setState({inputVal: target.value}); 
  }

  handleSearchClickedTwo() {
    console.log(this.state.inputVal); 
    this.props.getCourse(this.state.inputVal);
  }

  
  render() {
    return (
      <Fragment>

        <form className="form-inline my-2 my-lg-0"/>
          <input className="form-control mr-sm-2" type="search" placeholder="Search subject, CRN or course name" aria-label="Search" style = {{borderRadius: "30px"}} onChange={(e)=>this.handleInputChangeTwo(e)}/>
          <button className="btn btn-outline-primary my-2 my-sm-0" style = {{borderRadius: "30px"}} type="submit" onClick={()=>this.handleSearchClickedTwo()}>Search</button>
        <WikiSummary/>
        <WikiNotebook />
      </Fragment>
    );
  }
}

const mapStateToProps = state =>({
  course: state.course.course
});

export default connect(mapStateToProps, {getCourse})(Wiki);
