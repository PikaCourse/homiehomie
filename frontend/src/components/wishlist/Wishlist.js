import React, { Component, useState} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import store from "../../store";

import { CaretRightOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import { Table, Button, Switch, Space, Radio, Divider, Collapse, Tag, Modal } from "antd";

const { Panel } = Collapse;
// import {} from "../../actions/wishlist"
import {setCourse, getCourse} from "../../actions/course"
import {addSelectCourse, removeCurrCourseFromWish} from "../../actions/calendar"



function Wishlist() {

  const [isWishlistVisible, setIsWishlistVisible] = useState(false);

  const columns = [
    {
      title: 'Actions',
      key: 'operation',
      fixed: 'left',
      //width: 30,
      render: (text, record) => <div><Button
                onClick={(e) => {
                  store.dispatch(removeCurrCourseFromWish(record.id, e)); 
                }}
              >Remove</Button>
              <Button
              onClick={(e) => {
                store.dispatch(
                  setCourse({
                    selectedCRN: record.crn,
                    selectedCourseArray: record.selectedCourseArray,
                  })
                );
                setIsWishlistVisible(false); 
              }}
              >View</Button>
              </div>,
                    
    },
    {
      title: "In Course Bag?",
      dataIndex: "",
    },
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "tags",
      dataIndex: "tags",
      /* render: tags => (
        <>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ), */
    },
    {
      title: "time",
      dataIndex: "time",
    },
    {
      title: "crn",
      dataIndex: "crn",
    },
    {
      title: "registered",
      dataIndex: "registered",
    },
    {
      title: "capacity",
      dataIndex: "capacity",
    },
    {
      title: "type",
      dataIndex: "type", //need to be merged with semester 
    },
    {
      title: "professor",
      dataIndex: "professor",
    },
    {
      title: "location",
      dataIndex: "location",
    },
    {
      title: "title",
      dataIndex: "title",
    },
    {
      title: "name",
      dataIndex: "name",
    },
    {
      title: "credit_hours",
      dataIndex: "credit_hours",
    },
    {
      title: "description",
      dataIndex: "description",
    },
    {
      title: "college",
      dataIndex: "college",
    },
    // {
    //   title: "tags",
    //   dataIndex: ["course_meta","tags"],
    // },
  ];
  
  // start = () => {
  //   this.setState({ loading: true });
  //   // ajax request after empty completing
  //   setTimeout(() => {
  //     this.setState({
  //       selectedRowKeys: [],
  //       loading: false,
  //     });
  //   }, 1000);
  //   console.log(columns[1].title); 
  // };

  // onSelectChange = selectedRowKeys => {
  //   console.log('selectedRowKeys changed: ', selectedRowKeys);
  //   this.setState({ selectedRowKeys });
  // };

  // static propTypes = {
  //   selectedCourseArray: PropTypes.array.isRequired,
  //   pendingCourseBag: PropTypes.array.isRequired,
  // };

  return (
      <>
      <Button
                size="medium"
                style={{ color: "#419EF4" }}
                onClick={() => setIsWishlistVisible(true)}
              >
                <FontAwesomeIcon icon={faStar} />
              </Button>
              <Modal
                visible={isWishlistVisible}
                onCancel={() => setIsWishlistVisible(false)}
                width={"85vw"}
                footer={null}
              >
      <div id="app" className="col-sm-12">
      <Table
              // rowSelection={rowSelection}
              columns={columns}
              dataSource={store.getState().wishlist.wishlistCourseBag}
              // dataSource={[store.getState().course.selectedCourseArray.find(
              //   ({ crn }) => crn === store.getState().course.selectedCRN
              // )]}
              scroll={{ x:  'max-content' }} //api: https://ant.design/components/table/#scroll
            />
      </div>
      </Modal>
      </>
    // );
  )
  }

const mapStateToProps = (state) => ({
  selectedCourseArray: state.course.selectedCourseArray,
  selectedCRN: state.course.selectedCRN,
  pendingCourseBag: state.calendar.pendingCourseBag,
});

export default connect(mapStateToProps)(Wishlist);
