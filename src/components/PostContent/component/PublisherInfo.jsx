import React from "react";
import { Card, Avatar, Divider } from "antd";
import { Link } from "react-router-dom";

class PublisherInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { publisher } = this.props.postContentBody;
    if (!publisher) {
      publisher = {
        head_picture: undefined,
        username: undefined,
        words: undefined,
      };
    }
    return (
      <Card style={{ width: "220px" }} title="作者" size="small">
        <Link to={`/user/${publisher._id}`}>
          <Avatar
            src={publisher.head_picture}
            shape="square"
            style={{ marginRight: "10px" }}
            size={"large"}
          ></Avatar>
        </Link>
        <Link to={`/user/${publisher._id}`}>{publisher.username}</Link>
        <Divider></Divider>
        {`"${publisher.words}"`}
      </Card>
    );
  }
}

export default PublisherInfo;
