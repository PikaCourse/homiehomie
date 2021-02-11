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
import { timeObjFommatter, weekday, Color } from "../../helper/global";


function SearchCourseModal(props) {
    const showModal = () => {
        props.setIsModalVisible(true);
    };

    function content() {
        if (props.isModalVisible) {
            return (
                <>
                <p>Change </p>
                <h1>{store.getState().course.selectedCourse.course_meta.title}</h1>
                <h2>{store.getState().course.selectedCourse.course_meta.name}</h2>
                {tagLoader(store.getState().course.selectedCourse)}
                <p>Prof: {store.getState().course.selectedCourse.professor}</p>
                {/* <p>Days: {store.getState().course.selectedCourse.time}</p> */}
                {/* <p>Time: {store.getState().course.selectedCourse.time}</p> */}
                <p>Loc: {store.getState().course.selectedCourse.location}</p>
                </>
            ); 
        }
    }

    //Copy from Summary.js, motification made 
    function tagLoader(selectedCourse) {
    return (
        <div>
        <p className="my-2" style={{ fontFamily: "Montserrat" }}>
            {
            weekday.map((day, i) => (
                <span 
                key={i}
                className={weekdayToClass(i, selectedCourse.time)}>
                {day}
                </span>
            ))
            }
    
            <span className="ml-2 mb-1 badge bg-secondary">
            {selectedCourse.crn == null
                ? selectedCourse.section
                : "CRN:"+selectedCourse.crn}
            </span>
        </p>
        </div>
    );
    }

    //Copy from Summary.js 
    function weekdayToClass(index, timeArray) {
    let timecp = timeArray;
    let result = "badge bg-light mb-1";
    timecp.map((timeObj) => {
        if (timeObj.weekday == index) {
        result = "mb-1 badge bg-secondary";
        }
    });
    return result;
    }
    return (
    <Modal visible={props.isModalVisible} onOk={props.closeModal} onCancel={props.closeModal}>
        {props.isModalVisible?content():null}
        {/* TODO create when isModalVisible is true, destroy when it is false */}
    </Modal>
    );
}
    
export default SearchCourseModal;