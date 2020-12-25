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


                       
                    <button type="button" className="bubbly-button" 
                        onClick={(event)=> {this.addCourseSchedule(this.mapSelectedCourse(this.props.selectedCourse)); this.animateButton(event)} }
                        style={{fontFamily: 'Montserrat', fontSize:'1rem'}}>
                        <FontAwesomeIcon className="mr-2" icon={faPlus}/>Add To My Schedule
                        </button>
                    <div className="p-2">
                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        <table className="table table-striped">
                        <thead>
                            <tr>
                            <th>Weekday</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th/>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.selectedCourse.time.map((time) => (
                                <tr key={time.weekday}>
                                    <td>{time.weekday}</td>
                                    <td>{time.start_at}</td>
                                    <td>{time.end_at}</td>
                                </tr>
                            ))}
                        </tbody>
                            </table> 
                    </p>
                    
                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        <span class="badge bg-light">Mo</span>
                        <span class="badge bg-secondary">Tu</span>
                        <span class="badge bg-light">We</span>
                        <span class="badge bg-secondary">Th</span>
                        <span class="badge bg-light">Fr</span>
                        <span class="badge bg-light">Sa</span>
                        <span class="badge bg-light">Su</span>
            
                    </p>
                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        Location: {this.props.selectedCourse.location}
                    </p>
                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        Instructor: {this.props.selectedCourse.professor}
                    </p>
                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        Credit Hour: {this.props.selectedCourse.course_meta.credit_hours}
                    </p>

                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        Capacity: {this.props.selectedCourse.capacity}
                    </p>
                    {/* ToDO: GPA & Modality */}
                </div>
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



  var bubblyButtons = document.getElementsByClassName("bubbly-button");
  
  for (var i = 0; i < bubblyButtons.length; i++) {
    bubblyButtons[i].addEventListener('click', animateButton, false);
 }


export default connect(mapStateToProps)(WikiSummary);
