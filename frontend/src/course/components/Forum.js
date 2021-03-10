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
import {
  LikeFilled,
  DislikeFilled,
  ShareAltOutlined,
  CommentOutlined,
  FlagFilled,
} from "@ant-design/icons";

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

/**
 * Post Card component for Forum
 * @param {object} post: post object that has info about author, timestamp, title and so on.
 */

 //function for only rendering one post card
function PostCard(props) {
  const data = props.data
  //const titleexample = "optional title"

  const avatar = data.avatar 
  //src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"

  const timestamp = data.timestamp //"4hrs"
  const content = data.content //"This is a test post card"
  const name = data.name //"Jo Biden"
  const comments = data.comments //array of comments
  const likeamount = data.likes //the amount of likes
  const disamount = data.dislikes //dislike amount
  const commentamount = data.comments.length //comment amount
  // Tags container
  const Tags = data.tags //["#help", "#lol"];
  // For module (pop out comments)
  const [visible, setVisible] = useState(false);
  return (
    <Fragment>

      {/* single card displayed. only have basic information */}
      <Card
        style={{ width: 500, margin: "1rem" }}
        hoverable
        onClick={() => setVisible(true)}
        bodyStyle={{ paddingBottom: 0, paddingTop: "1rem" }}
      >

        <PostCardContent 
        name = {name} 
        timestamp = {timestamp} 
        avatar={
        <Avatar
          src= {avatar}
        />
        }
        //toolkit = { <PostCardToolkit like="10" dislike="11" comment = "18"/> }
        //title = { <PostCardTitle thetitle = {titleexample}/>}
        content = {content}
        tags = { <PostCardTags thetags = {Tags}/>}
        />
        <PostCardToolkit like={likeamount} dislike={disamount} comment = {commentamount}/>
      </Card>

      {/* when clicked, open the post details and comments */}
      {/* post details display */}
      <Modal
        //title= {titleexample}
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={1200}
        style={{ height: "100%" }}
      >
        <Card
          bordered={false}
          style={{ width: "100%" }}
          bodyStyle={{ paddingBottom: 0, paddingTop: 0 }}
        >
          <PostCardContent 
        name = {name} 
        timestamp = {timestamp} 
        avatar={
        <Avatar
          src={avatar}
        />
        }
        //toolkit = { <PostCardToolkit like="10"  dislike="11"  comment = "18"/>}
        //title = { <PostCardTitle thetitle = {titleexample}/>}
        content = {content}
        tags = { <PostCardTags thetags = {Tags}/>}     
        />
        <PostCardToolkit like={likeamount} dislike={disamount} comment = {commentamount}/>
        </Card>

        {/* post comments */}
        <Card
          bordered={false}
          style={{ width: "100%" }}
          bodyStyle={{ paddingTop: 0 }}
        >
          <List 
          className="comment-list"
          header={`${comments.length} replies`}
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={item => (
          <li>
            <Comment
                author={item.name}
                avatar={item.avatar}
                content={item.content}
                datetime={item.timestamp}
            />
          </li>
          )}
          />
        </Card>
      </Modal>
    </Fragment>
  );
}

/**
 * Post Card title for single PostCard
 * @param thetitle: the title of the post
 */
const PostCardTitle = (props) => (
  <p
    className="text-left mb-0"
    style={{ color: "black", fontSize: "1.3rem", fontWeight: "700" }}
  >
    {props.thetitle} <br/>
  </p>
);

/**
 * Post Card tag subcomponent for PostCard
 * @param thetags: the tags of this post
 */
const PostCardTags = (props) => (
  <p
    className="text-left mb-0"
    style={{ color: "black", fontSize: "1.3rem", fontWeight: "700" }}
  >
    {props.thetags.map((tag) => (
      <Tag className="align-middle mx-1" color="red">
        {tag}
      </Tag>
    ))}
  </p>
);

/**
 * Post Card Content subcomponent for PostCard
 * @param  content: the content of the post
 */
const PostCardContent = (props) => (
  <Comment
    //actions = {props.toolkit}
    author = {props.name}
    avatar = {props.avatar}
    content = {
    <p>
      {/* props.title */}
      {props.content} <br/>
      {props.tags}
    </p>
    }
  />
);

/**
 * Post Card Content subcomponent for PostCard
 * @param like: the number of likes of the post
 * @param dislike: the number of dislikes of the post
 * @param comment: the number of comments of the post
 */
const PostCardToolkit = (props) => (
  <p className="text-left m-0">
    <Space size="small" split={<Divider type="vertical" />}>
      <Button
        className="float-left"
        icon={<CommentOutlined />}
        style={{ border: "none", color: "grey" }}
        >
          {props.comment}
      </Button>

      <Button
        className="float-left"
        icon={<LikeFilled />}
        style={{ border: "none", color: "grey" }}
      >
        {props.like}
      </Button>

      <Button
        className="mx-1 float-left"
        icon={<DislikeFilled />}
        style={{ border: "none", color: "grey" }}
      >
        {props.dislike}
      </Button>

      <Button
        className="float-left"
        icon={<ShareAltOutlined />}
        style={{ border: "none", color: "grey" }}
      />

      <Button
        className="float-left"
        icon={<FlagFilled />}
        style={{ border: "none", color: "grey" }}
      />
    </Space>
  </p>
);


export default Forum;
