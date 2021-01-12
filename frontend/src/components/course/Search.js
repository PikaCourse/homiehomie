import React, { useState } from "react";
import { Input, Button, AutoComplete } from "antd";
const { Search } = Input;
import { getCourse, getCourseList } from "../../actions/course";
import { useDispatch, useSelector } from "react-redux";

const prompt = "Search subject, CRN or course name";
function WikiSearch() {
  const option = useSelector((state) => state.course.option);
  const [timer, setTimer] = useState(null);
  const [interval, setInterval] = useState(500);

  const dispatch = useDispatch();

  function searchOnChange(query) {
    clearTimeout(timer);
    if (query && query.length > 1) {
      setTimer(
        setTimeout(() => {
          dispatch(getCourseList(query));
        }, interval)
      );
    }
  }

  return (
    <AutoComplete
      // dropdownMatchSelectWidth={252}
      // style={{ width: 500 }}
      options={option}
      onSearch={(value) => searchOnChange(value)}
      onSelect={(value) => {
        dispatch(getCourse(value));
      }}
    >
      <Search
        bordered={false}
        style={{
          backgroundColor: "#ffffff",
          borderTopLeftRadius: "5rem",
          borderBottomLeftRadius: "5rem",
          borderTopRightRadius: "10rem",
          borderBottomRightRadius: "10rem",
        }}
        placeholder={prompt}
        allowClear
        enterButton={
          <Button className="mx-1" type="ghost" size="large">
            Search
          </Button>
        }
        size="large"
        type="ghost"
        onSearch={(value) => dispatch(getCourse(value))}
      />
    </AutoComplete>
  );
}

export default WikiSearch;
