import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faPen,
  faTimes,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import store from "../../store";
import axios from "axios";
import { getQuestion, addQuestion, addOBJ } from "../../actions/question.js";

import {
  Button,
  Input,
  Card,
  Form,
  Checkbox,
  message,
  resetFields,
  Switch,
  Space,
} from "antd";

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
      editVal: "",
      courseIndex: 0,
      addNewCard: false,
      public: true,
      input: true,
      privateCardEditArray: [],
    };
  }

  handleSaveClicked(nbObj) {
    let notebookObj = {
      course: this.props.selectedCourse.id,
      question: nbObj.question.id,
      title: "whatever",
      content: this.state.value,
      tags: JSON.stringify(["hi"]),
    };
    store.dispatch(addQuestion(nbObj, notebookObj));
    axios
      .post(
        "api/notes",
        querystring.stringify({
          course: this.props.selectedCourse.id,
          question: nbObj.question.id,
          title: "whatever",
          content: this.state.value,
          tags: JSON.stringify(["hi"]),
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((result) => {});
    this.setState({ value: [] });
  }

  handleEdit(noteObj) {
    axios.put(
      "api/notes/" + noteObj.id,
      querystring.stringify({
        course: noteObj.course,
        question: noteObj.question,
        title: noteObj.title,
        content: this.state.editVal,
        tags: JSON.stringify(["hi"]),
        is_private: true,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    this.setState({ editVal: "", input: true });
  }
  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };
  handleSubmit = (values) => {
    //console.log(this.props.selectedCourse.course_meta.id);
    axios
      .post(
        "api/questions",
        querystring.stringify({
          course_meta: this.props.selectedCourse.course_meta.id,
          title: values.question,
          is_pin: !this.state.public,
          tags: JSON.stringify(["hi", "h2"]),
          is_private: !this.state.public,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        axios
          .post(
            "api/notes",
            querystring.stringify({
              course: this.props.selectedCourse.id,
              question: res.data.question,
              title: "whatever",
              content: values.note,
              tags: JSON.stringify(["hi"]),
              is_private: !this.state.public,
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          )
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

            let queObj = {
              id: this.props.noteBag.length,
              question: {
                id: res.data.question,
                course_meta: this.props.selectedCourse.course_meta.id,
                title: values.question,
                is_pin: !this.state.public,
                tags: JSON.stringify(["hi", "h2"]),
                is_private: !this.state.public,
              },
              notes: [
                {
                  course: this.props.selectedCourse.id,
                  id: result.data.note,
                  question: values.question,
                  title: "whatever",
                  content: values.note,
                  tags: JSON.stringify(["hi"]),
                },
              ],
              is_private: !this.state.public,
            };
            store.dispatch(addOBJ(queObj));
            this.forceUpdate();
          });
      });
    this.setState({ addNewCard: false });
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.selectedCourse.id &&
      prevProps.selectedCourse.id !== this.props.selectedCourse.id
    ) {
      store.dispatch(getQuestion(this.props.selectedCourse.course_meta.id));
    }
  }

  render() {
    return (
      <div className="" style={noteBookStyle}>
        <div className="text-center">
          <h1
            className="divider my-3"
            style={{ color: "#419EF4", fontSize: "1.5rem" }}
          >
            WikiNotes
          </h1>
        </div>

        {/* first qu */}

        <div>
          {this.props.loginStatus ? (
            <div onClick={() => this.setState({ addNewCard: true })}>
              <Card
                bordered={false}
                hoverable
                title=""
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
          ) : (
            <Card
              bordered={false}
              hoverable
              title=""
              hoverable={false}
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
                  PLEASE LOGIN TO ADD QUESTIONS OR NOTES
                </span>
              </p>
            </Card>
          )}
          {
            /* New Card */
            this.state.addNewCard ? (
              <Card
                hoverable
                bordered={false}
                title=""
                className="my-2"
                style={{
                  fontFamily: "Montserrat",
                  color: "#596C7E",
                  border: "none",
                }}
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
                        message: "Please input your note!",
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
                    <Checkbox
                      onChange={(e) => {
                        this.setState({ public: e.target.checked });
                      }}
                    >
                      Public
                    </Checkbox>
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
          {this.props.noteBag.map((nbObj, cardIndex) =>
            nbObj.question.is_private ? (
              <Card
                hoverable
                title={nbObj.question.title}
                bordered={false}
                className="my-2"
                style={{ fontFamily: "Montserrat", color: "#596C7E" }}
                extra={((<FontAwesomeIcon icon={faThumbtack} />), "private")}
                key={nbObj.id}
              >
                {this.state.privateCardEditArray.push(true)}
                {nbObj.notes.map((noteObj) => (
                  <>
                    <Space
                      direction="vertical"
                      style={{
                        width: "100%",
                      }}
                    >
                      <Switch
                        checked={this.state.privateCardEditArray[cardIndex]}
                        checkedChildren="Read"
                        unCheckedChildren="Edit"
                        size="medium"
                        onChange={() => {
                          let arr = [...this.state.privateCardEditArray];
                          arr[cardIndex] = !this.state.privateCardEditArray[
                            cardIndex
                          ];
                          this.setState({
                            privateCardEditArray: arr,
                          });
                        }}
                      />
                      <Input.TextArea
                        defaultValue={noteObj.content}
                        disabled={this.state.privateCardEditArray[cardIndex]}
                        onChange={(event) =>
                          this.setState({ editVal: event.target.value })
                        }
                      />
                    </Space>
                    <Button
                      type="link"
                      size="large"
                      onClick={(event) => this.handleEdit(noteObj)}
                    >
                      Save
                    </Button>
                  </>
                ))}
              </Card>
            ) : (
              //if the question and post is public
              <Card
                hoverable={false}
                title={nbObj.question.title}
                bordered={false}
                className="my-2"
                style={{ fontFamily: "Montserrat", color: "#596C7E" }}
                extra={
                  nbObj.question.is_pin ? (
                    <FontAwesomeIcon icon={faThumbtack} />
                  ) : null
                }
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
                {this.props.loginStatus ? (
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
                ) : null}
              </Card>
            )
          )}
        </div>
      </div>
    );
  }
}

const noteBookStyle = {
  boxSizing: "border-box",
  borderRadius: "1.5rem",
};
const mapStateToProps = (state) => ({
  selectedCourse: state.course.selectedCourse,
  noteBag: state.question.noteBag,
  loginStatus: state.user.loginStatus,
});
export default connect(mapStateToProps)(WikiNotebook);
