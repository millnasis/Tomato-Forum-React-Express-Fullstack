import React from "react";
import formatDate from "../../../tools/LocalDate";
import { List } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReactWEditor from "wangeditor-for-react";
import { Comment, Tooltip, Avatar, Button, Divider, Pagination } from "antd";
import CommentInReply from "./CommentInReply";
import ClickLike from "./Like";
import { actions } from "../../../reducers/postContentPage";
import { actions as rootActions } from "../../../reducers/root";
import { actions as uiActions } from "../../../reducers/ui";
const { change_comment_editor, post_new_comment, reset_post_new_comment } =
  actions;
const { set_message } = rootActions;
const { show_login_modal } = uiActions;

class InnerReply extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      html: "",
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.responseToPostComment !== this.props.responseToPostComment &&
      this.props.responseToPostComment
    ) {
      this.setState({
        html: "",
      });
    }
  }

  render() {
    const R = this;
    function spawnCommentActions(item, index) {
      const actions = [
        <ClickLike
          target="reply"
          id={item.id}
          likeList={item.likeList}
        ></ClickLike>,
        <span
          onClick={() => {
            R.props.isUserLogin
              ? R.props.change_comment_editor(
                  item.id,
                  item.id,
                  item.publisher,
                  false
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
      <List
        className="main-post-reply-list"
        dataSource={this.props.list}
        renderItem={(item, index) => {
          const { publisher } = item;
          return (
            <List.Item
              style={{ flexWrap: "wrap" }}
              extra={
                <div>
                  <span style={{ color: "#ccc", padding: "3px" }}>
                    {item.count}楼
                  </span>
                  {this.props.isUserLogin &&
                    item.publisher._id === this.props.userInfo.id && (
                      <span style={{ marginLeft: "4px" }} className="delete">
                        删除
                      </span>
                    )}
                </div>
              }
            >
              <Comment
                actions={spawnCommentActions(item, index)}
                author={<a>{publisher.username}</a>}
                avatar={<Avatar src={publisher.head_picture}></Avatar>}
                content={
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                }
                datetime={<span>{formatDate(new Date(item.foundtime))}</span>}
              >
                <CommentInReply
                  commentCount={item.commentCount}
                  comments={item.comments}
                  masterID={item.id}
                  change_comment_editor={this.props.change_comment_editor}
                  responseToPostComment={this.props.responseToPostComment}
                  reset_post_new_comment={this.props.reset_post_new_comment}
                  set_message={this.props.set_message}
                  show_login_modal={this.props.show_login_modal}
                  isUserLogin={this.props.isUserLogin}
                  userInfo={this.props.userInfo}
                ></CommentInReply>
              </Comment>
              {this.props.commentEditor.replyID === item.id && (
                <div className="main-post-reply-single-textarea">
                  <div className="main-post-reply-single-textarea-avatar">
                    <Avatar
                      src={this.props.userInfo.head_picture}
                      size={"large"}
                      style={{ marginBottom: "10px" }}
                    ></Avatar>
                    <span>{this.props.userInfo.username}</span>
                  </div>
                  <ReactWEditor
                    style={{
                      flex: "1",
                      maxWidth: "32vw",
                    }}
                    config={{
                      menus: ["bold", "emoticon", "underline", "undo", "redo"],
                      height: 60,
                      showFullScreen: false,
                      placeholder: this.props.commentEditor.isMention
                        ? `回复 @${this.props.commentEditor.targetUser.username}: `
                        : "",
                    }}
                    onChange={(html) => {
                      this.setState({ html });
                    }}
                  ></ReactWEditor>
                  <Button
                    type="primary"
                    style={{ marginTop: "60px", marginLeft: "30px" }}
                    loading={this.props.isFetchingPostNewReply}
                    onClick={() => {
                      this.props.isUserLogin
                        ? this.props.post_new_comment(
                            item.id,
                            this.props.userInfo.id,
                            this.state.html,
                            this.props.commentEditor.isMention,
                            this.props.commentEditor.isMention
                              ? this.props.commentEditor.targetID
                              : null,
                            this.props.commentEditor.isMention
                              ? this.props.commentEditor.targetUser._id
                              : null
                          )
                        : this.props.show_login_modal();
                    }}
                  >
                    回复
                  </Button>
                </div>
              )}
            </List.Item>
          );
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    commentEditor: state.postContentPageState.commentEditor,
    isFetchingPostNewReply: state.postContentPageState.isFetchingPostNewReply,
    responseToPostComment: state.postContentPageState.responseToPostComment,
    userInfo: state.globalState.userInfo,
    isUserLogin: state.globalState.isUserLogin,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    change_comment_editor: bindActionCreators(change_comment_editor, dispatch),
    post_new_comment: bindActionCreators(post_new_comment, dispatch),
    reset_post_new_comment: bindActionCreators(
      reset_post_new_comment,
      dispatch
    ),
    set_message: bindActionCreators(set_message, dispatch),
    show_login_modal: bindActionCreators(show_login_modal, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InnerReply);
