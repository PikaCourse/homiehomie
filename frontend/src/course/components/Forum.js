/**
 * File name:	Forum.js
 * Created:	02/2/2021
 * Author:	Marx Wang
 * Email:	boyuan@vt.edu
 * Version:	1.2 Initial file
 * Description:	Forum react component for the forum
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
} from "antd";
import React,{ Fragment, useState } from "react";
import {
  LikeFilled,
  DislikeFilled,
  ShareAltOutlined,
  CommentOutlined,
  FlagFilled,
} from "@ant-design/icons";

function Forum() {
  return (
    <Fragment>
      <PostCard />
      <PostCard />
      <PostCard />
    </Fragment>
  );
}

/**
 * Post Card component for Forum
 * @param {object} post: post object that has info about author, timestamp, title and so on.
 */

function PostCard() {
  // For dummy content
  //const titleexample = "optional title"
  const timestampexample = "4hrs"
  const contentexample = "This is a test post card"
  const nameexample = "Jo Biden"
  // Tags container
  const exampleTags = ["#help", "#lol"];
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
        name = {nameexample} 
        timestamp = {timestampexample} 
        avatar={
        <Avatar
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          alt="Han Solo"
        />
        }
        toolkit = { <PostCardToolkit like="10" dislike="11" comment = "18"/> }
        //title = { <PostCardTitle thetitle = {titleexample}/>}
        content = {contentexample}
        tags = { <PostCardTags thetags = {exampleTags}/>}
        />
        <PostCardToolkit like="10" dislike="11" comment = "18"/>
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
        name = {nameexample} 
        timestamp = {timestampexample} 
        avatar={
        <Avatar
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          alt="Han Solo"
        />
        }
        toolkit = { <PostCardToolkit like="10"  dislike="11"  comment = "18"/>}
        //title = { <PostCardTitle thetitle = {titleexample}/>}
        content = {contentexample}
        tags = { <PostCardTags thetags = {exampleTags}/>}     
        />
        <PostCardToolkit like="10" dislike="11" comment = "18"/>
        </Card>

        {/* post comments */}
        <Card
          bordered={false}
          style={{ width: "100%" }}
          bodyStyle={{ paddingTop: 0 }}
        >
          <PostComment>
            <PostComment>
              <PostComment />
              <PostComment />
            </PostComment>
          </PostComment>
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
    actions = {props.toolkit}
    author = {props.name}
    avatar = {props.avatar}
    content = {
    <p>
      {props.title}
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

const PostComment = ({ children }) => (
  <Comment
    actions={[<span key="comment-nested-reply-to">Reply to</span>]}
    author={<a href="#">Han Solo</a>}
    avatar={
      <Avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt="Han Solo"
      />
    }
    content={
      <p>
        We supply a series of design principles, practical patterns and high
        quality design resources (Sketch and Axure).
      </p>
    }
  >
    {children}
  </Comment>
);

export default Forum;
