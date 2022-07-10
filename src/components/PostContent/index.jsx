import React from "react";
import MainPostContent from "./component/MainPostContent";
import MainPostReply from "./component/MainPostReply";
import PublisherInfo from "./component/PublisherInfo";
import "./css/index.scss";
import WriteBoard from "./component/WriteBoard";
import { getQueryVariable } from "../../tools/getQueryVariable";
import { withUseParamsHooksHOC } from "../../tools/withUseParamsHooksHOC";
import { actions } from "../../reducers/postContentPage";
import { actions as uiActions } from "../../reducers/ui";
import { actions as postContentPageActions } from "../../reducers/postContentPage";
const { get_post_content_body, get_show_reply_array, post_new_reply } = actions;
const { show_login_modal } = uiActions;
const { change_focus_write_board } = postContentPageActions;
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const defaultLimit = 20;

class PostContent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const page = parseInt(getQueryVariable("page")) || 1;
    const { postid } = this.props.params;
    if (page === 1) {
      this.props.get_post_content_body(postid, true);
    }
    this.props.get_show_reply_array(
      postid,
      (page - 1) * defaultLimit,
      defaultLimit
    );
  }

  render() {
    const page = parseInt(getQueryVariable("page")) || 1;
    const { postid } = this.props.params;
    document.title = this.props.postContentBody.title || "番茄社区";
    return (
      <div className="post-warp">
        <div className="post-main-col post-col">
          {page <= 1 && (
            <MainPostContent
              postContentBody={this.props.postContentBody}
              userInfo={this.props.userInfo}
              show_login_modal={this.props.show_login_modal}
              isUserLogin={this.props.isUserLogin}
              replySum={this.props.replySum}
              change_focus_write_board={this.props.change_focus_write_board}
            ></MainPostContent>
          )}
          <MainPostReply
            get_post_content_body={this.props.get_post_content_body}
            get_show_reply_array={this.props.get_show_reply_array}
            showReplyArray={this.props.showReplyArray}
            replySum={this.props.replySum}
            defaultLimit={defaultLimit}
            postid={postid}
          ></MainPostReply>
          <WriteBoard
            post_new_reply={this.props.post_new_reply}
            userInfo={this.props.userInfo}
            postContentBody={this.props.postContentBody}
            responseToPostReply={this.props.responseToPostReply}
            replySum={this.props.replySum}
            isUserLogin={this.props.isUserLogin}
            show_login_modal={this.props.show_login_modal}
            change_focus_write_board={this.props.change_focus_write_board}
            focusWriteBoard={this.props.focusWriteBoard}
            defaultLimit={defaultLimit}
          ></WriteBoard>
        </div>
        <div className="post-sub-col post-col">
          <PublisherInfo
            postContentBody={this.props.postContentBody}
          ></PublisherInfo>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.postContentPageState,
    userInfo: state.globalState.userInfo,
    isUserLogin: state.globalState.isUserLogin,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_post_content_body: bindActionCreators(get_post_content_body, dispatch),
    get_show_reply_array: bindActionCreators(get_show_reply_array, dispatch),
    post_new_reply: bindActionCreators(post_new_reply, dispatch),
    show_login_modal: bindActionCreators(show_login_modal, dispatch),
    change_focus_write_board: bindActionCreators(
      change_focus_write_board,
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withUseParamsHooksHOC(PostContent));
