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

function SearchCourseModal(props) {
    const showModal = () => {
        props.setIsModalVisible(true);
    };

    const handleOk = () => {
        props.setIsModalVisible(false);
    };

    const handleCancel = () => {
        props.setIsModalVisible(false);
    };

    return (
    <Modal title="Basic Modal" visible={props.isModalVisible} onOk={props.closeModal} onCancel={props.closeModal}>
    <p>Some contents...</p>
    </Modal>
    );
}
    
export default SearchCourseModal;