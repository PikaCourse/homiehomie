import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import store from "../../store";
import axios from "axios";
import { getQuestion } from "../../actions/question.js";

import { Button, Input } from "antd";

const { TextArea } = Input;

import "antd/lib/style/themes/default.less";
import "antd/dist/antd.less";
import "../../main.less";

export class WikiNotebook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      courseIndex: 0,
    };
  }

  static propTypes = {
    course: PropTypes.array.isRequired,
  };

  handleSaveClicked(nbObj) {
    const form = new FormData();
    form.append("course", nbObj.question.course_meta);
    form.append("question", nbObj.question.id); //store.getState().notes.questionIDarray[i])
    form.append("title", "whatever");
    form.append("content", this.state.value);
    form.append("tags", []);
    //console.log(this.state.value);
    axios.post("api/notes", form).then((result)=>alert(result));
    //this.props.dispatch(getNotes(this.state.inputVal));
  }

  onChange = ({ target: { value } }) => {
    this.setState({ value });
    console.log({ value });
  };

  componentDidMount() {
    console.log(store.getState().course.selectedCourseArray);
    store.dispatch(
      getQuestion(
        store
          .getState()
          .course.selectedCourseArray.find(
            ({ crn }) => crn === store.getState().course.selectedCRN
          ).course_meta.id
      )
    );
    //store.dispatch(getNotes(store.getState().question.question));
  }
  render() {
    const { value } = this.state;
    return (
      <div className="p-3" style={noteBookStyle}>
        {/* Question */}
        {store.getState().question.noteBag.map((nbObj) => (
          <div>
            {console.log(store.getState().question.noteBag)}
            <h5 style={{ fontFamily: "Montserrat", color: "#596C7E" }}>{nbObj.question.title}</h5>
            <form className="form-inline my-2 my-lg-0" />
            <div class="mb-3">
              {nbObj.note.map((noteObj) => (
                <p
                  className="pl-2"
                  style={{ fontFamily: "Montserrat", color: "#596C7E" }}
                >
                  {noteObj.content}
                  <FontAwesomeIcon className="mx-1" icon={faThumbsUp} /> 15
                  <FontAwesomeIcon className="mx-1" icon={faThumbsDown} /> 1
                </p>
              ))}
              {/* writing part */}
              <div className="row">
                
                <div className="col-sm-11 pr-0">
                  <TextArea
                    value={value}
                    onChange={this.onChange}
                    placeholder="Controlled autosize"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    style={{ borderRadius: "5px", borderColor: "white" }}
                  />
                </div>
                <div className="col-sm-1 pl-0">
                  <Button
                    size="medium"
                    type="primary"
                    onClick={(event) => {
                      this.handleSaveClicked(nbObj);
                      this.animateButton(event);
                    }}
                  >
                    save
                  </Button>
                </div>
               
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
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
