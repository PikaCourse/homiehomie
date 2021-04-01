import React from "react";
import "antd/lib/style/themes/default.less";
import "antd/dist/antd.less";
import "../../main.less";
import axios from "axios";
import { PlusOutlined } from '@ant-design/icons';


import {
  AutoComplete, 
  Tag, 
  Input, 
  Tooltip
} from "antd";

class InputTags extends React.Component {
  state = {
    tags: [],
    inputVisible: true,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: '',
    options: [], 
  };

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e });
    this.showInput(); 
    axios.get(`api/tags?name=${e}`).then((res) => {
      let tags = res.data.results.map(a => ({value: a.name})); 
      this.setState({options: tags}); 
    });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: true,
      inputValue: '',
    });
  };

  handleEditInputChange = e => {
    this.setState({ editInputValue: e.target.value });
  };

  handleEditInputConfirm = () => {
    this.setState(({ tags, editInputIndex, editInputValue }) => {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;

      return {
        tags: newTags,
        editInputIndex: -1,
        editInputValue: '',
      };
    });
  };

  saveInputRef = input => {
    this.input = input;
  };

  saveEditInputRef = input => {
    this.editInput = input;
  };

  render() {
    const { tags, inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
    return (
      <>
        {true && (
          <AutoComplete
            options={this.state.options}
            style={{
            width: 200,
            }}
            // TODO: onSelect auto create tag 
            placeholder="#tags"
            ref={this.saveInputRef}
            type="text"
            size="middle"
            className="tag-input"
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            >
               <Input onPressEnter={this.handleInputConfirm} bordered={false}/>
          </AutoComplete> 
        )}
        {/* {!inputVisible && (
          <Tag className="site-tag-plus" onClick={this.showInput} color="blue">
            <PlusOutlined /> New Tag
          </Tag>
        )} */}
        {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <AutoComplete
              options={this.state.options}
              style={{
              width: 200,
              }}
              placeholder="#tags"
              ref={this.saveEditInputRef}
              key={tag}
              className="tag-input"
              value={editInputValue}
              onChange={this.handleEditInputChange}
              onBlur={this.handleEditInputConfirm}
              >
              <Input
                onPressEnter={this.handleEditInputConfirm}
                size="small"
              />
              </AutoComplete>
            );
          }

          const isLongTag = tag.length > 20;

          const tagElem = (
            <Tag
              className="edit-tag"
              key={tag}
              closable={true}
              onClose={() => this.handleClose(tag)}
              color="blue"
            >
              <span
                onDoubleClick={e => {
                  this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                    this.editInput.focus();
                  });
                  e.preventDefault();
                }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
      </>
    );
  }
}

export default InputTags; 
