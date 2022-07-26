import {
  DesktopOutlined,
  FileTextOutlined,
  KeyOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { bindActionCreators } from "redux";
import React from "react";
import { Layout, Menu, message } from "antd";
import { TotalSectionState, actions } from "./reducers/root.js";
import { connect } from "react-redux";
import Post from "./component/post";
import User from "./component/user";
import HotSearch from "./component/hotsearch";
import Reply from "./component/Reply";
const { change_section_state, clear_message } = actions;

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
    "回帖管理",
    TotalSectionState.REPLY,
    <FileTextOutlined></FileTextOutlined>
  ),
  getItem("用户管理", TotalSectionState.USER, <UserOutlined></UserOutlined>),
  getItem(
    "热搜管理",
    TotalSectionState.HOT_SERACH,
    <SearchOutlined></SearchOutlined>
  ),
];

function getComponent(state) {
  switch (state) {
    case TotalSectionState.POST:
      return <Post></Post>;
    case TotalSectionState.REPLY:
      return <Reply></Reply>;
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

  componentDidUpdate(prevProps) {
    if (
      prevProps.message.type !== this.props.message.type &&
      this.props.message.type !== -1
    ) {
      this.spawnMessage();
    }
  }

  spawnMessage = () => {
    if (this.props.message.type === 1) {
      message.success(this.props.message.content);
    } else if (this.props.message.type === 2) {
      message.error(this.props.message.content);
    } else if (this.props.message.type === 3) {
      message.warning(this.props.message.content);
    }
    this.props.clear_message();
    return false;
  };

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
    clear_message: bindActionCreators(clear_message, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
