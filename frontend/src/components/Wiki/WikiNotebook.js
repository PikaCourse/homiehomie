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
import { getQuestion, addQuestion } from "../../actions/question.js";

import { Button, Input, Card, Form, Checkbox, message } from "antd";

const { TextArea } = Input;
const querystring = require("querystring");

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
      value: [],
      courseIndex: 0,
      addNewCard: false,
    };
  }

  static propTypes = {
    course: PropTypes.array.isRequired,
  };

  handleSaveClicked(nbObj) {
    let notebookObj = {
        course: this.props.selectedCourse.course_meta.id,
        question: nbObj.question.id,
        title: "whatever",
        content: this.state.value,
        tags: ["hi"],
    }
    store.dispatch(addQuestion(nbObj, notebookObj));
    console.log("now the notebad is:");
    console.log(this.props.noteBag);
    axios
      .post("api/notes", notebookObj)
      .then((result) => {});
  }

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };
  handleSubmit = (values) => {
    console.log(this.props.selectedCourse.course_meta.id);
    axios
      .post(
        "api/questions",
        querystring.stringify({
          course_meta: this.props.selectedCourse.course_meta.id,
          title: values.question,
          tags: JSON.stringify(["hi", "h2"]),
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        axios
          .post("api/notes", {
            course: this.props.selectedCourse.course_meta.id,
            question: res.data.question,
            title: "whatever",
            content: values.note,
            tags: JSON.stringify(["hi"]),
          })
          .then((result) => {
            result.data.code == "success"
              ? message.success({
                  content: "Note Added Successfully",
                  style: {
                    marginTop: "5vh",
                  },
                })
              : message.error({
                  content: "Fail to Add New Note  x_x",
                  style: {
                    marginTop: "5vh",
                  },
                });
            this.forceUpdate();
          });
      });
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
                  onFinish={this.handleSubmit}
                  onFinishFailed={() => console.log("test2")}
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
                  {/* <FontAwesomeIcon className="mx-1" icon={faThumbsUp} /> {noteObj.like_count}
                  <FontAwesomeIcon className="mx-1" icon={faThumbsDown} /> {noteObj.dislike_count} */}
                </p>
              ))}
              <div className="row">
                <div className="col-sm-11 pr-0">
                  <form className="form-inline my-2 my-lg-0">
                    <TextArea
                      onChange={this.onChange}
                      placeholder="Write some amazing notes"
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
