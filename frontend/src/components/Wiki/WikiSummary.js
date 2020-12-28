import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  addCurrCourse,
  removeCurrCourse,
  previewCurrCourse,
} from "../../actions/calendar";
import { setCourse } from "../../actions/course";
import store from "../../store";
// style
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faStar } from "@fortawesome/free-solid-svg-icons";
const weekday = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
import { Switch, Select, Input, Button } from "antd";

import { getCourse } from "../../actions/course";
import "../../../static/css/confetti.css"
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
      previewSwitch: false,
    };

    this.previewInputChange = this.previewInputChange.bind(this);
    this.previewCourseChange = this.previewCourseChange.bind(this);
  }

  animateButton(e) {
    e.preventDefault;
    //reset animation
    e.target.classList.remove("animate");

    e.target.classList.add("animate");
    setTimeout(function () {
      e.target.classList.remove("animate");
    }, 700);
    console.log("animate triggered");
  }
  previewInputChange(checked) {
    store.dispatch(previewCurrCourse(checked));
    this.setState({
      previewSwitch: value,
    });
  }

  previewCourseChange() {
    if (this.state.previewSwitch) {
      store.dispatch(previewCurrCourse(true));
    }
  }

  buttonLoader() {
    const courseArray = store
      .getState()
      .calendar.calendarCourseBag.filter(
        (item) => item.raw.selectedCourseArray == this.props.selectedCourseArray
      );

    let enableAdd = true;
    let enableRemove = true;
    let addButtonText = "Add Course";
    if (!Array.isArray(courseArray) || !courseArray.length) {
      // course not in calendarbag
      enableRemove = false;
    } else {
      const course = store
        .getState()
        .calendar.calendarCourseBag.filter(
          (item) => item.raw.selectedCRN == this.props.selectedCRN
        );
      // course in calendarbag
      if (!Array.isArray(course) || !course.length) {
        // course different crn
        addButtonText = "Change CRN";
      } else {
        // course same crn
        enableAdd = false;
      }
    }
    return (
      <div>
        <div>
          <Button
            className="mr-1 bubbly-button"
            type="primary"
            size="large"
            onClick={(event) => {
              this.animateButton(event);
              this.props.dispatch(addCurrCourse());
            }}
          >
            <FontAwesomeIcon className="mr-2" icon={faPlus} />
            Add
          </Button>

          <Button className="mx-1" type="primary" size="large" disabled>
            <FontAwesomeIcon className="mr-2" icon={faMinus} />
            Remove
          </Button>

          <Button className="mx-1" type="primary" size="large">
            <FontAwesomeIcon icon={faStar} />
          </Button>
        </div>
        <button
          disabled={!enableAdd}
          type="button"
          className="confetti-button mt-2 mb-4"
          onClick={(event) => {
            this.props.dispatch(addCurrCourse());
            this.animateButton(event);
          }}
          style={{ fontFamily: "Montserrat", fontSize: "1rem" }}
        >
          <FontAwesomeIcon className="mr-2" icon={faPlus} />
          {addButtonText}
        </button>

        <button
          disabled={!enableRemove}
          type="button"
          className="confetti-button mt-2 mb-4 mx-2"
          onClick={(event) => {
            this.props.dispatch(removeCurrCourse());
              this.animateButton(event);
          }}
          style={{ fontFamily: "Montserrat", fontSize: "1rem" }}
        >
          <FontAwesomeIcon className="mr-2" icon={faMinus} />
          Remove Course
        </button>
        <Switch defaultChecked onChange={this.previewInputChange} />
      </div>
    );
  }

  static propTypes = {
    selectedCourseArray: PropTypes.array.isRequired,
  };

  render() {
    return (
      <Fragment>
        {typeof this.props.selectedCourseArray.find(
          ({ crn }) => crn === this.props.selectedCRN
        ) != "undefined" ? (
          <div className="p-2">
            <div className="mb-4">
              <Search
                placeholder="Search subject, CRN or course name"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={(value) => this.props.dispatch(getCourse(value))}
              />
            </div>
            <div>
              <h1
                className="mr-2 align-middle"
                style={{ color: "#419EF4", display: "inline" }}
              >
                {
                  this.props.selectedCourseArray.find(
                    ({ crn }) => crn === this.props.selectedCRN
                  ).course_meta.title
                }
              </h1>
              {this.previewCourseChange()}

              <Select
                className="col-sm-3 mx-0 px-0 align-middle"
                defaultValue={this.props.selectedCRN}
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
            <h1>
              {
                this.props.selectedCourseArray.find(
                  ({ crn }) => crn === this.props.selectedCRN
                ).course_meta.name
              }
            </h1>

            <div className="">
              <p className="mb-1" style={{ fontFamily: "Montserrat" }}>
                {weekday.map((day, index) => (
                  <span
                    className={weekdayToClass(
                      index,
                      this.props.selectedCourseArray.find(
                        ({ crn }) => crn === this.props.selectedCRN
                      ).time
                    )}
                  >
                    {day}
                  </span>
                ))}
              </p>

              <p className="mb-1" style={{ fontFamily: "Montserrat" }}>
                {
                  this.props.selectedCourseArray.find(
                    ({ crn }) => crn === this.props.selectedCRN
                  ).professor
                }{" "}
                -{" "}
                {
                  this.props.selectedCourseArray.find(
                    ({ crn }) => crn === this.props.selectedCRN
                  ).time[0].start_at
                }
                -
                {
                  this.props.selectedCourseArray.find(
                    ({ crn }) => crn === this.props.selectedCRN
                  ).time[0].end_at
                }{" "}
                -{" "}
                {
                  this.props.selectedCourseArray.find(
                    ({ crn }) => crn === this.props.selectedCRN
                  ).location
                }
              </p>

              <p className="mb-1" style={{ fontFamily: "Montserrat" }}>
                Credit Hour:{" "}
                {
                  this.props.selectedCourseArray.find(
                    ({ crn }) => crn === this.props.selectedCRN
                  ).course_meta.credit_hours
                }
              </p>

              <p className="mb-1" style={{ fontFamily: "Montserrat" }}>
                Capacity:{" "}
                {
                  this.props.selectedCourseArray.find(
                    ({ crn }) => crn === this.props.selectedCRN
                  ).capacity
                }
              </p>

              {/* <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                            Location: {this.props.selectedCourseArray.find(
                ({ crn }) => crn === this.props.selectedCRN
              ).location}
                        </p> */}
              {/* <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                            Instructor: {this.props.selectedCourseArray.find(
                ({ crn }) => crn === this.props.selectedCRN
              ).professor}
                        </p> */}

              {/* ToDO: GPA & Modality */}
            </div>
            {this.buttonLoader()}
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
});

export default connect(mapStateToProps)(WikiSummary);
