import React from "react";
import UserInfoCard from "./component/UserInfoCard";
import UserOtherRecords from "./component/UserOtherRecords";
import UserPostRecords from "./component/UserPostRecords";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions, actionsType } from "../../reducers/userInfoPage";
import { withUseParamsHooksHOC } from "../../tools/withUseParamsHooksHOC";
import { actions as rootActions } from "../../reducers/root";
import { actions as uiActions } from "../../reducers/ui";

const { get_show_user_info, update_user_info, open_editor, close_editor } =
  actions;
const { show_login_modal } = uiActions;
const { query_follow, reset_follow, send_follow, send_unfollow } = rootActions;

import "./css/index.scss";

/**
 * class组件无法使用hooks
 * 将hooks制作为高阶组件，再包装给class组件，就可以获取
 */

class UserInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.get_show_user_info(this.props.params.userid);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.userid !== this.props.params.userid) {
      this.props.get_show_user_info(this.props.params.userid);
    }
    if (
      prevProps.params.userid !== this.props.params.userid ||
      prevProps.userInfo !== this.props.userInfo
    ) {
      if (!this.props.userInfo) {
        this.props.reset_follow(false);
        return;
      }
      this.props.query_follow(this.props.userInfo.id, this.props.params.userid);
    }
  }

  render() {
    return (
      <div className="user-info-warp">
        <div className="user-info-col user-info-card-warp">
          <UserInfoCard
            showUserInfo={this.props.showUserInfo}
            isFollow={this.props.isFollow}
            isMe={this.props.isMe}
            isUserLogin={this.props.isUserLogin}
            isShowEditor={this.props.isShowEditor}
            open_editor={this.props.open_editor}
            close_editor={this.props.close_editor}
            isEditorFetching={this.props.isEditorFetching}
            update_user_info={this.props.update_user_info}
            send_follow={this.props.send_follow}
            show_login_modal={this.props.show_login_modal}
            send_unfollow={this.props.send_unfollow}
          ></UserInfoCard>
        </div>
        <div className="user-info-main-col user-info-col">
          <UserPostRecords userid={this.props.params.userid}></UserPostRecords>
        </div>
        <div className="user-info-sub-col user-info-col">
          <UserOtherRecords
            userInteractData={this.props.userInteractData}
          ></UserOtherRecords>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.globalState,
    ...state.userInfoPageState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_show_user_info: bindActionCreators(get_show_user_info, dispatch),
    update_user_info: bindActionCreators(update_user_info, dispatch),
    open_editor: bindActionCreators(open_editor, dispatch),
    close_editor: bindActionCreators(close_editor, dispatch),
    query_follow: bindActionCreators(query_follow, dispatch),
    reset_follow: bindActionCreators(reset_follow, dispatch),
    send_follow: bindActionCreators(send_follow, dispatch),
    show_login_modal: bindActionCreators(show_login_modal, dispatch),
    send_unfollow: bindActionCreators(send_unfollow, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withUseParamsHooksHOC(UserInfo));
