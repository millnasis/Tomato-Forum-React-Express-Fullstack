import React from "react";
import { Divider, Tooltip, List, Comment, Avatar } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import formatDate from "../../../tools/LocalDate";
import ClickLike from "./Like";
import Favorite from "./Favorite";

class MainPostContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, click, content, foundtime, id } = this.props.postContentBody;
    let { publisher, likeList, favorite } = this.props.postContentBody;
    if (!publisher) {
      publisher = {
        head_picture: undefined,
        username: undefined,
        words: undefined,
      };
    }
    if (!likeList) {
      likeList = [];
    }
    if (!favorite) {
      favorite = [];
    }
    const {
      head_picture = undefined,
      username = undefined,
      words = undefined,
    } = publisher;
    return (
      <div className="main-post-content-warp post-main-col-component">
        <h1>
          <strong>{title}</strong>
        </h1>
        <p className="main-post-content-message">
          {`${formatDate(new Date(foundtime))} | ${username} | ${click}浏览 | ${
            this.props.replySum || 0
          }回复 | ${likeList.length}点赞 | ${favorite.length}收藏`}
        </p>

        <div
          className="main-post-content-body"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        <Divider></Divider>
        <div className="main-post-content-body-control">
          <ClickLike target="post" likeList={likeList} id={id}></ClickLike>
          <Tooltip title="回复">
            <span
              className="main-post-content-body-control-item"
              onClick={() => {
                if (!this.props.isUserLogin) {
                  this.props.show_login_modal();
                  return;
                }
                const editor = document.querySelectorAll(".w-e-text");
                editor[editor.length - 1].focus();
              }}
            >
              <CommentOutlined></CommentOutlined>
              回复
            </span>
          </Tooltip>
          <Favorite postid={id} favoriteList={favorite}></Favorite>
          {this.props.isUserLogin && publisher._id === this.props.userInfo.id && (
            <span className="delete" style={{ marginLeft: "auto" }}>
              删除
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default MainPostContent;
