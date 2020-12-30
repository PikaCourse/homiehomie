import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import store from "../../store";

import { Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
import { Table, Button, Switch, Space, Radio, Divider } from "antd";
import {removeCurrCourseFromWish} from "../../actions/wishlist"
import {setCourse, getCourse} from "../../actions/course"

const columns = [
  {
    title: '',
    key: 'operation',
    fixed: 'left',
    //width: 30,
    render: (text, record) => <div><Button
              onClick={(e) => {
                console.log('print record: '+record); 
                store.dispatch(removeCurrCourseFromWish(record.id, e)); 
              }}
            >Remove</Button>
            <Button
            onClick={(e) => {
              console.log('print record: '+record); 
              store.dispatch(removeCurrCourseFromWish(record.id, e)); 
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
    title: "id",
    dataIndex: "id",
  },
  {
    title: "crn",
    dataIndex: "crn",
  },
  {
    title: "time",
    dataIndex: "time",
  },
  {
    title: "capacity",
    dataIndex: "capacity",
  },
  {
    title: "registered",
    dataIndex: "registered",
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
    title: "tags",
    dataIndex: "tags",
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
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
    }; 
    
  }
  
  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
    console.log(columns[1].title); 
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  static propTypes = {
    selectedCourseArray: PropTypes.array.isRequired,
    //wishlistCourseBag: PropTypes.array.isRequired,
  };

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    columns[0].title = <span><Button
        type="primary"
        onClick={this.start}
        disabled={!hasSelected}
        loading={loading}
      >
        Add All
      </Button></span>;
    return (

      <div id="app" className="col-sm-12">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          className="site-collapse-custom-collapse"
        >
          <Panel
            header="Wishlist"
            key="1"
            className="site-collapse-custom-panel"
          >
            {/* <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                onClick={this.start}
                disabled={!hasSelected}
                loading={loading}
              >
                Add All
              </Button>
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
              </span>
            </div> */}
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={store.getState().wishlist.wishlistCourseBag}
              // dataSource={[store.getState().course.selectedCourseArray.find(
              //   ({ crn }) => crn === store.getState().course.selectedCRN
              // )]}
              scroll={{ x:  'max-content' }} //api: https://ant.design/components/table/#scroll
            />
          </Panel>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedCourseArray: state.course.selectedCourseArray,
  selectedCRN: state.course.selectedCRN,
  wishlistCourseBag: state.wishlist.wishlistCourseBag
});

export default connect(mapStateToProps)(Wishlist);
