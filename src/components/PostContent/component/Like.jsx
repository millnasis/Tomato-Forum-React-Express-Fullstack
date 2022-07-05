import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Tooltip } from "antd";
import { LikeFilled, LikeOutlined } from "@ant-design/icons";
import { actions as uiActions } from "../../../reducers/ui";
import { actions } from "../../../reducers/postContentPage";
const { show_login_modal } = uiActions;
const { send_to_like } = actions;

class ClickLike extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMeLike: false,
    };

    this.clickHandle = this.clickHandle.bind(this);
  }

  componentDidMount() {
    if (this.props.isUserLogin && !this.props.isUserInfoFetching) {
      const { id = undefined } = this.props.userInfo;
      if (this.props.likeList.findIndex((value) => value === id) !== -1) {
        this.setState({
          isMeLike: true,
        });
      } else {
        this.setState({
          isMeLike: false,
        });
      }
    } else {
      this.setState({
        isMeLike: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.likeList !== prevProps.likeList ||
      this.props.isUserInfoFetching !== prevProps.isUserInfoFetching
    ) {
      if (this.props.isUserLogin && !this.props.isUserInfoFetching) {
        const { id = undefined } = this.props.userInfo;
        if (this.props.likeList.findIndex((value) => value === id) !== -1) {
          this.setState({
            isMeLike: true,
          });
        } else {
          this.setState({
            isMeLike: false,
          });
        }
      } else {
        this.setState({
          isMeLike: false,
        });
      }
    }
  }

  clickHandle() {
    const { target, id, userInfo, isUserLogin, clickToLikeCommentHandle } =
      this.props;
    if (!isUserLogin) {
      this.props.show_login_modal();
      return;
    }
    if (target === "comment") {
      const { replyid, commentid } = id;
      clickToLikeCommentHandle(replyid, commentid, userInfo.id);
    } else {
      this.props.send_to_like(target, id, userInfo.id);
    }
  }

  render() {
    return (
      <Tooltip>
        {this.state.isMeLike ? (
          <span
            className="main-post-content-body-control-item"
            onClick={this.clickHandle}
          >
            <LikeFilled></LikeFilled>
            {this.props.likeList.length === 0
              ? "点赞"
              : this.props.likeList.length + "点赞"}
          </span>
        ) : (
          <span
            className="main-post-content-body-control-item"
            onClick={this.clickHandle}
          >
            <LikeOutlined></LikeOutlined>
            {this.props.likeList.length === 0
              ? "点赞"
              : this.props.likeList.length + "点赞"}
          </span>
        )}
      </Tooltip>
    );
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.globalState.userInfo,
    isUserLogin: state.globalState.isUserLogin,
    isUserInfoFetching: state.globalState.isUserInfoFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    show_login_modal: bindActionCreators(show_login_modal, dispatch),
    send_to_like: bindActionCreators(send_to_like, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClickLike);
