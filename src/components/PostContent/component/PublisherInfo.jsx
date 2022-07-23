import React from "react";
import { Card, Avatar, Divider, Button } from "antd";
import { Link } from "react-router-dom";

class PublisherInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { postContentBody, isFollow } = this.props;
    let { publisher } = postContentBody;
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
        {this.props.userInfo.id !== publisher._id ? (
          !isFollow ? (
            <Button
              type="primary"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                if (!this.props.isUserLogin) {
                  this.props.show_login_modal();
                  return;
                }
                this.props.send_follow(publisher._id);
              }}
            >
              关注
            </Button>
          ) : (
            <Button
              type="ghost"
              style={{ marginLeft: "10px", color: "gray" }}
              onClick={() => {
                this.props.send_unfollow(publisher._id);
              }}
            >
              已关注
            </Button>
          )
        ) : (
          <></>
        )}
        <Divider></Divider>
        {`"${publisher.words}"`}
      </Card>
    );
  }
}

export default PublisherInfo;
