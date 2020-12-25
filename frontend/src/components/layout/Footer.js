import React, { Component } from 'react'

export class Footer extends Component {
    render() {
        return (
            <div className="contain-fluid mt-4 bottom">
                <div className="container card text-center border-0">
                    <a style={footerStyle}>
                        Homiehomie
                    </a> 

                    
                    <a style={footerStyle}>
                        Copyright © All
                        rights reserved
                    </a>
                </div>
            </div>
        )
    }
}
const footerStyle = {
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: 700
}
export default Footer
