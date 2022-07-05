import React from "react";
import { Card, Avatar, Divider } from "antd";

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
        <Avatar
          src={publisher.head_picture}
          shape="square"
          style={{ marginRight: "10px" }}
          size={"large"}
        ></Avatar>
        {publisher.username}
        <Divider></Divider>
        {`"${publisher.words}"`}
      </Card>
    );
  }
}

export default PublisherInfo;
