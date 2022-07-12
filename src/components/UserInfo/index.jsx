import React from "react";
import UserInfoCard from "./component/UserInfoCard";
import UserOtherRecords from "./component/UserOtherRecords";
import UserPostRecords from "./component/UserPostRecords";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions, actionsType } from "../../reducers/userInfoPage";
import { withUseParamsHooksHOC } from "../../tools/withUseParamsHooksHOC";

const { get_show_user_info, update_user_info, open_editor, close_editor } =
  actions;
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
  }

  render() {
    console.log(this.props);
    return (
      <div className="user-info-warp">
        <div className="user-info-col user-info-card-warp">
          <UserInfoCard
            showUserInfo={this.props.showUserInfo}
            isMe={this.props.isMe}
            isShowEditor={this.props.isShowEditor}
            open_editor={this.props.open_editor}
            close_editor={this.props.close_editor}
            isEditorFetching={this.props.isEditorFetching}
            update_user_info={this.props.update_user_info}
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
    ...state.userInfoPageState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_show_user_info: bindActionCreators(get_show_user_info, dispatch),
    update_user_info: bindActionCreators(update_user_info, dispatch),
    open_editor: bindActionCreators(open_editor, dispatch),
    close_editor: bindActionCreators(close_editor, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withUseParamsHooksHOC(UserInfo));
