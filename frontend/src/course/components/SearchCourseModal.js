/**
 * File name:	SearchCourseModal.js
 * Created:	02/03/2021
 * Author:	Joanna Fang
 * Email:	foo@bar.com
 * Version:	1.0 Initial file
 * Description:	Modal for selected course in search bar 
 */

import React, { useState } from "react";
import { Input, AutoComplete, Modal} from "antd";
import { getCourseSections, getCourses, clearCourses } from "../action";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import store from "../../store";


function SearchCourseModal(props) {
    const showModal = () => {
        props.setIsModalVisible(true);
    };

    const content = 
    <div>
        <p>{props.isModalVisible?store.getState().course.selectedCourse.course_meta.title:null}</p>
        <p>{props.isModalVisible?store.getState().course.selectedCourse.course_meta.name:null}</p>
    </div>; 

    return (
    <Modal title="Basic Modal" visible={props.isModalVisible} onOk={props.closeModal} onCancel={props.closeModal}>
        {props.isModalVisible?content:null}
        {/* TODO create when isModalVisible is true, destroy when it is false */}
    </Modal>
    );
}
    
export default SearchCourseModal;