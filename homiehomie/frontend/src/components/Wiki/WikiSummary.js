import React, { Component, Fragment } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {getCourse} from '../../actions/course'


export class WikiSummary extends Component {
    static propTypes = {
        course:PropTypes.array.isRequired
    }

    componentDidMount(){
        this.props.getCourse();
    }

    render() {
        return (
            <Fragment>
            <div>
                <div className ="p-2">
                    <h1 style={{color:'#419EF4'}}>
                        MATH2114
                    </h1>
                    <h1>
                        Intro Diff Equations
                    </h1>
                </div>
                <div className="p-2">
                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        12:20PM - 01:10PM
                    </p>
                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        Online with Synchronous Mtgs
                    </p>
                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        Instructor: Joe Biden
                    </p>
                    <p className="mb-0" style={{fontFamily: 'Montserrat'}}>
                        Avg GPA: 2.56
                    </p>
                </div>
                <div className="p-2">
                    <table className="table table-striped">
                    <thead>
                        <tr>
                        <th>Major</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th />
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.course.map((course) => (
                        <tr key={course.major}>
                            <td>{course.course}</td>
                            <td>{course.name}</td>
                            <td>{course.location}</td>
                            <td>
                            <button className="btn btn-danger btn-sm">
                                Delete
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>`
                </div>
            </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state =>({
    course: state.course.course
});

export default connect(mapStateToProps, {getCourse})(WikiSummary);
// export default WikiSummary
