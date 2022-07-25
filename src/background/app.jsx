import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { bindActionCreators } from "redux";
import React from "react";
import { Layout, Menu } from "antd";
import { TotalSectionState, actions } from "./reducers/root.js";
import { connect } from "react-redux";
import Post from "./component/post";
import User from "./component/user";
import HotSearch from "./component/hotsearch";
import Permit from "./component/permit";
const { change_section_state } = actions;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const { Content, Footer, Header, Sider } = Layout;

const items = [
  getItem(
    "帖子管理",
    TotalSectionState.POST,
    <DesktopOutlined></DesktopOutlined>
  ),
  getItem(
    "用户管理",
    TotalSectionState.USER,
    <DesktopOutlined></DesktopOutlined>
  ),
  getItem(
    "热搜管理",
    TotalSectionState.HOT_SERACH,
    <DesktopOutlined></DesktopOutlined>
  ),
  getItem(
    "权限管理",
    TotalSectionState.PERMIT,
    <DesktopOutlined></DesktopOutlined>
  ),
];

function getComponent(state) {
  switch (state) {
    case TotalSectionState.POST:
      return <Post></Post>;
    case TotalSectionState.PERMIT:
      return <Permit></Permit>;
    case TotalSectionState.HOT_SERACH:
      return <HotSearch></HotSearch>;
    case TotalSectionState.USER:
      return <User></User>;
    default:
      return <div className="warp"></div>;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  render() {
    return (
      <Layout>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={(value) => this.setState({ collapsed: value })}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={[this.props.sectionState]}
            selectedKeys={[this.props.sectionState]}
            mode="inline"
            items={items}
            onClick={(obj) => {
              this.props.change_section_state(obj.key);
            }}
          />
        </Sider>
        <Layout>
          <Content>{getComponent(this.props.sectionState)}</Content>
          <Footer></Footer>
        </Layout>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.globalState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    change_section_state: bindActionCreators(change_section_state, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
