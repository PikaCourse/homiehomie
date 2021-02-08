/**
 * File name:	Search.js
 * Created:	01/18/2021
 * Author:	Marx Wang, Ji Zhang
 * Email:	foo@bar.com
 * Version:	1.0 Initial file
 * Description:	Search bar implementation and autocomplete for searching courses
 */

import React, { useState } from "react";
import { Input, AutoComplete, Modal, Button} from "antd";
import { getCourseSections, getCourses, clearCourses } from "../action";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import {SearchCourseModal} from "./SearchCourseModal"
// import { Button } from "bootstrap";

// TODO Change based on User school info
// TODO Can be dynamic showing user different kinds of way to use the search bar
// TODO   For instance, search by course title, course name, course descriptioon, tags, or professor name
// TODO Also, make this a function variable since it is not used elsewhere

// TODO Customized based on user school
const prompt = "Try CAS CS 111";

// TODO Provide a "more courses" option to disable at the bottom of the dropdown list
// TODO   to allow user to increase search limit
function WikiSearch() {
  // Receive updated courses list via redux
  // state.course as we will combined the reducer together
  const option = useSelector((state,) => state.course.option);
  const [value, setValue] = useState("");
  const [timer, setTimer] = useState(null);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Call the getCourses method to store the returned list in redux
  // and be used later here and also other part of the application
  function searchOnChange(value) {
    // TODO Use same naming for parameters or provide documentation for parameters
    // Search list of course meta objects via the value query
    clearTimeout(timer);
    if (value && value.length > 1) {
      // TODO Why timeout here? Suspecting this is to add some delay to respond to user input?
      setTimer(
        setTimeout(() => {
          dispatch(getCourses({"title": value}));
        }, 100),
      );
    }
  }

  function openModal() {
    setIsModalVisible(true); 
  }

  function closeModal() {

  }

  return (
    <>
    <AutoComplete
      options={option}
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "5rem",
      }}
      onSelect={(title) => {
        dispatch(getCourseSections({"title": title})).then(()=>{
          // TODO get dispatch successful or not, then run the following code 
          // is then means always successful? 
          //console.log("no error>?????"); 
          setIsModalVisible(true); 
          openModal(); 
        });

      }}
      onBlur={() => {
        // Clear if the search bar is empty
        if (value.length == 0)
          dispatch(clearCourses());
      }}
      onSearch={(value) => {
        setValue(value);
        searchOnChange(value);
      }}
      allowClear
      bordered={false}
    >
      <Input size="large" placeholder={prompt} prefix={<SearchOutlined />} />
      {/* <SearchCourseModal isModalVisible={true}/> */}
      
    </AutoComplete>
    <Button onClick={openModal}>Open Modal</Button>
      <Modal title="Basic Modal" visible={isModalVisible} onOk={setIsModalVisible(false)} onCancel={setIsModalVisible(false)}>
        <p>Some contents...</p>
      </Modal>
    </>
  );
}

export default WikiSearch;
