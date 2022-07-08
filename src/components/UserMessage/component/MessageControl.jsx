import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { MessageOutlined } from "@ant-design/icons";
import { Divider, Badge } from "antd";
import { actions, TotalTab } from "../../../reducers/userMessagePage";
const { switch_tab, get_show_message_array } = actions;
const msgTypeArr = [
  TotalTab.LIKE,
  TotalTab.REPLY,
  TotalTab.COMMENT,
  TotalTab.MEMTION,
];

const ControlLi = (props) => {
  function getShowText(props) {
    switch (props.tabkey) {
      case TotalTab.LIKE:
        return "收到的赞";
      case TotalTab.REPLY:
        return "我的回帖";
      case TotalTab.COMMENT:
        return "评论我的";
      case TotalTab.MEMTION:
        return "@ 我的";
    }
  }
  return (
    <li
      className={
        "user-message-control-li " + (props.nowTab === props.tabkey && "active")
      }
      onClick={() => {
        props.switch_tab(props.tabkey);
        props.get_show_message_array(props.userInfo.id, props.tabkey, 0);
      }}
    >
      {props.userInfo.msgNum ? (
        <Badge
          dot
          count={
            props.tabkey in props.userInfo.msgNum
              ? props.userInfo.msgNum[props.tabkey]
              : 0
          }
        >
          {getShowText(props)}
        </Badge>
      ) : (
        getShowText(props)
      )}
    </li>
  );
};

class MessageControl extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul
        className={
          this.props.position === "left"
            ? "user-message-col user-message-control-left"
            : "user-message-control-top"
        }
      >
        {this.props.position === "left" ? (
          <strong className="user-message-control-title">
            <MessageOutlined />
            消息中心
          </strong>
        ) : null}
        {this.props.position === "left" && <Divider></Divider>}
        {msgTypeArr.map((v) => {
          return (
            <ControlLi
              nowTab={this.props.nowTab}
              switch_tab={this.props.switch_tab}
              tabkey={v}
              userInfo={this.props.userInfo}
              get_show_message_array={this.props.get_show_message_array}
              key={v}
            ></ControlLi>
          );
        })}
        {/* <ControlLi
          nowTab={this.props.nowTab}
          switch_tab={this.props.switch_tab}
          tabkey={TotalTab.LIKE}
          userid={this.props.userInfo.id}
          get_show_message_array={this.props.get_show_message_array}
        ></ControlLi>
        <ControlLi
          nowTab={this.props.nowTab}
          switch_tab={this.props.switch_tab}
          userid={this.props.userInfo.id}
          get_show_message_array={this.props.get_show_message_array}
          tabkey={TotalTab.REPLY}
        ></ControlLi>
        <ControlLi
          nowTab={this.props.nowTab}
          switch_tab={this.props.switch_tab}
          userid={this.props.userInfo.id}
          tabkey={TotalTab.COMMENT}
          get_show_message_array={this.props.get_show_message_array}
        ></ControlLi>
        <ControlLi
          userid={this.props.userInfo.id}
          nowTab={this.props.nowTab}
          switch_tab={this.props.switch_tab}
          tabkey={TotalTab.MEMTION}
          get_show_message_array={this.props.get_show_message_array}
        ></ControlLi> */}
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.userMessagePageState,
    userInfo: state.globalState.userInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    switch_tab: bindActionCreators(switch_tab, dispatch),
    get_show_message_array: bindActionCreators(
      get_show_message_array,
      dispatch
    ),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MessageControl);
