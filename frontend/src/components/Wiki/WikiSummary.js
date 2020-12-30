import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  addCurrCourse,
  removeCurrCourse,
  previewCurrCourse,
} from "../../actions/calendar";
import {addCurrCourseToWish} from "../../actions/wishlist"
import { setCourse } from "../../actions/course";
import store from "../../store";
// style
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faStar } from "@fortawesome/free-solid-svg-icons";
const weekday = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
import { Switch, Select, Input, Button } from "antd";

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
      previewSwitch: true,
      starButton:false,
    };

    this.previewInputChange = this.previewInputChange.bind(this);
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

  previewInputChange(checked) {
    console.log("checked: "+checked); 
    store.dispatch(previewCurrCourse(checked));
    this.setState({
      previewSwitch: checked,
    });
  }


  wishlistCheckDuplicate() {
    const curr = store.getState().wishlist.wishlistCourseBag.find(
      ({ crn }) => crn === store.getState().course.selectedCRN);

    // console.log( "curr.length: " + curr.length);
    
      return false;
    // if (store.getState().wishlist.wishlistCourseBag.length == 0)
    // {
    //   console.log('ran empty'); 
    //   return false; 
    // }
    // else {
    //   console.log('ran 1');
    // const selectedCourse = store.getState().course.selectedCourseArray.find(
    //     ({ crn }) => crn === store.getState().course.selectedCRN
    // );
    // console.log('ran 2');
    // let checkDuplicate = store.getState().wishlist.wishlistCourseBag.find( 
    //     ({crn}) => crn == selectedCourse.crn
    // ); 
    // console.log('ran 3'); 
    // console.log(typeof checkDuplicate === 'undefined'); 
    // return (typeof checkDuplicate === 'undefined'); 

    // }
    
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
        enableRemove = false;
      } else {
        // course same crn
        enableAdd = false;
      }
    }

    return (
      <div>
        <Button
          disabled={!enableAdd}
          className="mr-1 bubbly-button"
          type="primary"
          size="large"
          onClick={(event) => {
            //this.animateButton(event);
            this.props.dispatch(addCurrCourse());
            this.forceUpdate();
          }}
        >
          <FontAwesomeIcon className="mr-2" icon={faPlus} />
          {addButtonText}
        </Button>

        <Button
          className="mx-1"
          type="primary"
          size="large"
          disabled={!enableRemove}
          onClick={(event) => {
            this.props.dispatch(removeCurrCourse());
            // this.animateButton(event);
            this.forceUpdate();
          }}
        >
          <FontAwesomeIcon className="mr-2" icon={faMinus} />
          Remove
        </Button>

  
        <Button className="mx-1" type="primary" size="large" 
          onClick={(event) => {
            store.dispatch(addCurrCourseToWish());
          }}
          disabled={this.state.starButton}
        >
          <FontAwesomeIcon icon={faStar} />
          Add to Wishlist
        </Button>

        <Switch defaultChecked onChange={this.previewInputChange} />
      </div>
    );
  }

  static propTypes = {
    selectedCourseArray: PropTypes.array.isRequired,
  };
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    // console.log("componentDidUpdate");

    if (this.state.previewSwitch) {
      store.dispatch(previewCurrCourse(true));
    }
    else {
      store.dispatch(previewCurrCourse(false));
    }
    //console.log("previewSwitch: "+this.state.previewSwitch); 

    if (prevProps.wishlistCourseBag !== this.props.wishlistCourseBag
      || prevProps.selectedCRN !== this.props.selectedCRN
      ) {
      const curr = this.props.wishlistCourseBag.find(
      ({ crn }) => crn === store.getState().course.selectedCRN);
        this.setState({starButton: (curr != null)});
    }
  }

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
                  this.props.selectedCourse.course_meta.title
                }
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
            <h1>
              {
                this.props.selectedCourse.course_meta.name
              }
            </h1>

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
                {
                  this.props.selectedCourse.professor
                }{" "}
                -{" "}
                {
                  this.props.selectedCourse.time[0].start_at
                }
                -
                {
                  this.props.selectedCourse.time[0].end_at
                }{" "}
                -{" "}
                {
                  this.props.selectedCourse.location
                }
              </p>

              <p className="mb-1" style={{ fontFamily: "Montserrat" }}>
                Credit Hour:{" "}
                {
                  this.props.selectedCourse.course_meta.credit_hours
                }
              </p>

              <p className="mb-1" style={{ fontFamily: "Montserrat" }}>
                Capacity:{" "}
                {
                  this.props.selectedCourse.capacity
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
  selectedCourse: state.course.selectedCourse,
  wishlistCourseBag:state.wishlist.wishlistCourseBag
});

export default connect(mapStateToProps)(WikiSummary);
