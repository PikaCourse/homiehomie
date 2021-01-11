import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  addCurrCourse,
  removeCurrCourse,
  // previewCurrCourse,
  // updatePreviewCourse
} from "../../actions/calendar";
import {addCurrCourseToWish} from "../../actions/wishlist"
// import {  } from "../../actions/wishlist";
import { setCourse } from "../../actions/course";
import store from "../../store";
// style
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faStar,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
const weekday = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
import { Switch, Select, Input, Button, Tooltip, message } from "antd";

import { getCourse } from "../../actions/course";
import "antd/lib/style/themes/default.less";
import "antd/dist/antd.less";
import "../../main.less";

const { Search } = Input;
function weekdayToClass(index, timeArray) {
  for (let i = 0; i < timeArray.length; i++) {
    if (timeArray[i].weekday == index) return "mb-1 badge bg-secondary";
  }

  return "badge bg-light mb-1";
}

export class WikiSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starButton: false,
    };
  }

  animateButton(e) {
    e.preventDefault;
    e.target.classList.remove("animate");
    e.target.classList.add("animate");
    setTimeout(function () {
      e.target.classList.remove("animate");
    }, 700);
  }

  buttonLoader() { 
    const courseArray = store
      .getState()
      .calendar.calendarCourseBag.filter(
        (item) => (item.raw.selectedCourseArray == this.props.selectedCourseArray) //&& (item.type != 'preview'))
      );


    let enableAdd = true;
    let enableRemove = true;
    let addButtonText = "Add Course";
    console.log("courseArray");
    console.log(courseArray);
    if (!Array.isArray(courseArray) || !courseArray.length) {
      // course not in calendarbag
      enableRemove = false;
    } else {
      const course = store.getState().calendar.calendarCourseBag.filter(
        (item) => item.raw.crn == this.props.selectedCRN //&& (item.type != 'preview')
      );
      // course in calendarbag
      if (!Array.isArray(course) || !course.length) {
        // course different crn
        addButtonText = "Change CRN";
        enableRemove = false;
      } else {
        // course same crn
        enableAdd = false;
      }
    }

    return (
      <div>
        <Tooltip title={addButtonText}>
          <Button
            disabled={!enableAdd}
            className="mr-1 bubbly-button"
            type="primary"
            size="large"
            onClick={(event) => {
              //this.animateButton(event);
              this.props.dispatch(addCurrCourse());
              this.forceUpdate();
              addButtonText != "Change CRN"
                ? message.success({
                    content: "Course Added Successfully",
                    style: {
                      marginTop: "5vh",
                    },
                  })
                : message.success({
                    content: "CRN Changed Successfully",
                    style: {
                      marginTop: "5vh",
                    },
                  });
            }}
          >
            {addButtonText != "Change CRN" ? (
              <FontAwesomeIcon className="" icon={faPlus} />
            ) : (
              <FontAwesomeIcon className="" icon={faSave} />
            )}
          </Button>
        </Tooltip>
        <Tooltip title="Remove">
          <Button
            className="mx-1"
            type="primary"
            size="large"
            disabled={!enableRemove}
            onClick={(event) => {
              this.props.dispatch(removeCurrCourse());
              this.forceUpdate();
              message.success({
                content: "Course Removed Successfully",
                style: {
                  marginTop: "5vh",
                },
              });
            }}
          >
            <FontAwesomeIcon className="" icon={faMinus} />
          </Button>
        </Tooltip>

        <Tooltip title="Add to Wishlist">
          <Button
            className="mx-1"
            type="primary"
            size="large"
            onClick={(event) => {
              store.dispatch(addCurrCourseToWish());
              message.success({
                content: "Course Added To Wishlist",
                style: {
                  marginTop: "5vh",
                },
              });
            }}
            disabled={this.state.starButton}
          >
            <FontAwesomeIcon icon={faStar} />
          </Button>
        </Tooltip>

        {/* <Switch defaultChecked onChange={this.previewInputChange} /> */}
      </div>
    );
  }

  static propTypes = {
    selectedCourseArray: PropTypes.array.isRequired,
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.wishlistCourseBag !== this.props.wishlistCourseBag ||
      prevProps.selectedCRN !== this.props.selectedCRN
    ) {

      const curr = this.props.wishlistCourseBag.find(
        ({ crn }) => crn === store.getState().course.selectedCRN
      );
      this.setState({ starButton: curr != null });
    }
  }

  render() {
    return (
      <Fragment>
        {typeof this.props.selectedCourseArray.find(
          ({ crn }) => crn === this.props.selectedCRN
        ) != "undefined" ? (
          <div className="">
            <div className="mb-2">
              <Search
                bordered={false}
                style={{ backgroundColor: "#ffffff", borderRadius: "0.5rem" }}
                placeholder="Search subject, CRN or course name"
                allowClear
                enterButton={
                  <Button className="mx-1" type="ghost" size="large">
                    Search
                  </Button>
                }
                size="large"
                type="ghost"
                onSearch={(value) => this.props.dispatch(getCourse(value))}
              />
            </div>

            <div
              className="p-4 my-2 mt-4"
              style={{ backgroundColor: "#ffffff", borderRadius: "1.5rem" }}
            >
              <div>
                <h1
                  className="mr-2 align-middle"
                  style={{ color: "#419EF4", display: "inline" }}
                >
                  {this.props.selectedCourse.course_meta.title}
                </h1>

                <Select
                  className="col-sm-3 mx-0 px-0 align-middle"
                  defaultValue={this.props.selectedCRN}
                  value={this.props.selectedCRN}
                  style={{ width: 120 }}
                  size="large"
                  onChange={(value) => {
                    this.props.dispatch(
                      setCourse({
                        selectedCRN: value,
                        selectedCourseArray: this.props.selectedCourseArray,
                      })
                    );
                  }}
                >
                  {this.props.selectedCourseArray.map((course) => (
                    <Option value={course.crn}>{course.crn}</Option>
                  ))}
                </Select>
              </div>
              <h1>{this.props.selectedCourse.course_meta.name}</h1>

              <div className="">
                <p className="mb-1" style={{ fontFamily: "Montserrat" }}>
                  {weekday.map((day, index) => (
                    <span
                      className={weekdayToClass(
                        index,
                        this.props.selectedCourse.time
                      )}
                    >
                      {day}
                    </span>
                  ))}
                </p>

                <p className="mb-1" style={{ fontFamily: "Montserrat" }}>
                  {this.props.selectedCourse.professor} -{" "}
                  {this.props.selectedCourse.time[0].start_at}-
                  {this.props.selectedCourse.time[0].end_at} -{" "}
                  {this.props.selectedCourse.location}
                </p>

                <p className="mb-1" style={{ fontFamily: "Montserrat" }}>
                  Credit Hour:{" "}
                  {this.props.selectedCourse.course_meta.credit_hours}
                </p>

                <p className="mb-1" style={{ fontFamily: "Montserrat" }}>
                  Capacity: {this.props.selectedCourse.capacity}
                </p>
              </div>
              {this.buttonLoader()}
            </div>
          </div>
        ) : (
          "loading..."
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedCourseArray: state.course.selectedCourseArray,
  selectedCRN: state.course.selectedCRN,
  selectedCourse: state.course.selectedCourse,
  calendarCourseBag: state.calendar.calendarCourseBag, 
  wishlistCourseBag: state.wishlist.wishlistCourseBag, 
});

export default connect(mapStateToProps)(WikiSummary);
