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
import React,{ Fragment, useState, useEffect} from "react";
import { getPositionOfLineAndCharacter } from "typescript";
import PostCard from "./Post"
import axios from "axios";
import queryString from "query-string";

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

  const [posts, setPosts] = useState([]);


  const getPosts = () => {
    axios.get(`api/posts?courseid=2642&sortby=created_at`).then((res) => {
      let newPostsArray = []; 
      res.data.results.forEach(function (postData, index) {
        newPostsArray.push({
          avatar : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
          timestamp : postData.created_at,
          content : postData.content,
          name : "Jo Biden",
          comments : [{ name: "Trump",
            avatar:"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
            content:"this is a comment content",
            timestamp:"2hrs"}, { name:"Trump2",
            avatar:"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
            content:"this is a comment content2",
            timestamp:"2hrs"}], //array of comments
          likes : postData.like_count, //the amount of likes
          dislikes : postData.dislike_count, //dislike amount
          // Tags container
          tags : postData.tags
        }); 
      });
      setPosts(newPostsArray); 
    });
  }; 

  useEffect(() => {
    getPosts();
  });

  return ( 
    <Fragment>
      {/* <PostCard data = {sampledata}/> */}
      {posts.map(post=>{
        return <PostCard data = {post}/>
      })}
      {/* <Button onClick={getPosts}>getPost</Button> */}
    </Fragment>
  );
}

export default Forum;
