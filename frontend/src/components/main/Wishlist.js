import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import store from "../../store";

import { Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
import { Table, Button } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];
const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}

export class Wishlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: store.getState().course.selectedCourseArray,
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
  };

  onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  static propTypes = {
    selectedCourseArray: PropTypes.array.isRequired,
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
                disabled={!hasSelected}
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
              dataSource={data}
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
});

export default connect(mapStateToProps)(Wishlist);
