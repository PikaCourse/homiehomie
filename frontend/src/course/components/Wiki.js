/**
 * File name:	Wiki.js
 * Created:	01/18/2021
 * Author:	Marx Wang, Ji Zhang
 * Email:	foo@bar.com
 * Version:	1.0 Initial file
 * Description:	Container for search bar, course info, and note section
 */

import React, { useEffect, Fragment, useState} from "react";
import WikiNotebook from "./WikiNotebook";
import { getCourses } from "../action";
import { connect, } from "react-redux";
import store from "../../store"

import WikiSearch from "./Search";
import WikiSummary from "./Summary";
import Forum from "./Forum"
import PostForm from "./PostForm"

function Wiki(props) {
  // TODO Initial course should the last one user accessed
  useEffect( () => {
    // TODO Default should await user for searching
    // TODO Or display the last course user searched for
    props.dispatch(getCourses({
      title: "CAS BI 315"
    }));
    // console.log(store.getState().course.selectedCourse); 

    // typeof store.getState().course.selectedCourse == 'undefined' || typeof store.getState().course.selectedCourse.course_meta == 'undefined'?setCurrentCourseTitle("all"):setCurrentCourseTitle(store.getState().course.selectedCourse.course_meta.title); 
  });

  // const [currentCourseTitle, setCurrentCourseTitle] = useState(); 

  // const forumWithTag = () => {
  //   if (typeof store.getState().course.selectedCourse == 'undefined' || typeof store.getState().course.selectedCourse.course_meta == 'undefined') {
  //     return <Forum maxPost={10} height={400} tag={"#all"}/>;  
  //   } else {
  //     return <Forum maxPost={10} height={400} tag={"#"+store.getState().course.selectedCourse.course_meta.title}/>; 
  //   }
  // }

  return (
    <Fragment>
      <div className="px-1 mt-4" style={WikiStyle}>
        {/* <WikiSearch /> */}
        <WikiSummary />
        <div class="row justify-content-md-center">
          <div class="col-md-auto" style={{paddingTop: '50px'}} >
            <PostForm/>
          </div>
          <div class="col-md-auto">
            <ForumWithCourseTag selectedCourse={store.getState().course.selectedCourse}/>
            {/* {forumWithTag()} */}
            {/* <Forum maxPost={10} height={400} tag={"#"+store.getState().course.selectedCourse.course_meta.title}/> maxPost: maximum number of posts  */}
            {/* {console.log(store.getState().course.selectedCourse)} */}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

const WikiStyle = {
  overflowY: "auto",
  height: "82vh",
  borderBottomRightRadius: "20px",
  borderBottomLeftRadius: "20px",
};

function ForumWithCourseTag(globalProps) {
  

  // const [courseTag, setCourseTag] = useState(null); 

  // useEffect(() => {
  //   if (typeof props.selectedCourse == 'undefined' || typeof props.selectedCourse.course_meta == 'undefined') {
  //     setCourseTag(<Forum maxPost={10} height={400} tag={"#all"}/>);  
  //   } else {
  //     setCourseTag(<Forum maxPost={10} height={400} tag={"#"+props.selectedCourse.course_meta.title}/>); 
  //   }
  // }); 

  const courseTag = (props) => {
    if (typeof props.selectedCourse == 'undefined' || typeof props.selectedCourse.course_meta == 'undefined') {
      return(<Forum maxPost={10} height={400} tag={"#all"}/>);  
    } else {
      return(<Forum maxPost={10} height={400} tag={"#"+props.selectedCourse.course_meta.title}/>); 
    }
  }

  return (
    <>
      {courseTag(globalProps)}
    </>
  );  

}


export default connect(null, null)(Wiki);
