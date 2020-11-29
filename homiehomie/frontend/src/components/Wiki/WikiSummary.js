import React, { Component, Fragment } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {getCourse} from '../../actions/course'


export class WikiSummary extends Component {
    static propTypes = {
        course:PropTypes.array.isRequired
    }

    componentDidMount(){
        this.props.getCourse('CS-3114');
    }
    render() {
        return (
            <Fragment>
                
                
                {typeof this.props.course[0] != 'undefined'? 
                    <div className ="p-2">
                    <h1 style={{color:'#419EF4'}}>
                        {this.props.course[0].course_meta.title}
                    </h1>
                    <h1>
                        {this.props.course[0].course_meta.name}
                    </h1> 
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
                            {this.props.course[0].time.map((time) => (
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
                        Location: {this.props.course[0].location}
                    </p>
                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        Instructor: {this.props.course[0].professor}
                    </p>
                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        Credit Hour: {this.props.course[0].course_meta.credit_hours}
                    </p>

                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        Capacity: {this.props.course[0].capacity}
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

export default connect(mapStateToProps, {getCourse})(WikiSummary);
