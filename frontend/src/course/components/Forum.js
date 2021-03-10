/**
 * File name:	Forum.js
 * Created:	02/2/2021
 * Author:	Marx Wang Ji Zhang
 * Email:	boyuan@vt.edu annajz@bu.edu
 * Version:	2.0 implemented post
 * Description:	Forum react component for the forum, called in wiki.js
 */
import {
  Card,
  Tag,
  Button,
  Modal,
  Comment,
  Avatar,
  Space,
  Divider,
  List
} from "antd";
import React,{ Fragment, useState } from "react";
import PostCard from "./Post"

const sampledata = {
  avatar : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  timestamp : "4hrs",
  content : "This is a test post card",
  name : "Jo Biden",
  comments : [{ name: "Trump",
    avatar:"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
    content:"this is a comment content",
    timestamp:"2hrs"}, { name:"Trump2",
    avatar:"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
    content:"this is a comment content2",
    timestamp:"2hrs"}], //array of comments
  likes : 10, //the amount of likes
  dislikes : 11, //dislike amount
  // Tags container
  tags : ["#help", "#lol"]
}
function Forum() {
  return (
    <Fragment>
      <PostCard data = {sampledata}/>
    </Fragment>
  );
}

export default Forum;
