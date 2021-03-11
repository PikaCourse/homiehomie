/**
 * File name:	Forum.js
 * Created:	02/2/2021
 * Author:	Marx Wang Ji Zhang, Joanna Fang 
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
  List, 
  Spin
} from "antd";
import React,{ Fragment, useState, useEffect} from "react";
import { getPositionOfLineAndCharacter } from "typescript";
import PostCard from "./Post"
import axios from "axios";
import queryString from "query-string";
import InfiniteScroll from 'react-infinite-scroll-component';
// npm install react-infinite-scroller --save
//  npm install --save react-infinite-scroll-component


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
/**
 * 
 * @param {*} props 
 * maxPost: maximum number of posts
 */
function Forum(props) {

  // TODO 
  // render commment
  // await? reducer/action 
  // what is course is get post api 
  // limit, amount of post to render. how to get the next 50 posts 
  // PostCard handle undefine or empty? 

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextPage, setNextPage] = useState(`api/posts?sortby=created_at&limit=${props.maxPost}`);

  const getPosts = () => {
    if (posts.length >= 100) { //stop loading more when reach 100 posts 
      setHasMore(false); 
      return;
    }
    axios.get(nextPage).then((res) => {
      //set new posts state 
      let newPostsArray = []; 
      res.data.results.forEach(function (postData, index) {
        newPostsArray.push({
          avatar : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
          timestamp : postData.created_at,
          content : postData.content,
          name : postData.poster.username, 
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
      setPosts(posts.concat(newPostsArray)); 
      
      //set loadMore and nextPage 
      if (res.data.next==null)
      {
        setHasMore(false); 
        setNextPage(null); 
      } else {
        setHasMore(true); 
        setNextPage(res.data.next); 
      }
    }); 
  }; 

  useEffect(() => {
    getPosts();
  });

  return ( 
    <Fragment>
      <InfiniteScroll
          dataLength={posts.length}
          // initialLoad={true}
          // pageStart={0}
          // loadMore={getPosts}
          next={getPosts}
          hasMore={hasMore}
          useWindow={false}
          height={props.height}
          loader={<Spin />}
          scrollThreshold={0.95}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
           
      {/* <PostCard data = {sampledata}/> */}
      {posts.map(post=>{
        return <PostCard data = {post}/>
      })}
      {/* <Button onClick={getPosts}>getPost</Button> */}
      </InfiniteScroll>
    </Fragment>
  );
}

export default Forum;
