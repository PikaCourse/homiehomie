/**
 * File name:	SearchCourseModal.js
 * Created:	02/03/2021
 * Author:	Joanna Fang
 * Email:	foo@bar.com
 * Version:	1.0 Initial file
 * Description:	Modal for selected course in search bar 
 */

import React, { useState } from "react";
import { Input, AutoComplete, Modal, Button} from "antd";
import { getCourseSections, getCourses, clearCourses } from "../action";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import store from "../../store";
import { timeObjFommatter, weekday, Color } from "../../helper/global";
import WikiSummary from "./Summary"


function SearchCourseModal(props) {
    return (
    <Modal visible={props.isModalVisible} onOk={props.closeModal} onCancel={props.closeModal} footer={<Button onClick={props.closeModal}>View More</Button>}>
        {/* TODO create when isModalVisible is true, destroy when it is false */}
        <WikiSummary/>
        
    </Modal>
    );
}
    
export default SearchCourseModal;