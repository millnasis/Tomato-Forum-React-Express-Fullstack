import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Layout, Menu, Avatar } from "antd";
import { Link } from "react-router-dom";
const { Header } = Layout;
import { Input } from "antd";
import { withUseLocationHooksHOC } from "../tools/withUseLocationHooksHOC";
const { Search } = Input;

import { actions } from "../reducers/root";
const { send_logout, set_message } = actions;

class PageHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Header
        className={`page-header ${
          this.props.location.pathname === "/search" && "search-page"
        }`}
        style={{ position: "fixed", zIndex: 100, width: "100%" }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">
            <Link to="/" key="link-to-main">
              首页
            </Link>
          </Menu.Item>
          <Menu.Item key="user-info-message">
            <Link to={`/message`}>消息</Link>
          </Menu.Item>
          {this.props.isUserLogin ? (
            <Menu.SubMenu
              key="user-info"
              icon={<Avatar src={this.props.userInfo.head_picture}></Avatar>}
              title={
                <Link
                  to={`/user/${this.props.userInfo.id}`}
                  key="link-to-post"
                  style={{ color: "rgba(255,255,255,.65)" }}
                >
                  {this.props.userInfo.username}
                </Link>
              }
            >
              <Menu.ItemGroup>
                <Menu.Item key="user-info-setting">
                  <Link to={`/user/${this.props.userInfo.id}`}>设置</Link>
                </Menu.Item>
                <Menu.Item
                  key="user-info-logout"
                  onClick={() => {
                    this.props.send_logout();
                  }}
                >
                  登出
                </Menu.Item>
              </Menu.ItemGroup>
            </Menu.SubMenu>
          ) : (
            <Menu.Item
              key="login"
              onClick={() => {
                this.props.show_login_modal();
              }}
            >
              登陆后的世界更精彩！
            </Menu.Item>
          )}
        </Menu>

        {this.props.location.pathname === "/search" || (
          <Search
            placeholder="输入搜索内容"
            enterButton="Search"
            className="search-input"
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withUseLocationHooksHOC(PageHeader));
