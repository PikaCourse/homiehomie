import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {getCourse} from '../../actions/course'
import {connect} from 'react-redux'
export class Header extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      inputVal: '',
      courseIndex: 0
    }
  }

  static propTypes = {
    course:PropTypes.array.isRequired
  }

  handleInputChangeTwo({ target }) {
    this.setState({inputVal: target.value}); 
  }

  handleSearchClickedTwo() {
    console.log(this.state.inputVal); 
    this.props.dispatch(getCourse(this.state.inputVal));
  }
    render() {
        return (
          <nav className="navbar navbar-expand-lg navbar-light bg-light border-0 pb-4 pt-4">
          <a className="navbar-brand pl-4" href="#" style={selectedStyle}>Pork Rind Beta</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Dropdown
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="#">Action</a>
                  <a className="dropdown-item" href="#">Another action</a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#">Something else here</a>
                </div>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
              </li>
            </ul>
            <form className="form-inline my-2 my-lg-0"/>
          <input className="form-control mr-sm-2" type="search" placeholder="Search subject, CRN or course name" aria-label="Search" style = {{borderRadius: "30px"}} onChange={(e)=>this.handleInputChangeTwo(e)}/>
          <button className="btn btn-outline-primary my-2 my-sm-0" style = {{borderRadius: "30px"}} type="submit" onClick={()=>this.handleSearchClickedTwo()}>Search</button>
          </div>
        </nav>
        )
    }
}
const mapStateToProps = state =>({
  course: state.course.course
});

const selectedStyle = {
  textShadow: '0px 4px 10px rgba(89, 108, 126, 0.35)',
  color: '#596C7E',
  fontWeight: '800',
  fontSize:'1.5rem'
}
export default connect(mapStateToProps)(Header);
