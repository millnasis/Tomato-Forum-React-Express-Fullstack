import React from "react";
import { Card, Divider } from "antd";
import {
  LikeFilled,
  MenuFoldOutlined,
  EyeOutlined,
  EditOutlined,
  FormOutlined,
  CommentOutlined,
  HighlightOutlined,
} from "@ant-design/icons";

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
        <div className="user-info-sub-col-component-item">
          <EyeOutlined
            style={{
              marginRight: "10px",
              fontSize: "25px",
              marginBottom: "10px",
            }}
          ></EyeOutlined>
          帖子总浏览量：{click}
        </div>
        <Divider></Divider>
        <div className="user-info-sub-col-component-item">
          <EditOutlined
            style={{
              marginRight: "10px",
              fontSize: "25px",
              marginBottom: "10px",
            }}
          ></EditOutlined>
          总发帖数：{postSum}
        </div>
        <Divider></Divider>
        <div className="user-info-sub-col-component-item">
          <FormOutlined
            style={{
              marginRight: "10px",
              fontSize: "25px",
              marginBottom: "10px",
            }}
          ></FormOutlined>
          总回帖数：{replySum}
        </div>
        <Divider></Divider>
        <div className="user-info-sub-col-component-item">
          <CommentOutlined
            style={{
              marginRight: "10px",
              fontSize: "25px",
              marginBottom: "10px",
            }}
          ></CommentOutlined>
          总评论数：{commentSum}
        </div>
        <Divider></Divider>
        <div className="user-info-sub-col-component-item">
          <LikeFilled
            style={{
              marginRight: "10px",
              fontSize: "25px",
              marginBottom: "10px",
            }}
          />
          收获点赞数：{like}
        </div>
        <Divider></Divider>
        <div className="user-info-sub-col-component-item">
          <MenuFoldOutlined
            style={{
              marginRight: "10px",
              marginBottom: "10px",
              fontSize: "25px",
            }}
          />
          收获回复数：{getReplySum}
        </div>
        <Divider></Divider>
        <div className="user-info-sub-col-component-item">
          <HighlightOutlined
            style={{
              marginRight: "10px",
              fontSize: "25px",
            }}
          ></HighlightOutlined>
          收获评论数：{getCommentSum}
        </div>
      </Card>
    );
  }
}

export default UserOtherRecords;
