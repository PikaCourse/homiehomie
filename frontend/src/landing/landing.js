import React, { useState } from "react";
import store from "../store";
import {Row, Col, Modal, Button, Image, Divider} from 'antd'
import TextArea from "antd/lib/input/TextArea";


function landing() {
    //local usage
    const [isModalVisible, setIsModalVisible] = useState(true);

    //showmodal function
    const showModal = () =>{
        setIsModalVisible(true);
    };

    const handleOk = () =>{
        setIsModalVisible(false);
    };

    const handleCancel = () =>{
        setIsModalVisible(false)
    }

    return(
        <>
            <Modal 
                title="Basic Modal" 
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                cancelButtonProps={{ disabled: true }}
                width = {1000}>
                <Image width = {200} src = "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                this is a cool project
            </Modal>
        </>
    );

}


export default landing;