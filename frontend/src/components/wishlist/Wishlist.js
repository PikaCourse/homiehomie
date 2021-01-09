import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import store from "../../store";

import { Collapse, Tag } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
import { Table, Button, Switch, Space, Radio, Divider } from "antd";
// import {} from "../../actions/wishlist"
import {setCourse, getCourse} from "../../actions/course"
import {addSelectCourse, removeCurrCourseFromWish} from "../../actions/calendar"

const columns = [
  {
    title: 'Actions',
    key: 'operation',
    fixed: 'left',
    //width: 30,
    render: (text, record) => <div><Button
              onClick={(e) => {
                store.dispatch(removeCurrCourseFromWish(record.id, e)); 
              }}
            >Remove</Button>
            <Button
            onClick={(e) => {
              store.dispatch(addSelectCourse(record.crn, record.selectedCourseArray)); 
            }} 
            >Add</Button>
            <Button
            onClick={(e) => {
              store.dispatch(
                setCourse({
                  selectedCRN: record.crn,
                  selectedCourseArray: record.selectedCourseArray,
                })
              );
            }}
            >View</Button>
            </div>,
                  
  },
  {
    title: "In Course Bag?",
    dataIndex: "",
  },
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "tags",
    dataIndex: "tags",
    /* render: tags => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ), */
  },
  {
    title: "time",
    dataIndex: "time",
  },
  {
    title: "crn",
    dataIndex: "crn",
  },
  {
    title: "registered",
    dataIndex: "registered",
  },
  {
    title: "capacity",
    dataIndex: "capacity",
  },
  {
    title: "type",
    dataIndex: "type", //need to be merged with semester 
  },
  {
    title: "professor",
    dataIndex: "professor",
  },
  {
    title: "location",
    dataIndex: "location",
  },
  {
    title: "title",
    dataIndex: "title",
  },
  {
    title: "name",
    dataIndex: "name",
  },
  {
    title: "credit_hours",
    dataIndex: "credit_hours",
  },
  {
    title: "description",
    dataIndex: "description",
  },
  {
    title: "college",
    dataIndex: "college",
  },
  // {
  //   title: "tags",
  //   dataIndex: ["course_meta","tags"],
  // },
];

export class Wishlist extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   selectedRowKeys: [], // Check here to configure the default column
    //   loading: false,
    // }; 
    // this.state = {
    //   uniqueCourseBag: Array.from(new Set(store.getState().calendar.calendarCourseBag.map(a => a.id)))
    //   .map(id => {
    //     return store.getState().calendar.calendarCourseBag.find(a => a.id === id)
    //   }), 
    // }
    
  }
  
  // start = () => {
  //   this.setState({ loading: true });
  //   // ajax request after empty completing
  //   setTimeout(() => {
  //     this.setState({
  //       selectedRowKeys: [],
  //       loading: false,
  //     });
  //   }, 1000);
  //   console.log(columns[1].title); 
  // };

  // onSelectChange = selectedRowKeys => {
  //   console.log('selectedRowKeys changed: ', selectedRowKeys);
  //   this.setState({ selectedRowKeys });
  // };

  static propTypes = {
    selectedCourseArray: PropTypes.array.isRequired,
    pendingCourseBag: PropTypes.array.isRequired,
  };

  render() {
    // const { loading, selectedRowKeys } = this.state;
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    // };
    // const hasSelected = selectedRowKeys.length > 0;
    // columns[0].title = <span><Button
    //     type="primary"
    //     onClick={this.start}
    //     disabled={!hasSelected}
    //     loading={loading}
    //   >
    //     Add All
    //   </Button></span>;

    // const uniqueCourseBag = store.getState().calendar.calendarCourseBag.filter(
    //   (item) => (item.raw.selectedCourseArray == this.props.selectedCourseArray) //&& (item.type != 'preview'))
    // );
    // const uniqueCourseBag = Array.from(new Set(store.getState().calendar.calendarCourseBag));
    // const uniqueCourseBag = store.getState().calendar.calendarCourseBag.filter((val,preVal,array) => array.indexOf(val).id == preVal.id);
    // const uniqueCourseBag = Array.from(new Set(store.getState().calendar.calendarCourseBag.map(a => a.id)))
    //   .map(id => {
    //     return store.getState().calendar.calendarCourseBag.find(a => a.id === id)
    //   }); 
    console.log("render in wishlist"); 
    console.log(store.getState().calendar.uniqueCourseBag); 

    return (

      <div id="app" className="col-sm-12">
      <Table
              // rowSelection={rowSelection}
              columns={columns}
              dataSource={[...store.getState().calendar.pendingCourseBag, ...store.getState().calendar.uniqueCourseBag]}
              // dataSource={[store.getState().course.selectedCourseArray.find(
              //   ({ crn }) => crn === store.getState().course.selectedCRN
              // )]}
              scroll={{ x:  'max-content' }} //api: https://ant.design/components/table/#scroll
            />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedCourseArray: state.course.selectedCourseArray,
  selectedCRN: state.course.selectedCRN,
  pendingCourseBag: state.calendar.pendingCourseBag,
});

export default connect(mapStateToProps)(Wishlist);