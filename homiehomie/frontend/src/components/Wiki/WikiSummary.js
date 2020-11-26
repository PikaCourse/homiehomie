import React, { Component } from 'react'

export class WikiSummary extends Component {
    render() {
        return (
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
            </div>
        )
    }
}

export default WikiSummary
