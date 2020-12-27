import React, { Component } from "react";
import { Button } from 'rsuite';
import fakeData from './fakeData.json'
import { Table } from 'rsuite';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import 'rsuite/dist/styles/rsuite-default.css';
import store from '../../store';


const { Column, HeaderCell, Cell, Pagination } = Table;

export class Wishlist extends Component{
    constructor(props) {
        super(props);
        this.state = {
          data: store.getState().course.selectedCourseArray
        };
        
      }
      
      static propTypes = {
        selectedCourseArray: PropTypes.array.isRequired,
      };

      render() {
        return (
          <div>
              {console.log(this.props.selectedCourseArray)}
            <Table
              
              data={this.props.selectedCourseArray}
              onRowClick={data => {
                console.log(data);
              }}
            >
              <Column width={70} align="center" fixed>
                <HeaderCell>Id</HeaderCell>
                <Cell dataKey="id" />
              </Column>
    
              <Column width={200} fixed>
                <HeaderCell>Course Number</HeaderCell>
                <Cell dataKey="firstName" />
              </Column>
    
              <Column width={200}>
                <HeaderCell>Course Name</HeaderCell>
                <Cell dataKey="lastName" />
              </Column>
    
              <Column width={200}>
                <HeaderCell>Time</HeaderCell>
                <Cell dataKey="city" />
              </Column>
    
              <Column width={200}>
                <HeaderCell>Location</HeaderCell>
                <Cell dataKey="street" />
              </Column>
    
              <Column width={300}>
                <HeaderCell>Professor</HeaderCell>
                <Cell dataKey="professor" />
              </Column>
    
              <Column width={300}>
                <HeaderCell>Description</HeaderCell>
                <Cell dataKey="email" />
              </Column>
              <Column width={120} fixed="right">
                <HeaderCell>Action</HeaderCell>
    
                <Cell>
                  {rowData => {
                    function handleAction() {
                      alert(`id:${rowData.id}`);
                    }
                    return (
                      <span>
                        <a onClick={handleAction}> Edit </a> |{' '}
                        <a onClick={handleAction}> Remove </a>
                      </span>
                    );
                  }}
                </Cell>
              </Column>
            </Table>
          </div>
        );
}
}

const mapStateToProps = (state) => ({
    selectedCourseArray: state.course.selectedCourseArray,
    selectedCRN: state.course.selectedCRN,
  });
  
export default connect(mapStateToProps)(Wishlist);

  
