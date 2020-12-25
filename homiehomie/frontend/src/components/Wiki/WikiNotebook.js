import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import TextareaAutosize from 'react-textarea-autosize';

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
      animateButton(e) {

        e.preventDefault;
        //reset animation
        e.target.classList.remove('animate');
        
        e.target.classList.add('animate');
        setTimeout(function(){
          e.target.classList.remove('animate');
        },700);
        console.log("animateButton");
    };

    render() {
        return (
            <div className ="p-3" style = {noteBookStyle}>
                <div>
                    <h5 style={{fontFamily: 'Montserrat', color:'#596C7E'}}>Which Professor is better?</h5>
                    <form className="form-inline my-2 my-lg-0"/>
                    <div class="mb-3">
                      <p 
                        className="pl-2" 
                        style={{fontFamily: 'Montserrat', color:'#596C7E'}}>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. (Spring 2019) 
                          <FontAwesomeIcon className="mx-1" icon={faThumbsUp}/> 
                      </p>
                      <p 
                        className="pl-2" 
                        style={{fontFamily: 'Montserrat', color:'#596C7E'}}>
                        Lorem ipsum dolor sit amet. (Spring 2019) 
                        <FontAwesomeIcon className="mx-1" icon={faThumbsUp}/>
                      </p>

                      <div className="row">
                        <div className = "col-sm-11 pr-0">
                            <TextareaAutosize
                              className="w-100 pl-2"
                              minRows={2}
                              maxRows={10}
                              placeholder="Write Your Notes..."
                              onChange={(e)=>this.handleInputChangeTwo(e)}
                              style = {{borderRadius: "5px", borderColor:"white"}}/>
                        </div>
                        <div className = "col-sm-1 pl-0">
                          <button 
                            className="bubbly-button" 
                            style = {{borderRadius: "5px", fontFamily: 'Montserrat'}} 
                            type="save" 
                            onClick={(event)=>{this.handleSaveClicked(); this.animateButton(event)}}>Save
                          </button>
                        </div>
                      </div>
                    
                    </div>
                </div>

                <div>
                    <h5 style={{fontFamily: 'Montserrat', color:'#596C7E'}}>Which Professor is better?</h5>
                    <form className="form-inline my-2 my-lg-0"/>
                    <div class="mb-3">
                      <p 
                        className="pl-2" 
                        style={{fontFamily: 'Montserrat', color:'#596C7E'}}>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. (Spring 2019) 
                          <FontAwesomeIcon className="mx-1" icon={faThumbsUp}/> 
                      </p>
                      <p 
                        className="pl-2" 
                        style={{fontFamily: 'Montserrat', color:'#596C7E'}}>
                        Lorem ipsum dolor sit amet. (Spring 2019) 
                        <FontAwesomeIcon className="mx-1" icon={faThumbsUp}/>
                      </p>

                      <div className="row">
                        <div className = "col-sm-11 pr-0">
                            <TextareaAutosize
                              className="w-100 pl-2"
                              minRows={2}
                              maxRows={10}
                              placeholder="Write Your Notes..."
                              onChange={(e)=>this.handleInputChangeTwo(e)}
                              style = {{borderRadius: "5px", borderColor:"white"}}/>
                        </div>
                        <div className = "col-sm-1 pl-0">
                          <button 
                            className="bubbly-button" 
                            style = {{borderRadius: "5px", fontFamily: 'Montserrat'}} 
                            type="save" 
                            onClick={(event)=>{this.handleSaveClicked(); this.animateButton(event)}}>Save
                          </button>
                        </div>
                      </div>
                    
                    </div>
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
