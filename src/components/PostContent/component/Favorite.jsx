import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Tooltip } from "antd";
import { actions as uiActions } from "../../../reducers/ui";
import { actions } from "../../../reducers/postContentPage";
import { StarOutlined, StarFilled } from "@ant-design/icons";
const { show_login_modal } = uiActions;
const { send_to_favorite } = actions;

class Favorite extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMeFavorite: false,
    };

    this.clickHandle = this.clickHandle.bind(this);
  }

  componentDidMount() {
    if (this.props.isUserLogin && !this.props.isUserInfoFetching) {
      const { id = undefined } = this.props.userInfo;
      if (
        this.props.favoriteList.findIndex((value) => value.userid === id) !== -1
      ) {
        this.setState({
          isMeFavorite: true,
        });
      } else {
        this.setState({
          isMeFavorite: false,
        });
      }
    } else {
      this.setState({
        isMeFavorite: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.favoriteList !== prevProps.favoriteList ||
      this.props.isUserInfoFetching !== prevProps.isUserInfoFetching
    ) {
      if (this.props.isUserLogin && !this.props.isUserInfoFetching) {
        const { id = undefined } = this.props.userInfo;
        if (
          this.props.favoriteList.findIndex((value) => value.userid === id) !==
          -1
        ) {
          this.setState({
            isMeFavorite: true,
          });
        } else {
          this.setState({
            isMeFavorite: false,
          });
        }
      } else {
        this.setState({
          isMeFavorite: false,
        });
      }
    }
  }

  clickHandle() {
    const { postid, userInfo, isUserLogin } = this.props;
    if (!isUserLogin) {
      this.props.show_login_modal();
      return;
    }
    this.props.send_to_favorite(userInfo.id, postid);
  }

  render() {
    return (
      <Tooltip title="收藏">
        {this.state.isMeFavorite ? (
          <span
            className="main-post-content-body-control-item"
            onClick={this.clickHandle}
          >
            <StarFilled></StarFilled>
            {this.props.favoriteList.length === 0
              ? "收藏"
              : this.props.favoriteList.length + "收藏"}
          </span>
        ) : (
          <span
            className="main-post-content-body-control-item"
            onClick={this.clickHandle}
          >
            <StarOutlined></StarOutlined>
            {this.props.favoriteList.length === 0
              ? "收藏"
              : this.props.favoriteList.length + "收藏"}
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
    send_to_favorite: bindActionCreators(send_to_favorite, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorite);
