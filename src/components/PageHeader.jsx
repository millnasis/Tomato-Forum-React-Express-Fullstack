import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Layout, Menu, Avatar, Badge } from "antd";
import { Link } from "react-router-dom";
const { Header } = Layout;
import { Input } from "antd";
import { withUseLocationHooksHOC } from "../tools/withUseLocationHooksHOC";
import { withUseNavigateHooksHOC } from "../tools/withUseNavigateHooksHOC";
const { Search } = Input;

import { actions } from "../reducers/root";
const { send_logout, set_message } = actions;

class PageHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.props.send_update_user_info();
    }
  }

  render() {
    const menuItem = [
      {
        label: <Link to="/">首页</Link>,
        key: "link-to-main",
      },
      {
        label: this.props.isUserLogin ? (
          <Link to={`/message`}>
            <Badge
              count={this.props.userInfo.msgNum.total}
              size="small"
              offset={[10, -10]}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.65)" }}>消息</span>
            </Badge>
          </Link>
        ) : (
          <span style={{ userSelect: "none" }}>消息</span>
        ),
        key: "user-info-message",
      },
      this.props.isUserLogin
        ? {
            label: (
              <Link
                to={`/user/${this.props.userInfo.id}`}
                key="link-to-post"
                style={{ color: "rgba(255,255,255,.65)", userSelect: "none" }}
              >
                {this.props.userInfo.username}
              </Link>
            ),
            icon: <Avatar src={this.props.userInfo.head_picture}></Avatar>,
            key: "user-info",
            children: [
              {
                label: <Link to={`/user/${this.props.userInfo.id}`}>设置</Link>,
                key: "user-info-setting",
              },
              {
                label: "登出",
                key: "user-info-logout",
              },
            ],
          }
        : {
            label: "登陆",
            key: "login",
          },
    ];
    return (
      <Header
        className={`page-header ${
          this.props.location.pathname === "/search" && "search-page"
        }`}
        style={{ position: "fixed", zIndex: 100, width: "100%" }}
      >
        <div className="logo" />
        <Menu
          mode="horizontal"
          theme="dark"
          items={menuItem}
          onClick={(e) => {
            if (e.key === "user-info-message" && !this.props.isUserLogin) {
              this.props.show_login_modal();
              return;
            }
            if (e.key === "login") {
              this.props.show_login_modal();
              return;
            }
            if (e.key === "user-info-logout") {
              this.props.send_logout();
              return;
            }
          }}
        ></Menu>
        {this.props.location.pathname === "/search" || (
          <Search
            placeholder="输入搜索内容"
            enterButton="搜索"
            className="search-input"
            onSearch={(value) => {
              const path = value ? `/search?keyword=${value}` : "/search";
              this.props.navigate(path);
            }}
          />
        )}
      </Header>
    );
  }
}

function mapStateToProps(state) {
  return {
    isUserLogin: state.globalState.isUserLogin,
    userInfo: state.globalState.userInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    send_logout: bindActionCreators(send_logout, dispatch),
    set_message: bindActionCreators(set_message, dispatch),
  };
}
PageHeader = withUseNavigateHooksHOC(PageHeader);
PageHeader = withUseLocationHooksHOC(PageHeader);

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);
