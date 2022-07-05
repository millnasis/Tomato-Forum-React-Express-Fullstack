import React from "react";
import { List, Pagination, Avatar } from "antd";
import MessageControl from "./MessageControl";
import { connect } from "react-redux";
import {
  actions,
  TotalTab,
  TotalTargetType,
} from "../../../reducers/userMessagePage";
const { get_show_message_array, switch_tab } = actions;
import formatDate from "../../../tools/LocalDate";
import htmlToText from "../../../tools/htmlToText";
import { withUseNavigateHooksHOC } from "../../../tools/withUseNavigateHooksHOC";
import { bindActionCreators } from "redux";

const singlePageLimit = 10;

function SpawnTitle(props) {
  let aList = [];
  const { likeList } = props;
  for (let index = 0; index < likeList.length && index < 3; index++) {
    const element = likeList[index];
    if (index === likeList.length - 1 || index === 2) {
      aList.push(
        <strong key={index}>
          <a>{element.user.username}</a>
        </strong>
      );
    } else {
      aList.push(
        <strong key={index}>
          <a>{element.user.username}</a>、
        </strong>
      );
    }
  }
  return aList;
}

function getTabCN(tab) {
  switch (tab) {
    case TotalTargetType.POST:
      return <a>帖子</a>;
    case TotalTargetType.REPLY:
      return <a>回帖</a>;
    case TotalTargetType.COMMENT:
      return <a>评论</a>;
    default:
      break;
  }
}

class ShowMessageBody extends React.Component {
  constructor(props) {
    super(props);

    this.renderList = this.renderList.bind(this);
  }

  componentDidMount() {
    this.props.switch_tab(TotalTab.LIKE);
    if (this.props.userInfo.id) {
      this.props.get_show_message_array(
        this.props.userInfo.id,
        TotalTab.LIKE,
        0
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isUserInfoFetching && !this.props.isUserInfoFetching) {
      if (this.props.isUserLogin) {
        this.props.get_show_message_array(
          this.props.userInfo.id,
          TotalTab.LIKE,
          0
        );
      } else {
        this.props.navigate("/", { replace: true });
      }
    }
  }

  renderList() {
    const { nowTab, showMessageArray, messageSum, userInfo } = this.props;
    switch (nowTab) {
      case TotalTab.LIKE: {
        return (
          <List
            header={<MessageControl position="top"></MessageControl>}
            dataSource={showMessageArray}
            renderItem={(item) => {
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.likeList[0].user.head_picture}
                        shape={"circle"}
                      ></Avatar>
                    }
                    title={
                      <div>
                        <SpawnTitle likeList={item.likeList}></SpawnTitle>等
                        {item.likeList.length}人点赞了你的
                        {getTabCN(item.targetType)}
                      </div>
                    }
                    description={formatDate(item.lastUpdate)}
                  ></List.Item.Meta>
                  <span style={{ color: "gray" }}>
                    {
                      <div className="contentEllipsis">
                        {item.targetType === "post"
                          ? item.target.title
                          : htmlToText(item.target.content)}
                      </div>
                    }
                  </span>
                </List.Item>
              );
            }}
          >
            {messageSum > singlePageLimit && (
              <Pagination
                total={messageSum}
                pageSize={singlePageLimit}
                onChange={(page, pageSize) => {
                  this.props.get_show_message_array(
                    userInfo.id,
                    nowTab,
                    (+page - 1) * pageSize
                  );
                }}
              ></Pagination>
            )}
          </List>
        );
      }
      case TotalTab.REPLY: {
        return (
          <List
            header={<MessageControl position="top"></MessageControl>}
            dataSource={showMessageArray}
            renderItem={(item) => {
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.userFrom.head_picture}
                        shape={"circle"}
                      ></Avatar>
                    }
                    title={
                      <div>
                        用户<a>{item.userFrom.username}</a>回复了您的发帖
                        <a>{item.target.master.title}</a>
                      </div>
                    }
                    description={
                      <div>
                        <div className="contentEllipsis">
                          {htmlToText(item.target.content)}
                        </div>
                        <div>{formatDate(item.lastUpdate)}</div>
                      </div>
                    }
                  ></List.Item.Meta>
                  <span style={{ color: "gray" }}>
                    {
                      <div className="contentEllipsis">
                        {htmlToText(item.target.master.content)}
                      </div>
                    }
                  </span>
                </List.Item>
              );
            }}
          >
            {messageSum > singlePageLimit && (
              <Pagination
                total={messageSum}
                pageSize={singlePageLimit}
                onChange={(page, pageSize) => {
                  this.props.get_show_message_array(
                    userInfo.id,
                    nowTab,
                    (+page - 1) * pageSize
                  );
                }}
              ></Pagination>
            )}
          </List>
        );
      }
      case TotalTab.COMMENT: {
        return (
          <List
            header={<MessageControl position="top"></MessageControl>}
            dataSource={showMessageArray}
            renderItem={(item) => {
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.userFrom.head_picture}
                        shape={"circle"}
                      ></Avatar>
                    }
                    title={
                      item.target.isMention ? (
                        <div>
                          用户<a>{item.userFrom.username}</a>回复了您的
                          <a>评论</a>
                        </div>
                      ) : (
                        <div>
                          用户<a>{item.userFrom.username}</a>回复了您的
                          <a>回帖</a>
                        </div>
                      )
                    }
                    description={
                      <div>
                        <div className="contentEllipsis">
                          {item.target.isMention
                            ? htmlToText(
                                `回复@${item.target.mentionUser.username}: ${item.target.content}`
                              )
                            : htmlToText(item.target.content)}
                        </div>
                        <div>{formatDate(item.lastUpdate)}</div>
                      </div>
                    }
                  ></List.Item.Meta>
                  <span style={{ color: "gray" }}>
                    {
                      <div className="contentEllipsis">
                        {item.target.isMention
                          ? htmlToText(item.target.mention.content)
                          : htmlToText(item.target.master.content)}
                      </div>
                    }
                  </span>
                </List.Item>
              );
            }}
          >
            {messageSum > singlePageLimit && (
              <Pagination
                total={messageSum}
                pageSize={singlePageLimit}
                onChange={(page, pageSize) => {
                  this.props.get_show_message_array(
                    userInfo.id,
                    nowTab,
                    (+page - 1) * pageSize
                  );
                }}
              ></Pagination>
            )}
          </List>
        );
      }
      default:
        break;
    }
  }

  render() {
    return (
      <div className="user-message-col user-message-body">
        {this.renderList(
          this.props.nowTab,
          this.props.showMessageArray,
          this.props.messageSum,
          this.props.userInfo
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.userMessagePageState,
    userInfo: state.globalState.userInfo,
    isFetching: state.globalState.isFetching,
    isUserLogin: state.globalState.isUserLogin,
    isUserInfoFetching: state.globalState.isUserInfoFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_show_message_array: bindActionCreators(
      get_show_message_array,
      dispatch
    ),
    switch_tab: bindActionCreators(switch_tab, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withUseNavigateHooksHOC(ShowMessageBody));
