import React, { Component, Fragment, useState, useCallback } from "react";
import "antd/lib/style/themes/default.less";
import "antd/dist/antd.less";
import "../../main.less";
import axios from "axios";

import {
  Button,
  Input,
  Card,
  Form,
  message,
  resetFields,
  Space,
  Divider, 
  Col, 
  AutoComplete, 
} from "antd";
const mockVal = (str, repeat = 1) => ({
    value: str.repeat(repeat),
  });

function TagAutoComplete () {
    const [value, setValue] = useState('');
    const [options, setOptions] = useState([]);

    const onSearch = (searchText) => {
        // setOptions(
        // !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
        // );
        axios.get(`api/tags?name=${searchText}`).then((res) => {
            console.log(res.data.results); 
            let tags = res.data.results.map(a => ({value: a.name})); 
            setOptions(tags); 
        });
    };

    const onSelect = (data) => {
        console.log('onSelect', data);
    };

    const onChange = (data) => {
        setValue(data);
    };

    return (
        <>
        <AutoComplete
            options={options}
            style={{
            width: 200,
            }}
            onSelect={onSelect}
            onSearch={onSearch}
            placeholder="input here"
        />
        </>
    );
}

export default TagAutoComplete; 
