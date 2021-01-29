import React, { Component, Fragment, useState, useCallback } from "react";
import "antd/lib/style/themes/default.less";
import "antd/dist/antd.less";
import "../main.less";
import { Color } from "../helper/global";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faPen,
  faTimes,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import store from "../store";
import axios from "axios";
import { getQuestion, addQuestion, addOBJ } from "../actions/question.js";

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

function Notebook() {
  const loginStatus = useSelector((state) => state.user.loginStatus);
  const [addNt, setAddNt] = useState(false);
  const selectedCourse = useSelector((state) => state.course.selectedCourse);

  return (
    <div>
      <h1 className="divider my-3" style={{ color: Color, fontSize: "1.5rem" }}>
        WikiNoteBook
      </h1>
      {newNoteLoader(loginStatus, setAddNt)}
      {newNoteForm(addNt, selectedCourse, setAddNt, handleSubmit)}
    </div>
  );
}

function newNoteLoader(loginStatus, setAddNt) {
  return (
    <Card
      bordered={false}
      hoverable
      title=""
      className="my-2"
      onClick={() => setAddNt(true)}
    >
      <p
        className="text-center"
        style={{ fontFamily: "Montserrat", color: "#596C7E" }}
      >
        <span style={{ borderBottom: "4px solid rgba(65, 158, 244, 1)" }}>
          <FontAwesomeIcon icon={faPen} />
          {loginStatus ? "ADD NOTE" : "PLEASE LOGIN TO ADD QUESTIONS OR NOTES"}
        </span>
      </p>
    </Card>
  );
}

function handleSubmit(values, selectedCourse, setIsLoading) {
  setIsLoading(true);
  //   const dispatch = useDispatch();

  axios
    .post(
      "api/questions",
      querystring.stringify({
        course_meta: selectedCourse.course_meta.id,
        title: values.question,
        is_pin: !values.isPublic,
        tags: JSON.stringify(["hi", "h2"]),
        is_private: !values.isPublic,
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
            course: selectedCourse.id,
            question: res.data.question,
            title: "default title",
            content: values.note,
            tags: JSON.stringify(["hi"]),
            is_private: !values.isPublic,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((result) => {
          setIsLoading(false);
          result.data.code == "success"
            ? message.success("Note Added Successfully")
            : message.error("Fail to Add New Note  x_x");
          //   dispatch(
          //     addOBJ({
          //       id: this.props.noteBag.length,
          //       question: {
          //         id: res.data.question,
          //         course_meta: this.props.selectedCourse.course_meta.id,
          //         title: values.question,
          //         is_pin: !this.state.public,
          //         tags: JSON.stringify(["hi", "h2"]),
          //         is_private: !this.state.public,
          //       },
          //       notes: [
          //         {
          //           course: this.props.selectedCourse.id,
          //           id: result.data.note,
          //           question: values.question,
          //           title: "whatever",
          //           content: values.note,
          //           tags: JSON.stringify(["hi"]),
          //         },
          //       ],
          //       is_private: !this.state.public,
          //     })
          //   );
        })
        .catch((err) => {
          console.log("add notes: ", err);
          setIsLoading(false);
          message.error(
            `Fail to Add New Note  x_x \n Did you verify your email?`
          );
        });
    })
    .catch((err) => {
      console.log("add questions: ", err);
      setIsLoading(false);
      message.error(
        `Fail to Create New Question  x_x \n Did you verify your email?`
      );
    });
}

export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
}

function newNoteForm(addNt, selectedCourse, setAddNt, handleSubmit) {
  const [form] = Form.useForm();
  const formItemLayout = {
    wrapperCol: {
      span: 20,
      offset: 2,
    },
  };
  const forceUpdate = useForceUpdate();

  const [loading, setIsLoading] = useState(false);
  if (addNt)
    return (
      <Card hoverable bordered={false} title="" className="my-2">
        <Button
          type="ghost"
          size="medium"
          onClick={() => {
            setAddNt(false);
          }}
          style={{ float: "right", display: "block" }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>

        <Form
          {...formItemLayout}
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={(values) => {
            handleSubmit(values, selectedCourse, setIsLoading);
            setAddNt(false);
            forceUpdate();
          }}
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

          <Form.Item name="isPublic" valuePropName="checked">
            <Checkbox
              onChange={(e) => {
                form.setFieldsValue({ isPublic: e.target.checked });
              }}
            >
              Public
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
}

export default Notebook;
