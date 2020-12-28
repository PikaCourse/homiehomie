import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import store from '../../store'


import TextareaAutosize from "react-textarea-autosize";

import { Button, Input } from "antd";

const { TextArea } = Input;

import "antd/lib/style/themes/default.less";
import "antd/dist/antd.less";
import "../../main.less";

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
    }

    onChange = ({ target: { value } }) => {
      this.setState({ value });
    }

    render() {
        return (
            <div className ="p-3" style = {noteBookStyle}>
                    {/* Question */}
                    {store.getState().notes.questionIDarray.map((question, index) => (
                      <div>
                    <h5 style={{fontFamily: 'Montserrat', color:'#596C7E'}}>{question}</h5>
                    <form className="form-inline my-2 my-lg-0"/>
                    <div class="mb-3">
                    {store.getState().notes.notes[index].map((content) => (
                      <p
                        className="pl-2"
                        style={{fontFamily: 'Montserrat', color:'#596C7E'}}>
                          {content}
                          <FontAwesomeIcon className="mx-1" icon={faThumbsUp}/> 15
                          <FontAwesomeIcon className="mx-1" icon={faThumbsDown}/> 1
                      </p>
                    ))}
                      {/* writing part */}
                      <div className="row">
                        <div className = "col-sm-11 pr-0">
                        <TextArea
                          onChange={this.onChange}
                          placeholder="Controlled autosize"
                          autoSize={{ minRows: 3, maxRows: 5 }}
                          style = {{borderRadius: "5px", borderColor:"white"}}
                        />
                        </div>
                        <div className = "col-sm-1 pl-0">
                        <Button size="medium" type="primary" onClick={(event)=>{this.handleSaveClicked(); this.animateButton(event)}}>save</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
          </div>
        )
    };
}

const noteBookStyle = {
  background: "#FFFFFF",
  border: "5px solid rgba(65, 158, 244, 0.27)",
  boxSizing: "border-box",
  borderRadius: "2rem",
};
const mapStateToProps = (state) => ({
  course: state.course.course,
});
export default connect(mapStateToProps)(WikiNotebook);
