import React from "react";
import { List, Pagination, Avatar, Badge } from "antd";
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
import { consoleDebugTool } from "../../../tools/consoleDebugTool";
import { Link } from "react-router-dom";

const singlePageLimit = 10;

function SpawnTitle(props) {
  const aList = [];
  const { likeList } = props;
  if (Array.isArray(likeList)) {
    for (let index = 0; index < likeList.length && index < 3; index++) {
      const element = likeList[index];
      if (index === likeList.length - 1 || index === 2) {
        aList.push(
          <strong key={index}>
            <Link to={`/user/${element.userid}`}>{element.user.username}</Link>
          </strong>
        );
      } else {
        aList.push(
          <strong key={index}>
            <Link to={`/user/${element.userid}`}>
              {element.user.username}、
            </Link>
          </strong>
        );
      }
    }
  } else {
    aList.push(
      <strong key={likeList._id}>
        <Link to={`/user/${likeList._id}`}>{likeList.username}</Link>
      </strong>
    );
  }
  return aList;
}

function SpawnAvatar(props) {
  const avatarList = [];
  const { likeList } = props;
  for (let index = 0; index < likeList.length && index < 3; index++) {
    const element = likeList[index];
    avatarList.push(
      <Avatar
        shape="circle"
        src={element.user.head_picture}
        key={element.userid}
      ></Avatar>
    );
  }
  return <Avatar.Group maxCount={3}>{avatarList}</Avatar.Group>;
}

function getTabCN(item) {
  const { targetType } = item;
  switch (targetType) {
    case TotalTargetType.POST: {
      return <Link to={`/post/${item.targetid}`}>帖子</Link>;
    }
    case TotalTargetType.REPLY: {
      return <Link to={`/post/${item.target.masterID}`}>回帖</Link>;
    }
    case TotalTargetType.COMMENT: {
      return <Link to={`/post/${item.target.master.masterID}`}>评论</Link>;
    }
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
              consoleDebugTool("ShowMessageBody", item);
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge count={!item.read ? "新" : 0}>
                        <SpawnAvatar likeList={item.likeList}></SpawnAvatar>
                      </Badge>
                    }
                    title={
                      <div>
                        <SpawnTitle likeList={item.likeList}></SpawnTitle>等
                        {item.likeList.length}人点赞了你的
                        {getTabCN(item)}
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
              consoleDebugTool("ShowMessageBody", item);
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge count={!item.read ? "新" : 0}>
                        <Avatar
                          src={item.userFrom.head_picture}
                          shape={"circle"}
                        ></Avatar>
                      </Badge>
                    }
                    title={
                      <div>
                        用户<SpawnTitle likeList={item.userFrom}></SpawnTitle>
                        回复了您的发帖&nbsp;
                        <Link to={`/post/${item.target.masterID}`}>
                          {item.target.master.title}
                        </Link>
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
              consoleDebugTool("showmessagebody", item);
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge count={!item.read ? "新" : 0}>
                        <Avatar
                          src={item.userFrom.head_picture}
                          shape={"circle"}
                        ></Avatar>
                      </Badge>
                    }
                    title={
                      item.target.isMention ? (
                        <div>
                          用户
                          <SpawnTitle likeList={item.userFrom}></SpawnTitle>
                          评论了您的
                          <Link to={`/post/${item.target.master.masterID}`}>
                            评论
                          </Link>
                        </div>
                      ) : (
                        <div>
                          用户
                          <SpawnTitle likeList={item.userFrom}></SpawnTitle>
                          评论了您的
                          <Link to={`/post/${item.target.masterID}`}>回帖</Link>
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
      case TotalTab.FOLLOW: {
        console.log(showMessageArray);
        return (
          <List
            header={<MessageControl position="top"></MessageControl>}
            dataSource={showMessageArray}
            renderItem={(item) => {
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge count={!item.read ? "新" : 0}>
                        <Avatar
                          src={item.userFrom.head_picture}
                          shape={"circle"}
                        ></Avatar>
                      </Badge>
                    }
                    title={
                      <div>
                        用户
                        <SpawnTitle likeList={item.userFrom}></SpawnTitle>
                        关注了您
                      </div>
                    }
                    description={
                      <div>
                        <div>{formatDate(item.lastUpdate)}</div>
                      </div>
                    }
                  ></List.Item.Meta>
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
