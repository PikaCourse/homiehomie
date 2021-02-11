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
import { Fragment, useState } from "react";
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
  const exampleTags = ["help", "lol"];
  const [visible, setVisible] = useState(false);
  return (
    <Fragment>
      <Card
        style={{ width: 500, margin: "1rem" }}
        hoverable
        onClick={() => setVisible(true)}
        bodyStyle={{ paddingBottom: 0, paddingTop: "1rem" }}
      >
        <PostCardSubtitle name="John Doe" timestamp="4" />
        <PostCardTitle
          title="Have a Question about SQLite"
          tags={exampleTags}
        />
        <PostCardContent content="This is a test post card" />
        <PostCardToolkit like="10" dislike="11" />
      </Card>
      <Modal
        title="CS3114: Have a Question about SQLite "
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
          <PostCardSubtitle name="John Doe" timestamp="4" />
          <PostCardTitle
            title="Have a Question about SQLite"
            tags={exampleTags}
          />
          <PostCardContent content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." />
          <PostCardToolkit like="10" dislike="11" />
        </Card>

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
 * Post Card Subtitle subcomponent for PostCard
 * @param  name: the name of the author
 * @param  timestamp: the creat_at of this post
 */
const PostCardSubtitle = (props) => (
  <p className="text-left mb-0" style={{ color: "grey", fontSize: "0.7rem" }}>
    Post by {props.name} {props.timestamp} hours ago
  </p>
);

/**
 * Post Card title subcomponent for PostCard
 * @param  title: the title of the post
 * @param  tags: the tags of this post
 */
const PostCardTitle = (props) => (
  <p
    className="text-left my-1"
    style={{ color: "black", fontSize: "1.3rem", fontWeight: "700" }}
  >
    {props.title}
    {props.tags.map((tag) => (
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
  <p className="text-left mb-0">{props.content}</p>
);

/**
 * Post Card Content subcomponent for PostCard
 * @param like: the number of likes of the post
 * @param dislike: the number of dislikes of the post
 */
const PostCardToolkit = (props) => (
  <p className="text-left m-0">
    <Space size="small" split={<Divider type="vertical" />}>
      <Button
        className="float-left"
        icon={<CommentOutlined />}
        style={{ border: "none", color: "grey" }}
      />

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
