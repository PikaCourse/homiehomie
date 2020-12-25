import React, { Component, Fragment } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {addCurrCourse} from '../../actions/calendar'
import { setCourse } from "../../actions/course";

// style 
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
const weekday= ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function weekdayToClass(index, timeArray)
{
    for(let i = 0; i<timeArray.length;i++)
    {
        if(timeArray[i].weekday == index) return "mb-1 badge bg-secondary" ;
    }

    return "badge bg-light mb-1" ;
 };

export class WikiSummary extends Component {
    constructor(props) {
        super(props)
    }

    handleCRNChange(course) {
        this.props.dispatch(setCourse({
            selectedCourse: course, 
            selectedCourseArray: this.props.selectedCourseArray
        }))
        // this.setState({courseIndex: this.props.selectedCourseArray.indexOf(course)});
    }

    addCourseSchedule(props)
    {
        this.props.dispatch(addCurrCourse(props));
    }

    mapSelectedCourse(course){
        let result = 0;
        if(course != undefined && course != null && Object.keys(course).length != 0) 
            result = this.props.selectedCourseArray.indexOf(course);
        return result;
    }
    animateButton(e) {

        e.preventDefault;
        //reset animation
        e.target.classList.remove('animate');
        
        e.target.classList.add('animate');
        setTimeout(function(){
          e.target.classList.remove('animate');
        },700);
    };

    static propTypes = {
        selectedCourseArray:PropTypes.array.isRequired
    }

    componentDidMount(){
        //this.props.getCourse('CS-3114');
    }
    


    render() {
        return (
            <Fragment>
                {typeof this.props.selectedCourseArray[this.mapSelectedCourse(this.props.selectedCourse)] != 'undefined'? 
                    <div className ="p-2">
                    
                    <div>
                    <h1 className = "mr-2" style={{color:'#419EF4',  display:'inline'}}>
                        {this.props.selectedCourseArray[this.mapSelectedCourse(this.props.selectedCourse)].course_meta.title}
                        
                    </h1>
                    <DropdownButton className = "col-sm-3 mx-0 px-0 mb-1" alignRight title={'CRN: ' + this.props.selectedCourseArray[this.mapSelectedCourse(this.props.selectedCourse)].crn} 
                                id="dropdown-menu-align-right" style = {{fontSize:'1rem', display:'inline'}}>
                                {this.props.selectedCourseArray.map((course) => (
                                    <Dropdown.Item 
                                        value={course.crn} 
                                        onSelect={()=> this.handleCRNChange(course)} >{course.crn}</Dropdown.Item>
                                ))}
                    </DropdownButton>
                    </div>
                    <h1>
                        {this.props.selectedCourse.course_meta.name}
                    </h1> 


                       
                    
                    <div className="">
                    
                        <p className="mb-1" style={{fontFamily: 'Montserrat'}}>
                            {weekday.map((day, index) => (
                                <span className= {weekdayToClass(index, this.props.selectedCourse.time)}>{day}</span>
                            ))}
                        </p>

                        <p className="mb-1" style={{fontFamily: 'Montserrat'}}>
                        {this.props.selectedCourse.professor} - {this.props.selectedCourse.time[0].start_at}-{this.props.selectedCourse.time[0].end_at} - {this.props.selectedCourse.location}
                        </p>
                        
                        <p className="mb-1" style={{fontFamily: 'Montserrat'}}>
                        Credit Hour: {this.props.selectedCourse.course_meta.credit_hours}
                        </p>

                        <p className="mb-1" style={{fontFamily: 'Montserrat'}}>
                            Capacity: {this.props.selectedCourse.capacity}
                        </p>
                    
                        {/* <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                            Location: {this.props.selectedCourse.location}
                        </p> */}
                        {/* <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                            Instructor: {this.props.selectedCourse.professor}
                        </p> */}
                        

                        
                        {/* ToDO: GPA & Modality */}
                    </div>
                <button type="button" className="bubbly-button mt-2 mb-4" 
                        onClick={(event)=> {this.addCourseSchedule(this.mapSelectedCourse(this.props.selectedCourse)); this.animateButton(event)} }
                        style={{fontFamily: 'Montserrat', fontSize:'1rem'}}>
                        <FontAwesomeIcon className="mr-2" icon={faPlus}/>Add To My Schedule
                        </button>
                </div>

                :'loading...'}

                    

            </Fragment>
        )
    }
}

const mapStateToProps = state =>({
    selectedCourseArray: state.course.selectedCourseArray,
    selectedCourse: state.course.selectedCourse
});



export default connect(mapStateToProps)(WikiSummary);
