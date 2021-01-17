import React, { Component, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import store from "../../store";

import { CaretRightOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import {
  Table,
  Button,
  Switch,
  Space,
  Radio,
  Divider,
  Collapse,
  Tag,
  Modal,
  Drawer,
} from "antd";

const { Panel } = Collapse;
// import {} from "../../actions/wishlist"
import { setCourse, getCourse } from "../../actions/course";
import { removeCurrCourseFromWish } from "../../actions/wishlist";
import { useDispatch, useSelector } from "react-redux";

function Wishlist() {
  const wishlistCourseBag = useSelector(
    (state) => state.wishlist.wishlistCourseBag
  );
  // const calendarCourseBag = useSelector(
  //   (state) => state.calendar.calendarCourseBag
  // );
  const [visible, setVisible] = useState(false);

  const columns = [
    {
      title: "Actions",
      key: "operation",
      fixed: "left",
      //width: 30,
      render: (text, record) => (
        <div>
          <Button
            onClick={(e) => {
              store.dispatch(removeCurrCourseFromWish(record.id, e));
            }}
          >
            Remove
          </Button>
          <Button
            onClick={(e) => {
              store.dispatch(
                setCourse({
                  selectedCourse: record.selectedCourseArray.filter(
                    (item) => item.id === record.courseId
                  )[0],
                  selectedCourseArray: record.selectedCourseArray,
                })
              );
              setIsWishlistVisible(false);
            }}
          >
            View
          </Button>
        </div>
      ),
    },
    // {
    //   title: "In Course Bag?",
    //   shouldCellUpdate: (record, prevRecord) => {},
    //   render: () => (text, record) => {
    //     let inCourseBag = JSON.stringify(
    //       typeof calendarCourseBag.find(
    //         (element) => element.raw.crn == record.crn
    //       ) == "undefined"
    //     );
    //     return <h5>{inCourseBag}</h5>;
    //   },
    // },
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "tags",
      dataIndex: "tags",
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
  ];

  return (
    <div>
      <Button
        size="medium"
        style={{ color: "#419EF4" }}
        onClick={() => setVisible(true)}
      >
        <FontAwesomeIcon icon={faStar} />
      </Button>

      <Drawer
        placement="top"
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <div id="app" className="col-sm-12">
          <Table
            columns={columns}
            dataSource={wishlistCourseBag}
            scroll={{ x: "max-content" }} //api: https://ant.design/components/table/#scroll
          />
        </div>
      </Drawer>
    </div>
  );
}

const mapStateToProps = (state) => ({
  selectedCourseArray: state.course.selectedCourseArray,
});

export default connect(mapStateToProps)(Wishlist);
