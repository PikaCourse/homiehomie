/**
 * File name:	Wishlist.js
 * Created:	01/31/2021
 * Author:	Weili An, Joanna Fang
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	wishlist logic code
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {updateUserWishlist} from "../actions/user";

import {
  Table,
  Button,
  Drawer,
} from "antd";

const { Column } = Table;

// import {} from "../../actions/wishlist"
import { selectCourse } from "../course/action";
import { removeCourseFromWishlist } from "./action";
import { useDispatch, useSelector } from "react-redux";

function Wishlist() {
  const dispatch = useDispatch();

  // TODO Pass via mapsStateToProp
  const wishlistCourseBag = useSelector(
    (state) => state.wishlist.wishlistCourseBag
  );
  const loginStatus = useSelector(state => state.user.loginStatus);
  
  // Cast into array for put on table
  let wishlistCourseArray = [];
  for (let key in wishlistCourseBag) {
    let course = wishlistCourseBag[key];
    if (course != null)
      wishlistCourseArray.push(course);
  }
  
  // Control whether wishlist is visible or not
  const [visible, setVisible] = useState(false);

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
            dataSource={wishlistCourseArray}
            rowKey={record => record.id}
            scroll={{ x: "max-content" }} //api: https://ant.design/components/table/#scroll
          >
            {
            /**
             * Action button for the wishlist
             * Remove course from the wishlist
             * View the course on summary
             */
            }
            <Column 
              title="Actions" key="actions" fixed="left" width={100} align="center" 
              render={(_, record) => {
                return (
                  <div>
                    <Button
                      onClick={() => {
                        dispatch(removeCourseFromWishlist(record.id));
                      }}
                    >
                      Remove
                    </Button>
                    <Button
                      onClick={() => {
                        dispatch(selectCourse({
                          courseId: record.id,
                          title: record.course_meta.title
                        }));
                        setVisible(false);
                      }}
                    >
                      View
                    </Button>
                  </div>
                );
              }}
            />
            <Column title="Name" dataIndex={["course_meta", "name"]} key="name"/>
            <Column title="Time" dataIndex="timeStr" key="timeStr"/>
            <Column title="Location" dataIndex="location" key="location"/>
            <Column title="Professor" dataIndex="professor" key="professor"/>
            <Column title="Credit hours" dataIndex={["course_meta", "credit_hours"]} key="credit_hours"/>
            <Column title="Course Type" dataIndex="type" key="type"/>
            <Column title="Description" dataIndex={["course_meta", "description"]} key="description" width={800}/>
            <Column title="CRN" dataIndex="crn" key="crn"/>
            {
            /** 
             * TODO Conditional render based on whether registered or openset is provided 
             * */
            }
            <Column title="Registered" dataIndex="registered" key="registered"/>
            <Column title="Capacity" dataIndex="capacity" key="capacity"/>
            {
              // TODO The following two not yet fully support, comment out
              // TODO Temporarily as Jan. 31, 2021
            }
            {/* <Column title="College" dataIndex="college"/> */}
            {/* <Column title="Tags" dataIndex="tags" key="tags"/> */}
          </Table>
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
