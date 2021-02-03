/**
 * File name:	Forum.js
 * Created:	02/2/2021
 * Author:	Marx Wang
 * Email:	boyuan@vt.edu
 * Version:	1.0 Initial file
 * Description:	Forum react component for the forum
 */
import { Card, Tag, Button } from "antd";
import { Fragment } from "react";
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
  return (
    <Card style={{ width: 500, margin: "1rem" }} hoverable>
      <PostCardSubtitle name="John Doe" timestamp="4" />
      <PostCardTitle title="Have a Question about SQLite" tags={exampleTags} />
      <PostCardContent content="This is a test post card" />
      <PostCardToolkit like="10" dislike="1" />
    </Card>
  );
}

/**
 * Post Card Subtitle subcomponent for PostCard
 * @param  name: the name of the author
 * @param  timestamp: the creat_at of this post
 */
function PostCardSubtitle(props) {
  return (
    <p className="text-left mb-0" style={{ color: "grey", fontSize: "0.7rem" }}>
      Post by {props.name} {props.timestamp} hours ago
    </p>
  );
}

/**
 * Post Card title subcomponent for PostCard
 * @param  title: the title of the post
 * @param  tags: the tags of this post
 */
function PostCardTitle(props) {
  return (
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
}

/**
 * Post Card Content subcomponent for PostCard
 * @param  content: the content of the post
 */
function PostCardContent(props) {
  return <p className="text-left mb-0">{props.content}</p>;
}

/**
 * Post Card Content subcomponent for PostCard
 * @param like: the number of likes of the post
 * @param dislike: the number of dislikes of the post
 */
function PostCardToolkit(props) {
  return (
    <div>
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
    </div>
  );
}
export default Forum;
