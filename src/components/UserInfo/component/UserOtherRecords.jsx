import React from "react";
import { Card } from "antd";
import { LikeFilled, MenuFoldOutlined } from "@ant-design/icons";

class UserOtherRecords extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      click,
      commentSum,
      getCommentSum,
      getReplySum,
      like,
      postSum,
      replySum,
    } = this.props.userInteractData;
    return (
      <Card className="user-info-sub-col-component">
        帖子总浏览量：{click}
        <br></br>
        总发帖数：{postSum}
        <br></br>
        总回帖数：{replySum}
        <br></br>
        总评论数：{commentSum}
        <br></br>
        <LikeFilled
          style={{
            marginRight: "10px",
            fontSize: "25px",
            marginBottom: "10px",
          }}
        />
        收获点赞数：{like}
        <br></br>
        <MenuFoldOutlined style={{ marginRight: "10px", fontSize: "25px" }} />
        收获回复数：{getReplySum}
        <br></br>
        收获评论数：{getCommentSum}
      </Card>
    );
  }
}

export default UserOtherRecords;
