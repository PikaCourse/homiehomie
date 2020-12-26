import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addCurrCourse, removeCurrCourse } from "../../actions/calendar";
import { setCourse } from "../../actions/course";

// style
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
const weekday = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function weekdayToClass(index, timeArray) {
  for (let i = 0; i < timeArray.length; i++) {
    if (timeArray[i].weekday == index) return "mb-1 badge bg-secondary";
  }

  return "badge bg-light mb-1";
}

export class WikiSummary extends Component {
  constructor(props) {
    super(props);
  }

  handleCRNChange(newCRN) {
    this.props.dispatch(
      setCourse({
        selectedCRN: newCRN,
        selectedCourseArray: this.props.selectedCourseArray,
      })
    );
  }

  animateButton(e) {
    e.preventDefault;
    //reset animation
    e.target.classList.remove("animate");

    e.target.classList.add("animate");
    setTimeout(function () {
      e.target.classList.remove("animate");
    }, 700);
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
            <div>
              <h1
                className="mr-2"
                style={{ color: "#419EF4", display: "inline" }}
              >
                {
                  this.props.selectedCourseArray.find(
                    ({ crn }) => crn === this.props.selectedCRN
                  ).course_meta.title
                }
              </h1>
              <DropdownButton
                className="col-sm-3 mx-0 px-0 mb-1"
                alignRight
                title={"CRN: " + this.props.selectedCRN}
                id="dropdown-menu-align-right"
                style={{ fontSize: "1rem", display: "inline" }}
              >
                {this.props.selectedCourseArray.map((course) => (
                  <Dropdown.Item
                    value={course.crn}
                    onSelect={() => this.handleCRNChange(course.crn)}
                  >
                    {course.crn}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
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
            <button
              type="button"
              className="bubbly-button mt-2 mb-4"
              onClick={(event) => {
                this.props.dispatch(addCurrCourse());
                this.animateButton(event);
              }}
              style={{ fontFamily: "Montserrat", fontSize: "1rem" }}
            >
              <FontAwesomeIcon className="mr-2" icon={faPlus} />
              Add To My Schedule
            </button>

            <button
              type="button"
              className="bubbly-button mt-2 mb-4"
              onClick={(event) => {
                this.props.dispatch(removeCurrCourse());
                this.animateButton(event);
              }}
              style={{ fontFamily: "Montserrat", fontSize: "1rem" }}
            >
              <FontAwesomeIcon className="mr-2" icon={faMinus} />
              Remove
            </button>
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
  selectedCourse: state.course.selectedCourse,
  selectedCRN: state.course.selectedCRN,
});

export default connect(mapStateToProps)(WikiSummary);
