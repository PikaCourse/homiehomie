import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import store from "../../store";

import { CaretRightOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {updateUserWishlist} from "../../actions/user"

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
import { selectCourse } from "../../course/action";
import { removeCurrCourseFromWish } from "../../actions/wishlist";
import { useDispatch, useSelector } from "react-redux";

function Wishlist() {
  const dispatch = useDispatch();
  const wishlistCourseBag = useSelector(
    (state) => state.wishlist.wishlistCourseBag
  );
  const loginStatus = useSelector(state => state.user.loginStatus); 
  // const calendarCourseBag = useSelector(
  //   (state) => state.calendar.calendarCourseBag
  // );
  const [visible, setVisible] = useState(false);

  const columns = [
    {
      title: "Actions",
      key: "operation",
      fixed: "left",
      width: 100, 
      align: "center", 
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
              store.dispatch(selectCourse({
                courseId: record.courseId,
                title: record.title
              }));
              setVisible(false);
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
    // {
    //   title: "ID",
    //   dataIndex: "id",
    // },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Time",
      dataIndex: "time",
    },
    {
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Professor",
      dataIndex: "professor",
    },
    {
      title: "Credit_hours",
      dataIndex: "credit_hours",
    },
    {
      title: "Type",
      dataIndex: "type", //need to be merged with semester
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 800, 
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
    },
    {
      title: "Tags",
      dataIndex: "tags",
    },
    {
      title: "CRN",
      dataIndex: "crn",
    },
    {
      title: "Registered",
      dataIndex: "registered",
    },
    {
      title: "College",
      dataIndex: "college",
    },
  ];

  useEffect(() => {
    //update course list to user 
    if (loginStatus) {
      dispatch(updateUserWishlist(wishlistCourseBag)); 
    }
  });

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

// TODO This also seems unnecessary?
const mapStateToProps = (state) => ({
  selectedCourseArray: state.course.selectedCourseArray,
});

// TODO Can use connect to pass dispatch method
export default connect(mapStateToProps)(Wishlist);
