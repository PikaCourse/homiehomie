import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faPen,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import store from "../../store";
import axios from "axios";
import { getQuestion } from "../../actions/question.js";

import { Button, Input, Card, Form, Checkbox } from "antd";

const { TextArea } = Input;

import "antd/lib/style/themes/default.less";
import "antd/dist/antd.less";
import "../../main.less";

const formItemLayout = {
  wrapperCol: {
    span: 20,
    offset: 2,
  },
};

export class WikiNotebook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: [{ question: "" }, { note: "" }],
      courseIndex: 0,
      addNewCard: false,
    };
  }

  static propTypes = {
    course: PropTypes.array.isRequired,
  };

  handleSaveClicked(nbObj) {
    axios
      .post("api/notes", {
        course: nbObj.question.course_meta,
        question: nbObj.question.id,
        title: "whatever",
        content: this.state.value,
        tags: ["hi"],
      })
      .then((result) => alert(result));
    //this.props.dispatch(getNotes(this.state.inputVal));
  }

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  addNewQueInput = () => {
    //new question, note and a post bottom
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.selectedCourse.crn &&
      prevProps.selectedCourse.crn !== this.props.selectedCourse.crn
    ) {
      store.dispatch(getQuestion(this.props.selectedCourse.course_meta.id));
    }
  }

  render() {
    const { value } = this.state;
    return (
      <div className="p-3" style={noteBookStyle}>
        <h1
          className="mr-2 align-middle"
          style={{ color: "#419EF4", display: "inline" }}
        >
          NoteBook
        </h1>

        <div>
          <div onClick={() => this.setState({ addNewCard: true })}>
            <Card
              hoverable
              title=""
              bordered={true}
              className="my-2"
              style={{ fontFamily: "Montserrat", color: "#596C7E" }}
            >
              <p
                className="text-center"
                style={{ fontFamily: "Montserrat", color: "#596C7E" }}
              >
                <span
                  style={{ borderBottom: "4px solid rgba(65, 158, 244, 1)" }}
                >
                  <FontAwesomeIcon icon={faPen} />
                  ADD NOTE
                </span>
              </p>
            </Card>
          </div>
          {
            /* New Card */
            this.state.addNewCard ? (
              <Card
                hoverable
                title=""
                bordered={true}
                className="my-2"
                style={{ fontFamily: "Montserrat", color: "#596C7E" }}
              >
                <Button
                  type="ghost"
                  size="medium"
                  onClick={() => {
                    this.setState({ addNewCard: false });
                  }}
                  style={{ float: "right", display: "block" }}
                >
                  <FontAwesomeIcon className="" icon={faTimes} />
                </Button>

                <Form
                  {...formItemLayout}
                  layout="vertical"
                  name="basic"
                  initialValues={{ remember: true }}
                >
                  <Form.Item
                    name="question"
                    rules={[
                      {
                        required: true,
                        message: "Please input your title!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      placeholder="an amazing title"
                      autoSize={{ minRows: 1, maxRows: 3 }}
                      style={{ borderRadius: "5px", borderColor: "white" }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="note"
                    rules={[
                      {
                        required: true,
                        message: "Please input your title!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      placeholder="write a note"
                      autoSize={{ minRows: 3, maxRows: 5 }}
                      style={{ borderRadius: "5px", borderColor: "white" }}
                    />
                  </Form.Item>

                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>Public</Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </Form>
                {/* 
                <form className="form-inline my-2 my-lg-0">
                  <TextArea
                    className="mb-2"
                    allowClear
                    onChange={this.onChange}
                    placeholder="write a title"
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    style={{ borderRadius: "5px", borderColor: "white" }}
                  />
                  <TextArea
                    allowClear
                    onChange={this.onChange}
                    placeholder="write some notes"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    style={{ borderRadius: "5px", borderColor: "white" }}
                  />
              </form> */}
              </Card>
            ) : null
          }

          {/* Question */}
          {this.props.noteBag.map((nbObj) => (
            <Card
              hoverable
              title={nbObj.question.title}
              bordered={true}
              className="my-2"
              style={{ fontFamily: "Montserrat", color: "#596C7E" }}
              key={nbObj.id}
            >
              {nbObj.notes.map((noteObj) => (
                <p
                  className="pl-2"
                  style={{ fontFamily: "Montserrat", color: "#596C7E" }}
                  key={noteObj.id}
                >
                  {noteObj.content}
                  <FontAwesomeIcon className="mx-1" icon={faThumbsUp} /> 15
                  <FontAwesomeIcon className="mx-1" icon={faThumbsDown} /> 1
                </p>
              ))}
              <div className="row">
                <div className="col-sm-11 pr-0">
                  <form className="form-inline my-2 my-lg-0">
                    <TextArea
                      onChange={this.onChange}
                      placeholder="Controlled autosize"
                      autoSize={{ minRows: 3, maxRows: 5 }}
                      style={{ borderRadius: "5px", borderColor: "white" }}
                    />
                  </form>
                </div>
                <div className="col-sm-1 pl-0">
                  <Button
                    size="medium"
                    type="primary"
                    onClick={(event) => {
                      this.handleSaveClicked(nbObj);
                    }}
                  >
                    save
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
}

const noteBookStyle = {
  background: "#FFFFFF",
  // border: "5px solid rgba(65, 158, 244, 0.27)",
  boxSizing: "border-box",
  borderRadius: "2rem",
};
const mapStateToProps = (state) => ({
  selectedCourse: state.course.selectedCourse,
  noteBag: state.question.noteBag,
});
export default connect(mapStateToProps)(WikiNotebook);
