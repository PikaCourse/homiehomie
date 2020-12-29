import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import store from "../../store";

import { Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
import { Table, Button, Switch, Space } from "antd";

const columns = [
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
// const data = [];
// for (let i = 0; i < 5; i++) {
//   data.push({
//     key: i,
//     name: `Edward King ${i}`,
//     age: 32,
//     address: `London, Park Lane no. ${i}`,
//   });
// }

export class Wishlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [store.getState().wishlist.wishlistCourseBag],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
    };

    // this.setState({
    //   data: store.getState().course.selectedCourseArray.find(
    //     ({ crn }) => crn === store.getState().course.selectedCRN
    //   )
    // }); 
  }
  
  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        data: [store.getState().wishlist.wishlistCourseBag], 
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ 
      // data: [store.getState().wishlist.wishlistCourseBag], 
      selectedRowKeys });
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
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                onClick={this.start}
                //disabled={!hasSelected}
                loading={loading}
              >
                Reload
              </Button>
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
              </span>
            </div>
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
