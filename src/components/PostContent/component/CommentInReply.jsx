import React from "react";
import axios from "axios";
import { Comment, Tooltip, Avatar, Button, Divider, Pagination } from "antd";
import { List } from "antd";
import ClickLike from "./Like";
import formatDate from "../../../tools/LocalDate";
import { Link } from "react-router-dom";

const defaultPageLimit = 5;

class CommentInReply extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      list: [],
      sum: 0,
    };

    this.toPage = this.toPage.bind(this);
    this.clickToLikeCommentHandle = this.clickToLikeCommentHandle.bind(this);
  }

  componentDidMount() {
    this.setState({
      list: this.props.comments,
      sum: this.props.commentCount,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.commentCount !== this.props.commentCount) {
      this.setState({
        sum: this.props.commentCount,
      });
    }
    if (prevProps.comments !== this.props.comments && this.props.comments) {
      this.setState({
        list: this.props.comments,
      });
    }
    if (
      prevProps.responseToPostComment !== this.props.responseToPostComment &&
      this.props.responseToPostComment === this.props.masterID
    ) {
      this.toPage();
      this.props.reset_post_new_comment();
    }
  }

  async toPage(page = this.state.page) {
    try {
      let ret = await axios.get(
        `/api/post/reply/${this.props.masterID}/comment`,
        {
          params: {
            skip: (page - 1) * defaultPageLimit,
            limit: defaultPageLimit,
          },
        }
      );
      this.setState({
        list: ret.data.commentArray,
        page: page,
        sum: ret.data.commentCount,
      });
    } catch (error) {
      this.props.set_message(2, "获取失败");
    }
  }

  async clickToLikeCommentHandle(replyid, commentid, publisher) {
    try {
      let ret = await axios.post(
        `/api/post/reply/${replyid}/comment/${commentid}/like`,
        { publisher }
      );
      const { data } = ret;
      this.setState({
        list: this.state.list.map((value) =>
          value.id === data.id ? { ...value, likeList: data.likeList } : value
        ),
      });
    } catch (error) {
      this.props.set_message(2, "点赞失败");
    }
  }

  render() {
    const R = this;
    function spawnCommentActions(item, index) {
      const actions = [
        <ClickLike
          target="comment"
          id={{ commentid: item.id, replyid: item.masterID }}
          clickToLikeCommentHandle={R.clickToLikeCommentHandle}
          likeList={item.likeList}
        ></ClickLike>,

        <span
          onClick={() => {
            R.props.isUserLogin
              ? R.props.change_comment_editor(
                  item.masterID,
                  item.id,
                  item.publisher,
                  true
                )
              : R.props.show_login_modal();
          }}
        >
          回复
        </span>,
      ];
      return actions;
    }

    return (
      this.state.list.length > 0 && (
        <List
          size="small"
          dataSource={this.state.list}
          renderItem={(item, index) => {
            return (
              <List.Item
                extra={
                  this.props.isUserLogin &&
                  item.publisher._id === this.props.userInfo.id && (
                    <span className="delete">删除</span>
                  )
                }
              >
                <Comment
                  actions={spawnCommentActions(item, index)}
                  author={
                    <Link to={`/user/${item.publisher._id}`}>
                      {item.publisher.username}
                    </Link>
                  }
                  avatar={
                    <Link to={`/user/${item.publisher._id}`}>
                      <Avatar src={item.publisher.head_picture}></Avatar>
                    </Link>
                  }
                  content={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.isMention
                          ? `回复 <a>@${item.mentionUser.username}</a>: ${item.content}`
                          : item.content,
                      }}
                    />
                  }
                  datetime={<span>{formatDate(new Date(item.foundtime))}</span>}
                ></Comment>
              </List.Item>
            );
          }}
        >
          {this.state.sum > defaultPageLimit && (
            <Pagination
              size="small"
              total={this.state.sum}
              pageSize={defaultPageLimit}
              style={{ marginBottom: "30px" }}
              onChange={(page, pageSize) => {
                this.toPage(page);
              }}
            ></Pagination>
          )}
        </List>
      )
    );
  }
}

export default CommentInReply;
