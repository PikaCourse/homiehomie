import React, { Component, Fragment } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {addCurrCourse} from '../../actions/calendar'

// style 
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export class WikiSummary extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             courseIndex: 0
        }
    }

    handleCRNChange(course) {
        this.setState({courseIndex: this.props.course.indexOf(course)});
    }

    addCourseSchedule()
    {
        console.log("add");
        this.props.dispatch(addCurrCourse());
    }


    static propTypes = {
        course:PropTypes.array.isRequired
    }

    componentDidMount(){
        this.props.getCourse('CS-3114');
    }
    render() {
        return (
            <Fragment>
                {typeof this.props.course[this.state.courseIndex] != 'undefined'? 
                    <div className ="p-2">
                    <div className = "row">
                        <h1 className = "col-sm-3 text-wrap pr-0" style={{color:'#419EF4'}}>
                            {this.props.course[this.state.courseIndex].course_meta.title}
                        </h1>
                        <DropdownButton className = "col-sm-3 mx-0 px-0" alignRight title={'CRN: ' + this.props.course[this.state.courseIndex].crn} 
                            id="dropdown-menu-align-right">
                            {this.props.course.map((course) => (
                                <Dropdown.Item value={course.crn} 
                                    onSelect={()=> this.handleCRNChange(course)} >{course.crn}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>

                    <h1>
                        {this.props.course[this.state.courseIndex].course_meta.name}
                    </h1> 
                    <button type="button" className="btn btn-primary" 
                        onClick={()=> this.addCourseSchedule()} 
                        style={{fontFamily: 'Montserrat'}}>
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
                            {this.props.course[this.state.courseIndex].time.map((time) => (
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
                        Location: {this.props.course[this.state.courseIndex].location}
                    </p>
                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        Instructor: {this.props.course[this.state.courseIndex].professor}
                    </p>
                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        Credit Hour: {this.props.course[this.state.courseIndex].course_meta.credit_hours}
                    </p>

                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        Capacity: {this.props.course[this.state.courseIndex].capacity}
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
    course: state.course.course
});


export default connect(mapStateToProps)(WikiSummary);
