import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

export class WikiNotebook extends Component {

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
    
      handleSaveClicked() {
        console.log(this.state.inputVal); 
        //this.props.dispatch(getNotes(this.state.inputVal));
      }

    render() {
        return (
            <div className ="p-3" style = {noteBookStyle}>
                <div>
                    <h2>Which Professor is better?</h2>
                    <form className="form-inline my-2 my-lg-0"/>
                    <div class="mb-3">
  <textarea class="form-control w-100" id="exampleFormControlTextarea1" rows="3" onChange={(e)=>this.handleInputChangeTwo(e)}></textarea>
          <button className="btn btn-outline-primary my-0 py-1 px-1 my-sm-0" style = {{borderRadius: "5px"}} type="save" onClick={()=>this.handleSaveClicked()}>Save</button></div>
                    <p className="pl-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. (Spring 2019) </p>
                </div>
                <div>
                    <h2>Workload?</h2>
                    <p className="pl-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. (Spring 2019) </p>
                </div>
                <div>
                    <h2>Harsh Grader?</h2>
                    <p className="pl-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. (Spring 2019) </p>
                </div>
            </div>
        )
    }
}
const noteBookStyle = {
    background: '#FFFFFF',
    border: '5px solid rgba(65, 158, 244, 0.27)',
    boxSizing: 'border-box',
    borderRadius: '2rem'
}
const mapStateToProps = state =>({
    course: state.course.course
  });

  export default connect(mapStateToProps)(WikiNotebook);
