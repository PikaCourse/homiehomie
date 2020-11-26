import React, { Component } from 'react'

export class WikiNotebook extends Component {
    render() {
        return (
            <div className ="p-3" style = {noteBookStyle}>
                <div>
                    <h2>title</h2>
                    <p class="pl-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. (Spring 2019) </p>
                </div>
                <div>
                    <h2>title</h2>
                    <p class="pl-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. (Spring 2019) </p>
                </div>
                <div>
                    <h2>title</h2>
                    <p class="pl-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. (Spring 2019) </p>
                </div>
            </div>
        )
    }
}
const noteBookStyle = {
    background: '#FFFFFF',
    border: '5px solid rgba(65, 158, 244, 0.27)',
    boxSizing: 'border-box',
    borderRadius: '2rem'
}
export default WikiNotebook
